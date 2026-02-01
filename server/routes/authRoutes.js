import express from "express";
import {signup , login } from "../controllers/authController.js";
import protect from "../middleware/authmiddelware.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/login" , login);

// protected route

router.get("/profile" , protect , ( req , res ) =>{
    res.status(200).json({
        message : "Access Granted",
        user : req.user,
    });
});

export default router;