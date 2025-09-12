import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId);

        const planFromPrivate = user.privateMetadata?.plan;
        const planFromPublic = user.publicMetadata?.plan;
        const isPremium = (planFromPrivate || planFromPublic) === 'premium';

        console.log('Auth middleware:', { userId, planFromPrivate, planFromPublic, isPremium });

        // Temporary: force premium for testing
        req.plan = 'premium';

        const currentFreeUsage = Number(user.privateMetadata?.free_usage ?? 0);
        req.free_usage = currentFreeUsage;

        if (user.privateMetadata?.free_usage == null) {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { ...(user.privateMetadata || {}), free_usage: currentFreeUsage }
            });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}