import bcrypt from "bcryptjs";
import { Router } from "express";
import { eq, and, sum, count, desc } from "drizzle-orm";
import { db, usersTable, investmentsTable, transactionsTable, messagesTable } from "../db/index.js";
import { GetUserParams, UpdateUserBody, UpdateUserParams, AddBonusBody, AddBonusParams, SuspendUserBody, SuspendUserParams, DeleteUserParams, CreateUserMessageParams, DeleteUserMessageParams, CreateUserMessageBody } from "../validators/index.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
const router = Router();
// Admin: list all users with stats
router.get("/admin/users", requireAdmin, async (_req, res) => {
    const users = await db.select().from(usersTable);
    const usersWithStats = await Promise.all(users.map(async (user) => {
        const [investStats] = await db
            .select({
            totalInvested: sum(investmentsTable.amount),
            activeInvestments: count(investmentsTable.id),
        })
            .from(investmentsTable)
            .where(eq(investmentsTable.userId, user.id));
        const [depositStats] = await db
            .select({ totalDeposited: sum(transactionsTable.amount) })
            .from(transactionsTable)
            .where(eq(transactionsTable.userId, user.id));
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            role: user.role,
            balance: parseFloat(user.balance),
            bonusBalance: parseFloat(user.bonusBalance),
            status: user.status,
            createdAt: user.createdAt,
            totalInvested: parseFloat(investStats?.totalInvested ?? "0"),
            totalDeposited: parseFloat(depositStats?.totalDeposited ?? "0"),
            totalWithdrawn: 0,
            activeInvestments: Number(investStats?.activeInvestments ?? 0),
        };
    }));
    res.json(usersWithStats);
});
// Admin: get single user with stats
router.get("/admin/users/:id", requireAdmin, async (req, res) => {
    const params = GetUserParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const [investStats] = await db
        .select({
        totalInvested: sum(investmentsTable.amount),
        activeInvestments: count(investmentsTable.id),
    })
        .from(investmentsTable)
        .where(eq(investmentsTable.userId, user.id));
    const [depositStats] = await db
        .select({ totalDeposited: sum(transactionsTable.amount) })
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, user.id));
    res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        balance: parseFloat(user.balance),
        bonusBalance: parseFloat(user.bonusBalance),
        status: user.status,
        createdAt: user.createdAt,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        currency: user.currency,
        employmentStatus: user.employmentStatus,
        sourceOfIncome: user.sourceOfIncome,
        industry: user.industry,
        annualIncome: user.annualIncome,
        estimatedNetWorth: user.estimatedNetWorth,
        streetAddress: user.streetAddress,
        city: user.city,
        provinceState: user.provinceState,
        postalZipCode: user.postalZipCode,
        phoneNumber: user.phoneNumber,
        totalInvested: parseFloat(investStats?.totalInvested ?? "0"),
        totalDeposited: parseFloat(depositStats?.totalDeposited ?? "0"),
        totalWithdrawn: 0,
        activeInvestments: Number(investStats?.activeInvestments ?? 0),
    });
});
// Admin: update user
router.patch("/admin/users/:id", requireAdmin, async (req, res) => {
    const params = UpdateUserParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const parsed = UpdateUserBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const updateData = {};
    if (parsed.data.fullName !== undefined)
        updateData.fullName = parsed.data.fullName;
    if (parsed.data.email !== undefined)
        updateData.email = parsed.data.email;
    if (parsed.data.balance !== undefined)
        updateData.balance = String(parsed.data.balance);
    if (parsed.data.status !== undefined)
        updateData.status = parsed.data.status;
    if (parsed.data.password !== undefined)
        updateData.passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const [user] = await db
        .update(usersTable)
        .set(updateData)
        .where(eq(usersTable.id, params.data.id))
        .returning();
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        balance: parseFloat(user.balance),
        bonusBalance: parseFloat(user.bonusBalance),
        status: user.status,
        createdAt: user.createdAt,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        currency: user.currency,
        employmentStatus: user.employmentStatus,
        sourceOfIncome: user.sourceOfIncome,
        industry: user.industry,
        annualIncome: user.annualIncome,
        estimatedNetWorth: user.estimatedNetWorth,
        streetAddress: user.streetAddress,
        city: user.city,
        provinceState: user.provinceState,
        postalZipCode: user.postalZipCode,
        phoneNumber: user.phoneNumber,
    });
});
// Admin: add bonus to user
router.post("/admin/users/:id/bonus", requireAdmin, async (req, res) => {
    const params = AddBonusParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const parsed = AddBonusBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const newBonus = parseFloat(user.bonusBalance) + parsed.data.amount;
    const newBalance = parseFloat(user.balance) + parsed.data.amount;
    await db
        .update(usersTable)
        .set({ bonusBalance: String(newBonus), balance: String(newBalance) })
        .where(eq(usersTable.id, params.data.id));
    res.json({ message: `Bonus of $${parsed.data.amount} added successfully` });
});
// Admin: suspend/activate user
router.post("/admin/users/:id/suspend", requireAdmin, async (req, res) => {
    const params = SuspendUserParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const parsed = SuspendUserBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    await db
        .update(usersTable)
        .set({ status: parsed.data.status })
        .where(eq(usersTable.id, params.data.id));
    res.json({ message: `User status updated to ${parsed.data.status}` });
});
// Admin: delete user
router.delete("/admin/users/:id", requireAdmin, async (req, res) => {
    const params = DeleteUserParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    // Prevent admin deletion
    if (user.role === "admin") {
        res.status(403).json({ error: "Cannot delete admin users" });
        return;
    }
    // Delete related records first (cascade delete)
    await db.delete(investmentsTable).where(eq(investmentsTable.userId, params.data.id));
    await db.delete(transactionsTable).where(eq(transactionsTable.userId, params.data.id));
    // Delete the user
    await db.delete(usersTable).where(eq(usersTable.id, params.data.id));
    res.json({ message: "User deleted successfully" });
});

// Admin: send message to user
router.post("/admin/users/:id/messages", requireAdmin, async (req, res) => {
    const params = CreateUserMessageParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const parsed = CreateUserMessageBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    if (!req.user?.userId) {
        res.status(401).json({ error: "Admin authentication required" });
        return;
    }
    await db.insert(messagesTable).values({
        userId: params.data.id,
        adminId: req.user.userId,
        title: parsed.data.title,
        body: parsed.data.body,
        sender: "admin",
    });
    res.json({ message: "Message sent successfully" });
});

// Admin: view all messages sent to a user
router.get("/admin/users/:id/messages-log", requireAdmin, async (req, res) => {
    const params = CreateUserMessageParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const messages = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.userId, params.data.id))
        .orderBy(desc(messagesTable.createdAt));
    res.json(messages.map((message) => ({
        id: message.id,
        title: message.title,
        body: message.body,
        sender: message.sender,
        isRead: message.isRead,
        createdAt: message.createdAt,
    })));
});

// Admin: delete a specific user message
router.delete("/admin/users/:id/messages/:messageId", requireAdmin, async (req, res) => {
    const params = DeleteUserMessageParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user or message ID" });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const [message] = await db
        .select()
        .from(messagesTable)
        .where(and(eq(messagesTable.id, params.data.messageId), eq(messagesTable.userId, params.data.id)));
    if (!message) {
        res.status(404).json({ error: "Message not found" });
        return;
    }
    await db.delete(messagesTable).where(and(eq(messagesTable.id, params.data.messageId), eq(messagesTable.userId, params.data.id)));
    res.json({ message: "Message deleted successfully" });
});

// User: list own messages
router.get("/users/messages", requireAuth, async (req, res) => {
    const userId = req.user.userId;
    const messages = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.userId, userId))
        .orderBy(desc(messagesTable.createdAt));
    res.json(messages.map((message) => ({
        id: message.id,
        title: message.title,
        body: message.body,
        sender: message.sender,
        isRead: message.isRead,
        createdAt: message.createdAt,
    })));
});

// User: mark a message as read
router.patch("/users/messages/:id/read", requireAuth, async (req, res) => {
    const params = CreateUserMessageParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid message ID" });
        return;
    }
    const userId = req.user.userId;
    const [message] = await db
        .select()
        .from(messagesTable)
        .where(and(eq(messagesTable.id, params.data.id), eq(messagesTable.userId, userId)));
    if (!message) {
        res.status(404).json({ error: "Message not found" });
        return;
    }
    if (message.isRead) {
        res.json({ message: "Message already marked as read" });
        return;
    }
    await db
        .update(messagesTable)
        .set({ isRead: true })
        .where(and(eq(messagesTable.id, params.data.id), eq(messagesTable.userId, userId)));
    res.json({ message: "Message marked as read" });
});

export default router;
