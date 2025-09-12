import express from "express"
import { getPublishedCreations, getUserCreations, toggleLikeCreation, getUserPlan } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations)
userRouter.get('/get-published-creations',auth,getPublishedCreations)
userRouter.post('/toggle-like-creation',auth,toggleLikeCreation)
userRouter.get('/get-user-plan',auth,getUserPlan)

export default userRouter;
