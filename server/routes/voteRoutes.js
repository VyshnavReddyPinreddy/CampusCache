import express from "express";
import {addVote,removeVote,updateVote} from "../controllers/Voting.js";
import userAuth from "../middlewares/userAuth.js";

const voteRouter =express.Router();

voteRouter.post("/add-vote",userAuth,addVote);
voteRouter.delete("/delete-vote",userAuth,removeVote);
voteRouter.put("/update-vote",userAuth,updateVote);

export default voteRouter;