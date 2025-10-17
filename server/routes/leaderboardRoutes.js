import express from "express"
import {fetchUserPoints,fetchSingleUserPoints,updateUserPoints} from "../controllers/Leaderboard.js"
import userAuth from "../middlewares/userAuth.js"
const leaderboardRouter=express.Router();

leaderboardRouter.get("/fetch-points",userAuth,fetchUserPoints);
leaderboardRouter.get("/fetch-user-points",userAuth,fetchSingleUserPoints);
leaderboardRouter.put("/update-points",userAuth,updateUserPoints);

export default leaderboardRouter;
