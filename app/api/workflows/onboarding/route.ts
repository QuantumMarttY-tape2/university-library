import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs"
import { eq } from "drizzle-orm";

// We can have two types of users.
type UserState = "non-active" | "active";

type InitialData = {
  email: string,
  fullName: string,
};

// Make days a variable.
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
const THIRTY_DAYS_IN_MS = ONE_DAY_IN_MS * 30;

// Get whether the user is active or not in a given period of time.
const getUserState = async (email: string): Promise<UserState> => {
    // Extract the user first.
    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    
    if (user.length === 0) return "non-active";

    // Check last activity date.
    const lastActivityDate = new Date(user[0].lastActivityDate!);
    // Get current date.
    const now = new Date();
    // Compare the difference.
    const timeDifference = now.getTime() - lastActivityDate.getTime();

    // If inactive for 3 days but fewer than 30 days, return non-active.
    if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= THIRTY_DAYS_IN_MS) {
        return "non-active";
    }

    // Return active otherwise.
    return "active";
}

export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload;

    // Welcome email.
    await context.run("new-signup", async () => {
        await sendEmail({
            email,
            subject: "Welcome to The Library",
            message: `Hi ${fullName}, welcome to The Library!`,
        })
    })

    // Sleep for 3 days to avoid server load.
    await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

    while (true) {
        const state = await context.run("check-user-state", async () => {
        return await getUserState(email);
        })

        if (state === "non-active") {
        await context.run("send-email-non-active", async () => {
            await sendEmail({
                email,
                subject: "Are you still there?",
                message: `Hey ${fullName}, we miss you!`
            });
        });
        } else if (state === "active") {
        await context.run("send-email-active", async () => {
            await sendEmail({
                email,
                subject: "Welcome back!",
                message: `Welcome back ${fullName}!`
            })
        })
        }

        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
    }
})
