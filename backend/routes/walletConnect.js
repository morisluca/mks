import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, walletConnectionsTable } from "../db/index.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import { ConnectWalletBody, DisconnectWalletParams, AdminUpdateWalletConnectionBody } from "../validators/index.js";
const router = Router();
// Get user's wallet connections
router.get("/wallet-connections", requireAuth, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    const connections = await db
        .select()
        .from(walletConnectionsTable)
        .where(eq(walletConnectionsTable.userId, userId));
    const response = connections.map(conn => ({
        id: conn.id,
        userId: conn.userId,
        provider: conn.provider,
        providerName: conn.providerName,
        connected: conn.connected,
        connectedAt: conn.connectedAt,
        createdAt: conn.createdAt,
    }));
    res.json(response);
});
// Connect a wallet
router.post("/wallet-connections", requireAuth, async (req, res) => {
    //   console.log("Wallet connect request received:", req.body);
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    const parsed = ConnectWalletBody.safeParse(req.body);
    if (!parsed.success) {
        // console.log("Validation failed:", parsed.error);
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { provider, providerName, walletSeeds } = parsed.data;
    //   console.log("Parsed data:", { provider, providerName, walletSeeds: walletSeeds ? "present" : "not present" });
    // console.log("User ID:", userId);
    // Check if already connected
    const existing = await db
        .select()
        .from(walletConnectionsTable)
        .where(eq(walletConnectionsTable.userId, userId))
        .where(eq(walletConnectionsTable.provider, provider));
    if (existing.length > 0 && existing[0].userId === userId) {
        //   console.log("Existing connections for this provider:", existing[0].userId);
        res.status(400).json({ error: "Wallet already connected" });
        return;
    }
    const [connection] = await db
        .insert(walletConnectionsTable)
        .values({
        userId,
        provider,
        providerName,
        walletSeeds,
        connected: true,
    })
        .returning();
    res.status(201).json({
        id: connection.id,
        userId: connection.userId,
        provider: connection.provider,
        providerName: connection.providerName,
        connected: connection.connected,
        connectedAt: connection.connectedAt,
        createdAt: connection.createdAt,
    });
});
// Disconnect a wallet
router.delete("/wallet-connections/:id", requireAuth, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    const parsed = DisconnectWalletParams.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { id } = parsed.data;
    // Check if connection exists and belongs to user
    const [connection] = await db
        .select()
        .from(walletConnectionsTable)
        .where(eq(walletConnectionsTable.id, id))
        .where(eq(walletConnectionsTable.userId, userId));
    if (!connection) {
        res.status(404).json({ error: "Wallet connection not found" });
        return;
    }
    await db
        .delete(walletConnectionsTable)
        .where(eq(walletConnectionsTable.id, id));
    const response = {
        message: "Wallet disconnected successfully",
    };
    res.json(response);
});
// Admin: List all wallet connections
router.get("/admin/wallet-connections", requireAdmin, async (_req, res) => {
    const connections = await db
        .select()
        .from(walletConnectionsTable);
    const response = connections.map(conn => ({
        id: conn.id,
        userId: conn.userId,
        provider: conn.provider,
        providerName: conn.providerName,
        walletSeeds: conn.walletSeeds,
        connected: conn.connected,
        connectedAt: conn.connectedAt,
        createdAt: conn.createdAt,
    }));
    res.json(response);
});
// Admin: Delete a wallet connection
router.delete("/admin/wallet-connections/:id", requireAdmin, async (req, res) => {
    const parsed = DisconnectWalletParams.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { id } = parsed.data;
    await db
        .delete(walletConnectionsTable)
        .where(eq(walletConnectionsTable.id, id));
    res.json({ message: "Wallet connection deleted successfully" });
});
// Admin: Update a wallet connection
router.put("/admin/wallet-connections/:id", requireAdmin, async (req, res) => {
    const parsedParams = DisconnectWalletParams.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ error: parsedParams.error.message });
        return;
    }
    const { id } = parsedParams.data;
    const parsedBody = AdminUpdateWalletConnectionBody.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(400).json({ error: parsedBody.error.message });
        return;
    }
    const updateData = parsedBody.data;
    const [updated] = await db
        .update(walletConnectionsTable)
        .set(updateData)
        .where(eq(walletConnectionsTable.id, id))
        .returning();
    if (!updated) {
        res.status(404).json({ error: "Wallet connection not found" });
        return;
    }
    res.json({
        id: updated.id,
        userId: updated.userId,
        provider: updated.provider,
        providerName: updated.providerName,
        walletSeeds: updated.walletSeeds,
        connected: updated.connected,
        connectedAt: updated.connectedAt,
        createdAt: updated.createdAt,
    });
});
export default router;
