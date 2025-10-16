import express from "express";
import { 
    addQuestion, 
    searchQuestions,
    fetchAllQuestions,
    fetchUserQuestions ,
    deleteQuestion
} from "../controllers/Question.js";
import userAuth from "../middlewares/userAuth.js";

const questionRouter = express.Router();

questionRouter.post("/add", userAuth, addQuestion);
questionRouter.get("/search", searchQuestions);
questionRouter.get("/user-questions",userAuth,fetchUserQuestions);
questionRouter.get("/all-questions",fetchAllQuestions);
questionRouter.delete("/delete-question/:questionId",userAuth,deleteQuestion);

export default questionRouter;