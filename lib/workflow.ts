import { Client as WorkflowClient } from '@upstash/workflow';
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
})

// Email sender by Resend and upstash.
const qstashClient = new QStashClient({ token: config.env.upstash.qstashToken });

// Send Email.
export const sendEmail = async ({ email, subject, message}: { email: string, subject: string, message: string }) => {
    await qstashClient.publishJSON({
        api: {
            name: "email",
            provider: resend({ token: config.env.resendToken }),
        },
        body: {
            from: "The Library <contact@fukunyun-turbo.com>",
            to: [email],
            subject,
            html: message,
        },
    });
}

