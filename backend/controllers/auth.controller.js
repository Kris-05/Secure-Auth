// import bcrypt from "bcryptjs/dist/bcrypt";
import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message:"User already exists!"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours || 1 day
        })

        // save to the DB
        await user.save();

        // create a token(jwt) and set a cookie to say that the user is authenticated
        generateToken(res, user._id);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            // need not send password to client, so we rewrite the user
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const logout = async (req, res) => {
    res.send("LogOut route");
}

export const login = async (req, res) => {
    res.send("Login route");
}