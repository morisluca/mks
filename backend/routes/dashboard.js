import { Router } from "express";
import { eq, count, sum } from "drizzle-orm";
import { db, usersTable, investmentsTable, transactionsTable } from "../db/index.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
const router = Router();
// Admin dashboard
router.get("/admin/dashboard", requireAdmin, async (_req, res) => {
    const [totalUsersRow] = await db.select({ count: count() }).from(usersTable);
    const [activeUsersRow] = await db
        .select({ count: count() })
        .from(usersTable)
        .where(eq(usersTable.status, "active"));
    const [depositsRow] = await db
        .select({ total: sum(transactionsTable.amount) })
        .from(transactionsTable)
        .where(eq(transactionsTable.type, "deposit"));
    const [withdrawalsRow] = await db
        .select({ total: sum(transactionsTable.amount) })
        .from(transactionsTable)
        .where(eq(transactionsTable.type, "withdrawal"));
    const [investmentsRow] = await db
        .select({ total: sum(investmentsTable.amount) })
        .from(investmentsTable);
    const [activeInvestmentsRow] = await db
        .select({ count: count() })
        .from(investmentsTable)
        .where(eq(investmentsTable.status, "active"));
    const [pendingDepositsRow] = await db
        .select({ count: count() })
        .from(transactionsTable)
        .where(eq(transactionsTable.status, "pending"));
    // Get recent transactions with user info
    const recentTxs = await db
        .select({
        transaction: transactionsTable,
        user: usersTable,
    })
        .from(transactionsTable)
        .innerJoin(usersTable, eq(transactionsTable.userId, usersTable.id))
        .limit(5);
    // Get recent investments with user info
    const recentInvestments = await db
        .select({
        investment: investmentsTable,
        user: usersTable,
    })
        .from(investmentsTable)
        .innerJoin(usersTable, eq(investmentsTable.userId, usersTable.id))
        .limit(5);
    res.json({
        totalUsers: Number(totalUsersRow?.count ?? 0),
        activeUsers: Number(activeUsersRow?.count ?? 0),
        totalDeposits: parseFloat(depositsRow?.total ?? "0"),
        totalWithdrawals: parseFloat(withdrawalsRow?.total ?? "0"),
        totalInvestments: parseFloat(investmentsRow?.total ?? "0"),
        activeInvestments: Number(activeInvestmentsRow?.count ?? 0),
        pendingDeposits: Number(pendingDepositsRow?.count ?? 0),
        pendingWithdrawals: 0,
        recentTransactions: recentTxs.map(({ transaction: tx, user }) => ({
            id: tx.id,
            userId: tx.userId,
            userEmail: user.email,
            userFullName: user.fullName,
            type: tx.type,
            amount: parseFloat(tx.amount),
            currency: tx.currency,
            walletAddress: tx.walletAddress,
            txHash: tx.txHash,
            status: tx.status,
            note: tx.note,
            createdAt: tx.createdAt,
        })),
        recentInvestments: recentInvestments.map(({ investment: inv, user }) => ({
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
        })),
    });
});
// User dashboard
router.get("/dashboard", requireAuth, async (req, res) => {
    const userId = req.user.userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const [investStats] = await db
        .select({
        totalInvested: sum(investmentsTable.amount),
        totalReturns: sum(investmentsTable.expectedReturn),
    })
        .from(investmentsTable)
        .where(eq(investmentsTable.userId, userId));
    const [activeInvCount] = await db
        .select({ count: count() })
        .from(investmentsTable)
        .where(eq(investmentsTable.userId, userId));
    const [completedInvCount] = await db
        .select({ count: count() })
        .from(investmentsTable)
        .where(eq(investmentsTable.userId, userId));
    const [depositStats] = await db
        .select({ totalDeposited: sum(transactionsTable.amount) })
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId));
    const recentTxs = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .limit(5);
    const activeInvestments = await db
        .select()
        .from(investmentsTable)
        .where(eq(investmentsTable.userId, userId));
    res.json({
        balance: parseFloat(user.balance),
        bonusBalance: parseFloat(user.bonusBalance),
        totalInvested: parseFloat(investStats?.totalInvested ?? "0"),
        totalReturns: parseFloat(investStats?.totalReturns ?? "0"),
        activeInvestments: Number(activeInvCount?.count ?? 0),
        completedInvestments: Number(completedInvCount?.count ?? 0),
        totalDeposited: parseFloat(depositStats?.totalDeposited ?? "0"),
        totalWithdrawn: 0,
        recentTransactions: recentTxs.map((tx) => ({
            id: tx.id,
            userId: tx.userId,
            type: tx.type,
            amount: parseFloat(tx.amount),
            currency: tx.currency,
            walletAddress: tx.walletAddress,
            txHash: tx.txHash,
            status: tx.status,
            note: tx.note,
            createdAt: tx.createdAt,
        })),
        activeInvestmentList: activeInvestments.map((inv) => ({
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
        })),
    });
});
export default router;
