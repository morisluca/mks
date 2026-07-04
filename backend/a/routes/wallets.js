import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, depositWalletsTable } from "../db/index.js";
import { CreateWalletBody, UpdateWalletBody, UpdateWalletParams, DeleteWalletParams } from "../validators/index.js";
import { requireAdmin } from "../middlewares/auth.js";
const router = Router();
function formatWallet(w) {
    return {
        id: w.id,
        currency: w.currency,
        network: w.network,
        address: w.address,
        isActive: w.isActive,
        qrCode: w.qrCode,
        createdAt: w.createdAt,
    };
}
// Public: list active wallets (for users to select for deposit)
router.get("/wallets", async (_req, res) => {
    const wallets = await db
        .select()
        .from(depositWalletsTable)
        .where(eq(depositWalletsTable.isActive, true));
    res.json(wallets.map(formatWallet));
});
// Admin: list all wallets
router.get("/admin/wallets", requireAdmin, async (_req, res) => {
    const wallets = await db.select().from(depositWalletsTable);
    res.json(wallets.map(formatWallet));
});
// Admin: create wallet
router.post("/admin/wallets", requireAdmin, async (req, res) => {
    const parsed = CreateWalletBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const [wallet] = await db
        .insert(depositWalletsTable)
        .values({
        currency: parsed.data.currency,
        network: parsed.data.network,
        address: parsed.data.address,
        isActive: parsed.data.isActive ?? true,
        qrCode: parsed.data.qrCode,
    })
        .returning();
    res.status(201).json(formatWallet(wallet));
});
// Admin: update wallet
router.patch("/admin/wallets/:id", requireAdmin, async (req, res) => {
    const params = UpdateWalletParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid wallet ID" });
        return;
    }
    const parsed = UpdateWalletBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const updateData = {};
    if (parsed.data.currency !== undefined)
        updateData.currency = parsed.data.currency;
    if (parsed.data.network !== undefined)
        updateData.network = parsed.data.network;
    if (parsed.data.address !== undefined)
        updateData.address = parsed.data.address;
    if (parsed.data.isActive !== undefined)
        updateData.isActive = parsed.data.isActive;
    if (parsed.data.qrCode !== undefined)
        updateData.qrCode = parsed.data.qrCode;
    const [wallet] = await db
        .update(depositWalletsTable)
        .set(updateData)
        .where(eq(depositWalletsTable.id, params.data.id))
        .returning();
    if (!wallet) {
        res.status(404).json({ error: "Wallet not found" });
        return;
    }
    res.json(formatWallet(wallet));
});
// Admin: delete wallet
router.delete("/admin/wallets/:id", requireAdmin, async (req, res) => {
    const params = DeleteWalletParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid wallet ID" });
        return;
    }
    await db.delete(depositWalletsTable).where(eq(depositWalletsTable.id, params.data.id));
    res.sendStatus(204);
});
export default router;
