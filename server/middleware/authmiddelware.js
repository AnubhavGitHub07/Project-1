import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // check if token exists in the header

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer") // "Bearer token"
        ) {
            token = req.headers.authorization.split(" ")[1]; // we can split and access using it's index which is 1.

        }

        if (!token) {
            return res.status(401).json({
                message: "Not Authorized , no token"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token

        const user = await User.findById(decoded.id).select("-password"); // get user from DB without using password

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user; // attach user with request

        next();



    }

    catch (error) {
        console.error("Auth Middleware Error:", error.message);
        console.error("Token received:", req.headers.authorization);
        console.error("JWT_SECRET exists:", !!process.env.JWT_SECRET);
        res.status(401).json({
            message: "Not Authorized . token failed",
            error: error.message
        });
    }
};

export default protect;

