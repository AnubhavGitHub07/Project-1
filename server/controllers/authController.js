import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/jwt.js";

// Signup Controller

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        //basic validation
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email }); // check if user already exist


        if (existingUser) {
            return res.status(409).json({
                message: "User Already Exist"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // create user

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Login Controller

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All Fields are required"
            });
        }

        //find user

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: " Invalid Credentials"
            });
        }

        // compare password

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        // generate token

        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token,
            userId: user._id,
            email: user.email,
        });
    }

    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

export { signup, login };

