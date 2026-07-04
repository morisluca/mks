import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, investmentsTable, plansTable, usersTable, transactionsTable } from "../db/index.js";
import { CreateInvestmentBody, ApproveInvestmentParams, RejectInvestmentParams } from "../validators/index.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
const router = Router();
function formatInvestment(inv) {
    return {
        id: inv.id,
        userId: inv.userId,
        planId: inv.planId,
        planName: inv.planName,
        amount: parseFloat(inv.amount),
        roi: parseFloat(inv.roi),
        durationDays: inv.durationDays,
        expectedReturn: parseFloat(inv.expectedReturn),
        status: inv.status,
        startDate: inv.startDate,
        endDate: inv.endDate,
        createdAt: inv.createdAt,
    };
}
// User: list my investments
router.get("/investments", requireAuth, async (req, res) => {
    const investments = await db
        .select()
        .from(investmentsTable)
        .where(eq(investmentsTable.userId, req.user.userId));
    res.json(investments.map(formatInvestment));
});
// User: create investment
router.post("/investments", requireAuth, async (req, res) => {
    const parsed = CreateInvestmentBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { planId, amount } = parsed.data;
    // Get the plan
    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId));
    if (!plan || !plan.isActive) {
        res.status(404).json({ error: "Plan not found or inactive" });
        return;
    }
    const minAmount = parseFloat(plan.minAmount);
    const maxAmount = parseFloat(plan.maxAmount);
    if (amount < minAmount || amount > maxAmount) {
        res.status(400).json({ error: `Amount must be between ${minAmount} and ${maxAmount}` });
        return;
    }
    // Check user balance
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const userBalance = parseFloat(user.balance);
    if (userBalance < amount) {
        res.status(400).json({ error: "Insufficient balance" });
        return;
    }
    const roi = parseFloat(plan.roi);
    const expectedReturn = amount + (amount * roi / 100);
    // Deduct balance and create investment
    await db
        .update(usersTable)
        .set({ balance: String(userBalance - amount) })
        .where(eq(usersTable.id, req.user.userId));
    const [investment] = await db
        .insert(investmentsTable)
        .values({
        userId: req.user.userId,
        planId,
        planName: plan.name,
        amount: String(amount),
        roi: plan.roi,
        durationDays: plan.durationDays,
        expectedReturn: String(expectedReturn),
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
    })
        .returning();
    res.status(201).json(formatInvestment(investment));
});
// Admin: list all investments
router.get("/admin/investments", requireAdmin, async (_req, res) => {
    const investments = await db
        .select({
        investment: investmentsTable,
        user: usersTable,
    })
        .from(investmentsTable)
        .innerJoin(usersTable, eq(investmentsTable.userId, usersTable.id));
    res.json(investments.map(({ investment: inv, user }) => ({
        id: inv.id,
        userId: inv.userId,
        userEmail: user.email,
        userFullName: user.fullName,
        planId: inv.planId,
        planName: inv.planName,
        amount: parseFloat(inv.amount),
        roi: parseFloat(inv.roi),
        durationDays: inv.durationDays,
        expectedReturn: parseFloat(inv.expectedReturn),
        status: inv.status,
        startDate: inv.startDate,
        endDate: inv.endDate,
        createdAt: inv.createdAt,
    })));
});
// Process expired/completed investment
router.post("/investments/:id/complete", requireAuth, async (req, res) => {
    const params = ApproveInvestmentParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid investment ID" });
        return;
    }
    const [inv] = await db
        .select()
        .from(investmentsTable)
        .where(eq(investmentsTable.id, req.user.userId));
    if (!inv) {
        res.status(404).json({ error: "Investment not found" });
        return;
    }
    // Check if investment belongs to the requesting user
    if (inv.userId !== req.user.userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    // Check if investment status is active and has reached end date
    if (inv.status !== "active") {
        res.status(400).json({ error: "Investment is not in active state" });
        return;
    }
    const now = new Date();
    if (new Date(inv.endDate) > now) {
        res.status(400).json({ error: "Investment has not yet reached its end date" });
        return;
    }
    // Get user and add returns to their balance
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, inv.userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const newBalance = parseFloat(user.balance) + parseFloat(inv.expectedReturn);
    await db
        .update(usersTable)
        .set({ balance: String(newBalance) })
        .where(eq(usersTable.id, inv.userId));
    // Mark investment as completed
    const [completed] = await db
        .update(investmentsTable)
        .set({ status: "completed" })
        .where(eq(investmentsTable.id, params.data.id))
        .returning();
    res.json({
        message: "Investment completed successfully",
        investment: formatInvestment(completed),
        returnAmount: parseFloat(inv.expectedReturn),
        newBalance,
    });
});
// Admin: Process all expired/completed investments
router.post("/investments/complete-expired", requireAuth, async (_req, res) => {
    const now = new Date();
    // Get all active investments that have passed their end date
    const expiredInvestments = await db
        .select({
        investment: investmentsTable,
        user: usersTable,
    })
        .from(investmentsTable)
        .innerJoin(usersTable, eq(investmentsTable.userId, usersTable.id))
        .where(and(eq(investmentsTable.status, "active")));
    // Filter in-memory to check end dates (since drizzle may have timezone issues)
    const toComplete = expiredInvestments.filter(({ investment }) => investment.endDate && new Date(investment.endDate) <= now);
    if (toComplete.length === 0) {
        res.json({
            message: "No expired investments to process",
            processedCount: 0,
            totalReturns: 0,
        });
        return;
    }
    let totalReturns = 0;
    const completedIds = [];
    // Process each expired investment
    for (const { investment: inv, user } of toComplete) {
        const returnAmount = parseFloat(inv.expectedReturn);
        const newBalance = parseFloat(user.balance) + returnAmount;
        await db
            .update(usersTable)
            .set({ balance: String(newBalance) })
            .where(eq(usersTable.id, inv.userId));
        await db
            .update(investmentsTable)
            .set({ status: "completed" })
            .where(eq(investmentsTable.id, inv.id));
        totalReturns += returnAmount;
        completedIds.push(inv.id);
    }
    res.json({
        message: `Successfully processed ${toComplete.length} expired investment(s)`,
        processedCount: toComplete.length,
        totalReturns,
        investmentIds: completedIds,
    });
});
// Admin: Process all expired/completed investments
router.post("/admin/investments/complete-expired", requireAdmin, async (_req, res) => {
    const now = new Date();
    // Get all active investments that have passed their end date
    const expiredInvestments = await db
        .select({
        investment: investmentsTable,
        user: usersTable,
    })
        .from(investmentsTable)
        .innerJoin(usersTable, eq(investmentsTable.userId, usersTable.id))
        .where(and(eq(investmentsTable.status, "active")));
    // Filter in-memory to check end dates (since drizzle may have timezone issues)
    const toComplete = expiredInvestments.filter(({ investment }) => investment.endDate && new Date(investment.endDate) <= now);
    if (toComplete.length === 0) {
        res.json({
            message: "No expired investments to process",
            processedCount: 0,
            totalReturns: 0,
        });
        return;
    }
    let totalReturns = 0;
    const completedIds = [];
    // Process each expired investment
    for (const { investment: inv, user } of toComplete) {
        const returnAmount = parseFloat(inv.expectedReturn);
        const newBalance = parseFloat(user.balance) + returnAmount;
        await db
            .update(usersTable)
            .set({ balance: String(newBalance) })
            .where(eq(usersTable.id, inv.userId));
        await db
            .update(investmentsTable)
            .set({ status: "completed" })
            .where(eq(investmentsTable.id, inv.id));
        totalReturns += returnAmount;
        completedIds.push(inv.id);
    }
    res.json({
        message: `Successfully processed ${toComplete.length} expired investment(s)`,
        processedCount: toComplete.length,
        totalReturns,
        investmentIds: completedIds,
    });
});
// Admin: approve investment
router.post("/admin/investments/:id/approve", requireAdmin, async (req, res) => {
    const params = ApproveInvestmentParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid investment ID" });
        return;
    }
    const [inv] = await db
        .update(investmentsTable)
        .set({
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now()),
    })
        .where(and(eq(investmentsTable.id, params.data.id), eq(investmentsTable.status, "pending")))
        .returning();
    if (!inv) {
        res.status(404).json({ error: "Investment not found or not in pending state" });
        return;
    }
    res.json({ message: "Investment approved" });
});
// Admin: reject investment
router.post("/admin/investments/:id/reject", requireAdmin, async (req, res) => {
    const params = RejectInvestmentParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid investment ID" });
        return;
    }
    const [inv] = await db
        .select()
        .from(investmentsTable)
        .where(and(eq(investmentsTable.id, params.data.id), eq(investmentsTable.status, "pending")));
    if (!inv) {
        res.status(404).json({ error: "Investment not found or not in pending state" });
        return;
    }
    // Refund the user
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, inv.userId));
    if (user) {
        await db
            .update(usersTable)
            .set({ balance: String(parseFloat(user.balance) + parseFloat(inv.amount)) })
            .where(eq(usersTable.id, inv.userId));
    }
    await db
        .update(investmentsTable)
        .set({ status: "rejected" })
        .where(eq(investmentsTable.id, params.data.id));
    res.json({ message: "Investment rejected and amount refunded" });
});
// Admin: complete active investment with refund only (no profit)
router.post("/admin/investments/:id/complete-now", requireAdmin, async (req, res) => {
    const params = ApproveInvestmentParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid investment ID" });
        return;
    }
    const [inv] = await db
        .select()
        .from(investmentsTable)
        .where(and(eq(investmentsTable.id, params.data.id), eq(investmentsTable.status, "active")));
    if (!inv) {
        res.status(404).json({ error: "Investment not found or not in active state" });
        return;
    }
    // Refund the user (only original amount, no profit)
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, inv.userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const refundAmount = parseFloat(inv.amount);
    const newBalance = parseFloat(user.balance) + refundAmount;
    await db
        .update(usersTable)
        .set({ balance: String(newBalance) })
        .where(eq(usersTable.id, inv.userId));
    const [completed] = await db
        .update(investmentsTable)
        .set({ status: "completed" })
        .where(eq(investmentsTable.id, params.data.id))
        .returning();
    res.json({
        message: "Investment completed and amount refunded",
        investment: formatInvestment(completed),
        refundAmount,
        newBalance,
    });
});
// Admin: create transaction for user
router.post("/admin/transactions", requireAdmin, async (req, res) => {
    const { userId, amount, type } = req.body;
    if (!userId || !amount || !type) {
        res.status(400).json({ error: "userId, amount, and type are required" });
        return;
    }
    const validTypes = ["deposit", "withdrawal", "profit", "bonus", "debit"];
    if (!validTypes.includes(type)) {
        res.status(400).json({ error: "Invalid transaction type" });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat <= 0) {
        res.status(400).json({ error: "Invalid amount" });
        return;
    }
    let newBalance = parseFloat(user.balance);
    let newBonusBalance = parseFloat(user.bonusBalance);
    if (type === "deposit" || type === "profit") {
        newBalance += amountFloat;
    }
    else if (type === "withdrawal" || type === "debit") {
        if (newBalance < amountFloat) {
            res.status(400).json({ error: "Insufficient balance for withdrawal/debit" });
            return;
        }
        newBalance -= amountFloat;
    }
    else if (type === "bonus") {
        newBonusBalance += amountFloat;
    }
    // Update user balance
    await db
        .update(usersTable)
        .set({
        balance: String(newBalance),
        bonusBalance: String(newBonusBalance)
    })
        .where(eq(usersTable.id, userId));
    // Create transaction record
    const [transaction] = await db
        .insert(transactionsTable)
        .values({
        userId,
        type,
        amount: String(amountFloat),
        status: "completed",
        createdAt: new Date(),
    })
        .returning();
    res.json({
        message: "Transaction created successfully",
        transaction: {
            id: transaction.id,
            userId: transaction.userId,
            type: transaction.type,
            amount: parseFloat(transaction.amount),
            status: transaction.status,
            createdAt: transaction.createdAt,
        },
        newBalance,
        newBonusBalance,
    });
});
export default router;
