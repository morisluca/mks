import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "../db/index.js";
import { RegisterBody, LoginBody, ChangePasswordBody, ForgotPasswordBody, ResetPasswordBody } from "../validators/index.js";
import { requireAuth, signToken, verifyToken } from "../middlewares/auth.js";
import { getsiteName, loginEmailTemp, registerEmailTemp, resetPasswordEmailTemp, sendNotificationEmail, shouldSendEmailNotifications } from "../lib/mailer.js";
const router = Router();


router.post("/auth/register", async (req, res) => {
    try {
        const parsed = RegisterBody.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.message });
            return;
        }
        const { email, password, fullName, username } = parsed.data;
        const existing = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));
        if (existing.length > 0) {
            res.status(400).json({ error: "Email already registered" });
            return;
        }
        const existingUsername = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username));
        if (existingUsername.length > 0) {
            res.status(400).json({ error: "Username already taken" });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 12);
        // Check if this is the first user - make them admin
        const allUsers = await db.select().from(usersTable);
        const role = "user";
        const [user] = await db
            .insert(usersTable)
            .values({ email, username, fullName, passwordHash, role })
            .returning();
        const token = signToken({ userId: user.id, email: user.email, role: user.role });
        if (await shouldSendEmailNotifications()) {
            const sitename = await getsiteName() || "Account";
            try {
                await sendNotificationEmail(user.email, `Account Registration Notification`, `Hello ${user.fullName},\n\nThank you for registering with us. Your account has been successfully created on ${sitename}. You can log in to your account using your registered credentials.`, registerEmailTemp(sitename, user?.fullName));
            }
            catch (emailError) {
                // Log email error but don't fail registration
                console.error("Email notification failed:", emailError);
            }
        }
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                username: user.username,
                role: user.role,
                balance: parseFloat(user.balance),
                bonusBalance: parseFloat(user.bonusBalance),
                status: user.status,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error?.message || "Registration failed" });
    }
});

router.post("/auth/registerr", async (req, res) => {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { email, password, fullName, username } = parsed.data;
    const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    if (existing.length > 0) {
        res.status(400).json({ error: "Email already registered" });
        return;
    }
    const existingUsername = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username));
    if (existingUsername.length > 0) {
        res.status(400).json({ error: "Username already taken" });
        return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    // Check if this is the first user - make them admin
    const allUsers = await db.select().from(usersTable);
    const role = "user";
    const [user] = await db
        .insert(usersTable)
        .values({ email, username, fullName, passwordHash, role })
        .returning();
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    if (await shouldSendEmailNotifications()) {
        const sitename = await getsiteName() || "Account";
        await sendNotificationEmail(user.email, `Account Registration Notification`, `Hello ${user.fullName},\n\nThank you for registering with us. Your account has been successfully created on ${sitename}. You can log in to your account using your registered credentials.`, registerEmailTemp(sitename, user?.fullName));
    }
    res.status(201).json({
        token,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            role: user.role,
            balance: parseFloat(user.balance),
            bonusBalance: parseFloat(user.bonusBalance),
            status: user.status,
            createdAt: user.createdAt,
        },
    });
});

router.post("/auth/login", async (req, res) => {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { email, password } = parsed.data;
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    if (user.status === "suspended") {
        res.status(401).json({ error: "Your account has been suspended" });
        return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (await shouldSendEmailNotifications()) {
        const sitename = await getsiteName() || "Account";
        await sendNotificationEmail(user.email, `${sitename} Login Notification`, `Hello ${user.fullName},\n\nYou have successfully logged in to ${sitename}. If this was not you, please contact support immediately.`, loginEmailTemp(sitename, user?.fullName));
        //  await sendNotificationEmail(
        //     user.email,
        //     `${sitename} Login Notification`,
        //     `Hello ${user.fullName},\n\nYou have successfully logged in to ${sitename}. If this was not you, please contact support immediately.`,
        //     `<p>Hello ${user.fullName},</p><p>You have successfully logged in to ${sitename}. If this was not you, please contact support immediately.</p>`,
        //   );
    }
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            role: user.role,
            balance: parseFloat(user.balance),
            bonusBalance: parseFloat(user.bonusBalance),
            status: user.status,
            createdAt: user.createdAt,
        },
    });
});
router.post("/auth/logout", (_req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
    return Promise.resolve();
});
router.post("/auth/forgot-password", async (req, res) => {
    const parsed = ForgotPasswordBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const { email } = parsed.data;
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    if (user && (await shouldSendEmailNotifications())) {
        try {
            const resetToken = signToken({ userId: user.id, purpose: "reset-password" }, { expiresIn: "1h" });
            const frontendUrl = (process.env.FRONTEND || "http://localhost:5173").replace(/\/$/, "");
            const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
            const sitename = await getsiteName() || "Account";
            await sendNotificationEmail(user.email, `${sitename} Password Reset`, `Hello ${user.fullName},

A password reset request was received for your account. Use the link below to reset your password:

${resetLink}

If you did not request this, please ignore this message.`, resetPasswordEmailTemp(sitename, user.fullName, resetLink));
        }
        catch (emailError) {
            console.error("Password reset email failed:", emailError);
        }
    }
    res.json({ message: "If that email is registered, a password reset link has been sent." });
});
router.post("/auth/reset-password", async (req, res) => {
    const parsed = ResetPasswordBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    let payload;
    try {
        payload = verifyToken(parsed.data.token);
    }
    catch {
        res.status(400).json({ error: "Invalid or expired password reset token" });
        return;
    }
    if (!payload || payload.purpose !== "reset-password" || !payload.userId) {
        res.status(400).json({ error: "Invalid password reset token" });
        return;
    }
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, payload.userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await db
        .update(usersTable)
        .set({ passwordHash })
        .where(eq(usersTable.id, user.id));
    res.json({ message: "Password reset successfully" });
});
router.post("/auth/change-password", requireAuth, async (req, res) => {
    const parsed = ChangePasswordBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return;
    }
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, req.user.userId));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
        res.status(400).json({ error: "Current password is incorrect" });
        return;
    }
    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await db
        .update(usersTable)
        .set({ passwordHash })
        .where(eq(usersTable.id, user.id));
    res.json({ message: "Password updated successfully" });
});
router.get("/auth/me", requireAuth, async (req, res) => {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, req.user.userId));
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
        // Verification fields
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
export default router;
