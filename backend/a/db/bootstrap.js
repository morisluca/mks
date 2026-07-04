import bcrypt from "bcryptjs";
import { db } from "./index.js";
import { eq, or } from "drizzle-orm";
import { usersTable } from "./schema/users.js";

export const bootstrapAdmin = async () => {
    if (process.env.BOOTSTRAP_ADMIN === "true") {
        return;
    }
    const email = "admin@asrinvest.com";
    const username = "admin";
    const fullName = "Admin User";
    const password = "09876543";
    const role = "admin";
    const existingAdmin = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.role, role));
    if (existingAdmin.length > 0) {
        return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await db
        .insert(usersTable)
        .values({ email, username, fullName, passwordHash, role })
        .returning();
};
