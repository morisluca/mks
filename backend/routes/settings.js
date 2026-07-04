import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "../db/index.js";
import { UpdateSettingsBody } from "../validators/index.js";
import { requireAdmin } from "../middlewares/auth.js";
const router = Router();
async function getOrCreateSettings() {
    const existing = await db.select().from(siteSettingsTable);
    if (existing.length > 0)
        return existing[0];
    const [settings] = await db.insert(siteSettingsTable).values({}).returning();
    return settings;
}
function formatSettings(s) {
    return {
        id: s.id,
        siteName: s.siteName,
        siteEmail: s.siteEmail,
        siteUrl: s.siteUrl,
        logoUrl: s.logoUrl,
        faviconUrl: s.faviconUrl,
        currency: s.currency,
        minDeposit: parseFloat(s.minDeposit),
        maxDeposit: parseFloat(s.maxDeposit),
        minWithdrawal: parseFloat(s.minWithdrawal),
        maxWithdrawal: parseFloat(s.maxWithdrawal),
        withdrawalFee: parseFloat(s.withdrawalFee),
        maintenanceMode: s.maintenanceMode,
        welcomeBonus: parseFloat(s.welcomeBonus),
        referralBonus: parseFloat(s.referralBonus),
        emailNotificationsEnabled: s.emailNotificationsEnabled,
        identityVerificationEnabled: s.identityVerificationEnabled,
        walletConnectionRequired: s.walletConnectionRequired,
        updatedAt: s.updatedAt,
    };
}
// Public: get public settings
router.get("/settingsss", async (_req, res) => {
    const settings = await getOrCreateSettings();
    res.json({
        siteName: settings.siteName,
        siteEmail: settings.siteEmail,
        currency: settings.currency,
        minDeposit: parseFloat(settings.minDeposit),
        minWithdrawal: parseFloat(settings.minWithdrawal),
        withdrawalFee: parseFloat(settings.withdrawalFee),
        welcomeBonus: parseFloat(settings.welcomeBonus),
        identityVerificationEnabled: settings.identityVerificationEnabled,
        emailNotificationsEnabled: settings.emailNotificationsEnabled,
        walletConnectionRequired: settings.walletConnectionRequired,
    });
});


router.get("/settings", async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();

    if (!settings) {
      return res.status(500).json({ error: "Settings not found" });
    }

    res.json({
      siteName: settings.siteName,
      siteEmail: settings.siteEmail,
      currency: settings.currency,
      minDeposit: parseFloat(settings.minDeposit || 0),
      minWithdrawal: parseFloat(settings.minWithdrawal || 0),
      withdrawalFee: parseFloat(settings.withdrawalFee || 0),
      welcomeBonus: parseFloat(settings.welcomeBonus || 0),
      identityVerificationEnabled: settings.identityVerificationEnabled ?? false,
      emailNotificationsEnabled: settings.emailNotificationsEnabled ?? false,
      walletConnectionRequired: settings.walletConnectionRequired ?? false,
    });
  } catch (err) {
    console.error("SETTINGS ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// Admin: get all settings
router.get("/admin/settings", requireAdmin, async (_req, res) => {
    const settings = await getOrCreateSettings();
    res.json(formatSettings(settings));
});
// Admin: update settings
router.patch("/admin/settings", requireAdmin, async (req, res) => {
    const parsed = UpdateSettingsBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const settings = await getOrCreateSettings();
    const updateData = {};
    if (parsed.data.siteName !== undefined)
        updateData.siteName = parsed.data.siteName;
    if (parsed.data.siteEmail !== undefined)
        updateData.siteEmail = parsed.data.siteEmail;
    if (parsed.data.siteUrl !== undefined)
        updateData.siteUrl = parsed.data.siteUrl;
    if (parsed.data.logoUrl !== undefined)
        updateData.logoUrl = parsed.data.logoUrl;
    if (parsed.data.faviconUrl !== undefined)
        updateData.faviconUrl = parsed.data.faviconUrl;
    if (parsed.data.currency !== undefined)
        updateData.currency = parsed.data.currency;
    if (parsed.data.minDeposit !== undefined)
        updateData.minDeposit = String(parsed.data.minDeposit);
    if (parsed.data.maxDeposit !== undefined)
        updateData.maxDeposit = String(parsed.data.maxDeposit);
    if (parsed.data.minWithdrawal !== undefined)
        updateData.minWithdrawal = String(parsed.data.minWithdrawal);
    if (parsed.data.maxWithdrawal !== undefined)
        updateData.maxWithdrawal = String(parsed.data.maxWithdrawal);
    if (parsed.data.withdrawalFee !== undefined)
        updateData.withdrawalFee = String(parsed.data.withdrawalFee);
    if (parsed.data.maintenanceMode !== undefined)
        updateData.maintenanceMode = parsed.data.maintenanceMode;
    if (parsed.data.welcomeBonus !== undefined)
        updateData.welcomeBonus = String(parsed.data.welcomeBonus);
    if (parsed.data.referralBonus !== undefined)
        updateData.referralBonus = String(parsed.data.referralBonus);
    if (parsed.data.emailNotificationsEnabled !== undefined)
        updateData.emailNotificationsEnabled = parsed.data.emailNotificationsEnabled;
    if (parsed.data.identityVerificationEnabled !== undefined)
        updateData.identityVerificationEnabled = parsed.data.identityVerificationEnabled;
    if (parsed.data.walletConnectionRequired !== undefined)
        updateData.walletConnectionRequired = parsed.data.walletConnectionRequired;
    const [updated] = await db
        .update(siteSettingsTable)
        .set(updateData)
        .where(eq(siteSettingsTable.id, settings.id))
        .returning();
    res.json(formatSettings(updated));
});
export default router;
