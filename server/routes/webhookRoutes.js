import express from 'express';
import { clerkClient } from '@clerk/express';
import { Webhook } from 'svix';

const webhookRouter = express.Router();

// Clerk webhook endpoint for subscription updates
webhookRouter.post('/clerk-webhook', async (req, res) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        
        if (!WEBHOOK_SECRET) {
            throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
        }

        // Get the headers
        const svix_id = req.headers['svix-id'];
        const svix_timestamp = req.headers['svix-timestamp'];
        const svix_signature = req.headers['svix-signature'];

        // If there are no headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({ error: 'Error occured -- no svix headers' });
        }

        // Get the body
        const payload = JSON.stringify(req.body);

        // Create a new Svix instance with your secret.
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt;

        // Verify the payload with the headers
        try {
            evt = wh.verify(payload, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        } catch (err) {
            console.error('Error verifying webhook:', err);
            return res.status(400).json({ error: 'Error verifying webhook' });
        }

        // Handle the webhook
        const eventType = evt.type;
        
        if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
            const { data } = evt;
            const userId = data.user_id;
            const subscription = data.subscription;
            
            // Determine plan based on subscription
            let plan = 'free';
            if (subscription && subscription.status === 'active') {
                // Check subscription plan name or price
                const planName = subscription.plan_name || subscription.price?.name || '';
                if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('pro')) {
                    plan = 'premium';
                }
            }
            
            // Update user metadata with plan information
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    plan: plan,
                    subscription_id: subscription?.id || null,
                    subscription_status: subscription?.status || 'inactive'
                }
            });
            
            console.log(`Updated user ${userId} plan to: ${plan}`);
        }
        
        if (eventType === 'subscription.deleted') {
            const { data } = evt;
            const userId = data.user_id;
            
            // Reset user to free plan
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    plan: 'free',
                    subscription_id: null,
                    subscription_status: 'inactive'
                }
            });
            
            console.log(`Reset user ${userId} to free plan`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default webhookRouter;
