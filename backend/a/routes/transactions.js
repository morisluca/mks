import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq, and } from "drizzle-orm";
import { db, transactionsTable, usersTable, depositWalletsTable } from "../db/index.js";
import { CreateDepositBody, CreateWithdrawalBody, ApproveTransactionParams, RejectTransactionParams } from "../validators/index.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { sendNotificationEmail, shouldSendEmailNotifications } from "../lib/mailer.js";
import { DepostAdminEmailTemp, DepostUserApproveEmailTemp, getSiteEmail, getsiteName, getsiteNameCurrency, withdrawalUserApproveEmailTemp } from "../lib/mailer.js";
const router = Router();


const receiptUploadDir = "uploads/deposit_receipts";

if (!fs.existsSync(receiptUploadDir)) {
    fs.mkdirSync(receiptUploadDir, { recursive: true });
}
const receiptStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, receiptUploadDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const filename = `${timestamp}${ext}`;
        cb(null, filename);
    },
});

const receiptUpload = multer({
    storage: receiptStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowedMimes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed."));
        }
    },
});

function getReceiptUrl(filename) {
    return filename ? `/api/transactions/deposit-receipts/${filename}` : null;
}

function formatTransaction(tx) {
    const receiptUrl = typeof tx.note === "string" && /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9]+$/.test(tx.note)
        ? getReceiptUrl(tx.note)
        : null;
    return {
        id: tx.id,
        userId: tx.userId,
        type: tx.type,
        amount: parseFloat(tx.amount),
        currency: tx.currency,
        walletAddress: tx.walletAddress,
        txHash: tx.txHash,
        status: tx.status,
        note: tx.note,
        receiptUrl,
        createdAt: tx.createdAt,
    };
}

// User: list my transactions
router.get("/transactions", requireAuth, async (req, res) => {
    const txs = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, req.user.userId));
    res.json(txs.map(formatTransaction));
});
// User: create deposit
router.post("/transactions/deposit", requireAuth, async (req, res) => {
    const parsed = CreateDepositBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { amount, currency, walletId, txHash } = parsed.data;
    // Verify wallet exists and is active
    const [wallet] = await db
        .select()
        .from(depositWalletsTable)
        .where(and(eq(depositWalletsTable.id, walletId), eq(depositWalletsTable.isActive, true)));
    if (!wallet) {
        res.status(400).json({ error: "Invalid or inactive wallet" });
        return;
    }
    const [tx] = await db
        .insert(transactionsTable)
        .values({
        userId: req.user.userId,
        type: "deposit",
        amount: String(amount),
        currency,
        txHash,
        status: "pending",
    })
        .returning();
    if (await shouldSendEmailNotifications()) {
        const sitename = await getsiteName() || "Account";
        const AdminAddress = await getSiteEmail();
        const dfcur = await getsiteNameCurrency();
        // await sendNotificationEmail(
        //   txs?.email,
        //   "Deposit request received",
        //   `Hello ${txs.fullName},\n\nYour deposit request for ${amount} ${currency} has been received and is now pending. Transaction ID: ${tx.id}.`,
        //   `<p>Hello ${txs?.fullName},</p><p>Your deposit request for <strong>${amount} ${currency}</strong> has been received and is now pending.</p><p>Transaction ID: ${tx.id}.</p>`,
        // );
        await sendNotificationEmail(AdminAddress, "Deposit Request Received", `Hello Adnin user ${req.user.userId},\n\nhave made deposit request for ${amount} ${currency} comfirm the pending deposit. Transaction ID: ${tx.id}.`, DepostAdminEmailTemp(sitename, req.user.userId, amount, currency, dfcur));
    }
    res.status(201).json(formatTransaction(tx));
});
// User: create deposit with receipt file
router.post("/transactions/deposit-receipt", requireAuth, receiptUpload.single("receipt"), async (req, res) => {
    const parsed = CreateDepositBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { amount, currency, walletId, txHash } = parsed.data;
    const [wallet] = await db
        .select()
        .from(depositWalletsTable)
        .where(and(eq(depositWalletsTable.id, walletId), eq(depositWalletsTable.isActive, true)));
    if (!wallet) {
        res.status(400).json({ error: "Invalid or inactive wallet" });
        return;
    }
    const receiptFilename = req.file?.filename;
    const [tx] = await db
        .insert(transactionsTable)
        .values({
        userId: req.user.userId,
        type: "deposit",
        amount: String(amount),
        currency,
        txHash,
        note: receiptFilename,
        status: "pending",
    })
        .returning();
    if (await shouldSendEmailNotifications()) {
        const sitename = await getsiteName() || "Account";
        const AdminAddress = await getSiteEmail();
        const dfcur = await getsiteNameCurrency();
        await sendNotificationEmail(AdminAddress, "Deposit Request Received", `Hello Adnin user ${req.user.userId},\n\nhave made deposit request for ${amount} ${currency} comfirm the pending deposit. Transaction ID: ${tx.id}.`, DepostAdminEmailTemp(sitename, req.user.userId, amount, currency, dfcur));
    }
    res.status(201).json(formatTransaction(tx));
});
// User: create withdrawal
router.post("/transactions/withdraw", requireAuth, async (req, res) => {
    const parsed = CreateWithdrawalBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { amount, currency, walletAddress } = parsed.data;
    // Check user balance
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    if (parseFloat(user.balance) < amount) {
        res.status(400).json({ error: "Insufficient balance" });
        return;
    }
    // Deduct balance immediately (hold)
    await db
        .update(usersTable)
        .set({ balance: String(parseFloat(user.balance) - amount) })
        .where(eq(usersTable.id, req.user.userId));
    console.log("dddddd " + currency);
    const [tx] = await db
        .insert(transactionsTable)
        .values({
        userId: req.user.userId,
        type: "withdrawal",
        amount: String(amount),
        currency,
        walletAddress,
        status: "pending",
    })
        .returning();
    if (await shouldSendEmailNotifications()) {
        const AdminAddress = await getSiteEmail();
        const dfcur = await getsiteNameCurrency();
        await sendNotificationEmail(AdminAddress, "Withdrawal request received", `Hello admin,\n\nUser ${user.fullName} have requested a withdrawal for ${dfcur} ${amount} in ${currency} review and process the pending withdrawal. Transaction ID: ${tx.id}.`, `<p>Hello admin,</p><p>User ${user.fullName} have requested a withdrawal for ${dfcur} ${amount} in ${currency} review and process the pending withdrawal..</p><p>Transaction ID: ${tx.id}.</p>`);
    }
    res.status(201).json(formatTransaction(tx));
});
// Admin: list all transactions
router.get("/admin/transactions", requireAdmin, async (_req, res) => {
    const txs = await db
        .select({
        transaction: transactionsTable,
        user: usersTable,
    })
        .from(transactionsTable)
        .innerJoin(usersTable, eq(transactionsTable.userId, usersTable.id));
    res.json(txs.map(({ transaction: tx, user }) => ({
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
        receiptUrl: typeof tx.note === "string" && /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9]+$/.test(tx.note)
            ? getReceiptUrl(tx.note)
            : null,
        createdAt: tx.createdAt,
    })));
});

// Admin: delete uploaded deposit receipt
router.delete("/admin/transactions/:id/receipt", requireAdmin, async (req, res) => {
    const params = RejectTransactionParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid transaction ID" });
        return;
    }

    const [tx] = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.id, params.data.id));

    if (!tx) {
        res.status(404).json({ error: "Transaction not found" });
        return;
    }

    if (!tx.note || typeof tx.note !== "string" || !/^[a-zA-Z0-9-_]+\.[a-zA-Z0-9]+$/.test(tx.note)) {
        res.status(400).json({ error: "No receipt to delete" });
        return;
    }

    const filepath = path.resolve(receiptUploadDir, tx.note);
    if (!filepath.startsWith(path.resolve(receiptUploadDir))) {
        res.status(403).json({ error: "Access denied" });
        return;
    }

    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    } catch (error) {
        console.error("Error deleting receipt file:", error);
    }

    await db
        .update(transactionsTable)
        .set({ note: null })
        .where(eq(transactionsTable.id, params.data.id));

    res.json({ message: "Receipt deleted" });
});

// Admin: approve transaction
router.post("/admin/transactions/:id/approve", requireAdmin, async (req, res) => {
    const params = ApproveTransactionParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid transaction ID" });
        return;
    }
    const [tx] = await db
        .select()
        .from(transactionsTable)
        .where(and(eq(transactionsTable.id, params.data.id), eq(transactionsTable.status, "pending")));
    if (!tx) {
        res.status(404).json({ error: "Transaction not found or not pending" });
        return;
    }
    // If deposit, credit user balance
    if (tx.type === "deposit") {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, tx.userId));
        if (user) {
            await db
                .update(usersTable)
                .set({ balance: String(parseFloat(user.balance) + parseFloat(tx.amount)) })
                .where(eq(usersTable.id, tx.userId));
            if (await shouldSendEmailNotifications()) {
                const sitename = await getsiteName() || "Account";
                const AdminAddress = await getSiteEmail();
                const dfcur = await getsiteNameCurrency();
                await sendNotificationEmail(user.email, "Deposit approved", `Hello ${user.fullName},\n\nYour deposit for ${parseFloat(tx.amount)} ${tx.currency} has been approved and credited to your balance.`, DepostUserApproveEmailTemp(sitename, user.fullName, tx.amount, dfcur));
            }
        }
    }
    // If deposit, credit user balance
    if (tx.type === "withdrawal") {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, tx.userId));
        if (user) {
            if (await shouldSendEmailNotifications()) {
                const sitename = await getsiteName() || "Account";
                const AdminAddress = await getSiteEmail();
                const dfcur = await getsiteNameCurrency();
                await sendNotificationEmail(user.email, "withdrawal approved", `Hello ${user.fullName},\n\nYour withdrawal for ${parseFloat(tx.amount)} ${tx.currency} has been approved and sent to your wallet`, withdrawalUserApproveEmailTemp(sitename, user.fullName, tx.amount, dfcur));
            }
        }
    }
    await db
        .update(transactionsTable)
        .set({ status: "approved" })
        .where(eq(transactionsTable.id, params.data.id));
    res.json({ message: "Transaction approved" });
});
// Admin: reject transaction
router.post("/admin/transactions/:id/reject", requireAdmin, async (req, res) => {
    const params = RejectTransactionParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid transaction ID" });
        return;
    }
    const [tx] = await db
        .select()
        .from(transactionsTable)
        .where(and(eq(transactionsTable.id, params.data.id), eq(transactionsTable.status, "pending")));
    if (!tx) {
        res.status(404).json({ error: "Transaction not found or not pending" });
        return;
    }
    // If withdrawal was rejected, refund user
    if (tx.type === "withdrawal") {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, tx.userId));
        if (user) {
            await db
                .update(usersTable)
                .set({ balance: String(parseFloat(user.balance) + parseFloat(tx.amount)) })
                .where(eq(usersTable.id, tx.userId));
            if (await shouldSendEmailNotifications()) {
                await sendNotificationEmail(user.email, "Withdrawal rejected", `Hello ${user.fullName},\n\nYour withdrawal request for ${parseFloat(tx.amount)} ${tx.currency} was rejected and the funds have been returned to your balance.`, `<p>Hello ${user.fullName},</p><p>Your withdrawal request for <strong>${parseFloat(tx.amount)} ${tx.currency}</strong> was rejected and the funds have been returned to your balance.</p>`);
            }
        }
    }
    await db
        .update(transactionsTable)
        .set({ status: "rejected" })
        .where(eq(transactionsTable.id, params.data.id));
    res.json({ message: "Transaction rejected" });
});
router.get("/deposit-receipts/:filename", (_req, res) => {
    const filename = _req.params.filename;
    const filepath = path.resolve(receiptUploadDir, filename);
    if (!filepath.startsWith(path.resolve(receiptUploadDir))) {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    res.sendFile(filepath, (err) => {
        if (err) {
            res.status(404).json({ error: "File not found" });
        }
    });
});
export default router;
