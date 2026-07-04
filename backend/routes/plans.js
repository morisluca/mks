import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, plansTable } from "../db/index.js";
import { CreatePlanBody, UpdatePlanBody, UpdatePlanParams, DeletePlanParams } from "../validators/index.js";
import { requireAdmin } from "../middlewares/auth.js";
const router = Router();
function formatPlan(p) {
    return {
        id: p.id,
        name: p.name,
        description: p.description,
        roi: parseFloat(p.roi),
        durationDays: p.durationDays,
        minAmount: parseFloat(p.minAmount),
        maxAmount: parseFloat(p.maxAmount),
        isActive: p.isActive,
        createdAt: p.createdAt,
    };
}
// Public: active plans only
router.get("/plans", async (_req, res) => {
    const plans = await db
        .select()
        .from(plansTable)
        .where(eq(plansTable.isActive, true));
    res.json(plans.map(formatPlan));
});
// Admin: all plans
router.get("/admin/plans", requireAdmin, async (_req, res) => {
    const plans = await db.select().from(plansTable);
    res.json(plans.map(formatPlan));
});
// Admin: create plan
router.post("/admin/plans", requireAdmin, async (req, res) => {
    const parsed = CreatePlanBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const [plan] = await db
        .insert(plansTable)
        .values({
        name: parsed.data.name,
        description: parsed.data.description,
        roi: String(parsed.data.roi),
        durationDays: parsed.data.durationDays,
        minAmount: String(parsed.data.minAmount),
        maxAmount: String(parsed.data.maxAmount),
        isActive: parsed.data.isActive ?? true,
    })
        .returning();
    res.status(201).json(formatPlan(plan));
});
// Admin: update plan
router.patch("/admin/plans/:id", requireAdmin, async (req, res) => {
    const params = UpdatePlanParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid plan ID" });
        return;
    }
    const parsed = UpdatePlanBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const updateData = {};
    if (parsed.data.name !== undefined)
        updateData.name = parsed.data.name;
    if (parsed.data.description !== undefined)
        updateData.description = parsed.data.description;
    if (parsed.data.roi !== undefined)
        updateData.roi = String(parsed.data.roi);
    if (parsed.data.durationDays !== undefined)
        updateData.durationDays = parsed.data.durationDays;
    if (parsed.data.minAmount !== undefined)
        updateData.minAmount = String(parsed.data.minAmount);
    if (parsed.data.maxAmount !== undefined)
        updateData.maxAmount = String(parsed.data.maxAmount);
    if (parsed.data.isActive !== undefined)
        updateData.isActive = parsed.data.isActive;
    const [plan] = await db
        .update(plansTable)
        .set(updateData)
        .where(eq(plansTable.id, params.data.id))
        .returning();
    if (!plan) {
        res.status(404).json({ error: "Plan not found" });
        return;
    }
    res.json(formatPlan(plan));
});
// Admin: delete plan
router.delete("/admin/plans/:id", requireAdmin, async (req, res) => {
    const params = DeletePlanParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid plan ID" });
        return;
    }
    await db.delete(plansTable).where(eq(plansTable.id, params.data.id));
    res.sendStatus(204);
});
export default router;
