import express from "express"
import { getPublishedCreations, getUserCreations, toggleLikeCreation, getUserPlan } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations)
userRouter.get('/get-published-creations',auth,getPublishedCreations)
userRouter.post('/toggle-like-creation',auth,toggleLikeCreation)
userRouter.post('/set-plan',auth, async (req, res) => {
  try {
    const { userId } = req.auth();
    const { plan } = req.body;
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { plan }
    });
    res.json({ success: true, message: 'Plan updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});
userRouter.get('/get-user-plan',auth,getUserPlan)

export default userRouter;
