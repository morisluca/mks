import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq, and } from "drizzle-orm";
import { db, verificationTable, usersTable } from "../db/index.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
const router = Router();
// Configure multer for file uploads
const uploadDir = "uploads/verifications";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const filename = `${timestamp}${ext}`;
        cb(null, filename);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
function formatVerification(v) {
    return {
        id: v.id,
        userId: v.userId,
        idDocumentUrl: v.idDocumentUrl,
        selfieUrl: v.selfieUrl,
        status: v.status,
        adminNotes: v.adminNotes,
        rejectionReason: v.rejectionReason,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        reviewedAt: v.reviewedAt,
        reviewedBy: v.reviewedBy,
    };
}
// User: submit or update verification
router.post("/verification", requireAuth, upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
]), async (req, res) => {
    try {
        const userId = req.user.userId;
        const dash = req.body?.dash;
        if (!dash) {
            const files = req.files;
            if (!files?.idDocument?.length) {
                res.status(400).json({ error: "ID document is required" });
                return;
            }
            const idDocumentUrl = files.idDocument[0].filename;
            const selfieUrl = files.selfie?.[0]?.filename ?? null;
            // Get existing verification (if any)
            const [existing] = await db
                .select()
                .from(verificationTable)
                .where(eq(verificationTable.userId, userId));
            // 🚦 Handle existing verification states
            if (existing) {
                switch (existing.status) {
                    case "pending":
                        res.status(400).json({
                            error: "You already have a pending verification submission",
                        });
                        return;
                    case "approved":
                        res.status(400).json({
                            error: "You are already verified",
                        });
                        return;
                    case "rejected": {
                        const [updated] = await db
                            .update(verificationTable)
                            .set({
                            idDocumentUrl,
                            selfieUrl,
                            status: "pending",
                        })
                            .where(eq(verificationTable.userId, userId))
                            .returning();
                        res.status(201).json(formatVerification(updated));
                        return;
                    }
                }
            }
            // 🧾 Extract and prepare user info
            const { title, firstName, lastName, dateOfBirth, currency, employmentStatus, sourceOfIncome, industry, annualIncome, estimatedNetWorth, streetAddress, city, provinceState, postalZipCode, phoneNumber, } = req.body;
            // Update user with verification information
            const updateData = {};
            if (title)
                updateData.title = title;
            if (firstName)
                updateData.firstName = firstName;
            if (lastName)
                updateData.lastName = lastName;
            if (dateOfBirth)
                updateData.dateOfBirth = new Date(dateOfBirth);
            if (currency)
                updateData.currency = currency;
            if (employmentStatus)
                updateData.employmentStatus = employmentStatus;
            if (sourceOfIncome)
                updateData.sourceOfIncome = sourceOfIncome;
            if (industry)
                updateData.industry = industry;
            if (annualIncome)
                updateData.annualIncome = annualIncome;
            if (estimatedNetWorth)
                updateData.estimatedNetWorth = estimatedNetWorth;
            if (streetAddress)
                updateData.streetAddress = streetAddress;
            if (city)
                updateData.city = city;
            if (provinceState)
                updateData.provinceState = provinceState;
            if (postalZipCode)
                updateData.postalZipCode = postalZipCode;
            if (phoneNumber)
                updateData.phoneNumber = phoneNumber;
            // Update user if data exists
            if (Object.keys(updateData).length > 0) {
                await db
                    .update(usersTable)
                    .set(updateData)
                    .where(eq(usersTable.id, userId));
            }
            // 🆕 Create new verification
            const [verification] = await db
                .insert(verificationTable)
                .values({
                userId,
                idDocumentUrl,
                selfieUrl,
                status: "pending",
            })
                .returning();
            res.status(201).json({
                ...formatVerification(verification),
                userInfo: {
                    title: title ?? null,
                    firstName: firstName ?? null,
                    lastName: lastName ?? null,
                    dateOfBirth: dateOfBirth ?? null,
                    currency: currency ?? null,
                    employmentStatus: employmentStatus ?? null,
                    sourceOfIncome: sourceOfIncome ?? null,
                    industry: industry ?? null,
                    annualIncome: annualIncome ?? null,
                    estimatedNetWorth: estimatedNetWorth ?? null,
                    streetAddress: streetAddress ?? null,
                    city: city ?? null,
                    provinceState: provinceState ?? null,
                    postalZipCode: postalZipCode ?? null,
                    phoneNumber: phoneNumber ?? null,
                },
            });
            return;
        }
        // 🧾 Extract and prepare user info
        const { title, firstName, lastName, dateOfBirth, currency, employmentStatus, sourceOfIncome, industry, annualIncome, estimatedNetWorth, streetAddress, city, provinceState, postalZipCode, phoneNumber, } = req.body;
        // Update user with verification information
        const updateData = {};
        if (title)
            updateData.title = title;
        if (firstName)
            updateData.firstName = firstName;
        if (lastName)
            updateData.lastName = lastName;
        if (dateOfBirth)
            updateData.dateOfBirth = new Date(dateOfBirth);
        if (currency)
            updateData.currency = currency;
        if (employmentStatus)
            updateData.employmentStatus = employmentStatus;
        if (sourceOfIncome)
            updateData.sourceOfIncome = sourceOfIncome;
        if (industry)
            updateData.industry = industry;
        if (annualIncome)
            updateData.annualIncome = annualIncome;
        if (estimatedNetWorth)
            updateData.estimatedNetWorth = estimatedNetWorth;
        if (streetAddress)
            updateData.streetAddress = streetAddress;
        if (city)
            updateData.city = city;
        if (provinceState)
            updateData.provinceState = provinceState;
        if (postalZipCode)
            updateData.postalZipCode = postalZipCode;
        if (phoneNumber)
            updateData.phoneNumber = phoneNumber;
        // Update user if data exists
        if (Object.keys(updateData).length > 0) {
            await db
                .update(usersTable)
                .set(updateData)
                .where(eq(usersTable.id, userId));
        }
        // 🆕 Create new verification
        // const [verification] = await db
        //   .insert(verificationTable)
        //   .values({
        //     userId,
        //     idDocumentUrl,
        //     selfieUrl,
        //     status: "pending",
        //   })
        //   .returning();
        res.status(201).json({
            userInfo: {
                dashing: true
            },
        });
        return;
    }
    catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            error: "Something went wrong during verification submission",
        });
        return;
    }
});
// User: Re submit or update verification
router.post("/verification/resubmit", requireAuth, upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
]), async (req, res) => {
    const files = req.files;
    if (!files || !files.idDocument || files.idDocument.length === 0) {
        res.status(400).json({ error: "ID document is required" });
        return;
    }
    const idDocumentUrl = files.idDocument[0].filename;
    const selfieUrl = files.selfie && files.selfie[0] ? files.selfie[0].filename : null;
    // Check if user already has a pending or approved verification
    const existing = await db
        .select()
        .from(verificationTable)
        .where(and(eq(verificationTable.userId, req.user.userId), eq(verificationTable.status, "pending")));
    if (existing.length > 0) {
        res.status(400).json({ error: "You already have a pending verification submission" });
        return;
    }
    // Create verification record with documents
    const [verification] = await db
        .insert(verificationTable)
        .values({
        userId: req.user.userId,
        idDocumentUrl,
        selfieUrl,
        status: "pending",
    })
        .returning();
    res.status(201).json({
        ...formatVerification(verification)
    });
});
// User: get their own verification status
router.get("/verification", requireAuth, async (req, res) => {
    const [verification] = await db
        .select()
        .from(verificationTable)
        .where(eq(verificationTable.userId, req.user.userId));
    if (!verification) {
        res.json({ status: "not_submitted" });
        return;
    }
    res.json(formatVerification(verification));
});
// Admin: list all verifications
router.get("/admin/verifications", requireAdmin, async (_req, res) => {
    const verifications = await db
        .select({
        verification: verificationTable,
        user: usersTable,
    })
        .from(verificationTable)
        .innerJoin(usersTable, eq(verificationTable.userId, usersTable.id));
    res.json(verifications.map(({ verification: v, user }) => {
        return ({
            ...formatVerification(v),
            userEmail: user.email,
            userFullName: user.fullName,
        });
    }));
});
// Admin: get specific verification
router.get("/admin/verifications/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const [verification] = await db
        .select({
        verification: verificationTable,
        user: usersTable,
    })
        .from(verificationTable)
        .innerJoin(usersTable, eq(verificationTable.userId, usersTable.id))
        .where(eq(verificationTable.id, id));
    if (!verification) {
        res.status(404).json({ error: "Verification not found" });
        return;
    }
    res.json({
        ...formatVerification(verification.verification),
        userEmail: verification.user.email,
        userFullName: verification.user.fullName,
    });
});
// Admin: approve verification
router.post("/admin/verifications/:id/approve", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { adminNotes } = req.body;
    const [verification] = await db
        .select()
        .from(verificationTable)
        .where(eq(verificationTable.id, id));
    if (!verification) {
        res.status(404).json({ error: "Verification not found" });
        return;
    }
    const [updated] = await db
        .update(verificationTable)
        .set({
        status: "approved",
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user.userId,
    })
        .where(eq(verificationTable.id, id))
        .returning();
    res.json(formatVerification(updated));
});
// Admin: reject verification
router.post("/admin/verifications/:id/reject", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { rejectionReason, adminNotes } = req.body;
    if (!rejectionReason) {
        res.status(400).json({ error: "Rejection reason is required" });
        return;
    }
    const [verification] = await db
        .select()
        .from(verificationTable)
        .where(eq(verificationTable.id, id));
    if (!verification) {
        res.status(404).json({ error: "Verification not found" });
        return;
    }
    const [updated] = await db
        .update(verificationTable)
        .set({
        status: "rejected",
        rejectionReason,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user.userId,
    })
        .where(eq(verificationTable.id, id))
        .returning();
    res.json(formatVerification(updated));
});
// Admin: delete uploaded verification document
router.delete("/admin/verifications/:id/documents/:type", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const type = req.params.type;
    if (!["idDocument", "selfie"].includes(type)) {
        res.status(400).json({ error: "Invalid document type" });
        return;
    }
    const [verification] = await db
        .select()
        .from(verificationTable)
        .where(eq(verificationTable.id, id));
    if (!verification) {
        res.status(404).json({ error: "Verification not found" });
        return;
    }
    const filename = type === "idDocument" ? verification.idDocumentUrl : verification.selfieUrl;
    if (!filename) {
        res.status(400).json({ error: "No document available to delete" });
        return;
    }
    const filepath = path.resolve(uploadDir, filename);
    if (!filepath.startsWith(path.resolve(uploadDir))) {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }
    const updateData = {};
    if (type === "idDocument") {
        updateData.idDocumentUrl = "";
    }
    else {
        updateData.selfieUrl = null;
    }
    const [updated] = await db
        .update(verificationTable)
        .set(updateData)
        .where(eq(verificationTable.id, id))
        .returning();
    res.json(formatVerification(updated));
});
// Static file serving for uploaded documents
router.get("/verification-documents/:filename", (_req, res) => {
    const filename = _req.params.filename;
    const filepath = path.resolve(uploadDir, filename);
    // Security: prevent path traversal
    if (!filepath.startsWith(path.resolve(uploadDir))) {
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
