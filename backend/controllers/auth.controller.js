// import bcrypt from "bcryptjs/dist/bcrypt";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";

import { generateToken } from "../utils/generateToken.js";
import { sendResetPasswordEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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

        await sendVerificationEmail(user.email, verificationToken);

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

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
        // check the code in the user model
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() }, // to make sure that token is not expired
		});

        // if code doesn't match return error
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

        // after verifying delete the verification token and set expiry date to null
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

        // save the user and send the welcome email
		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {

		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const logout = async (req, res) => {
    // to make user unathenticated, delete the cookie assigned to him
    res.clearCookie("token");
    res.status(200).json({ success:true, message:"Logged out successfully"});
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success:false, message: "User doesn't exsit || Invalid Credentials"});
        }
        
        // compare the entered password and stored password
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(400).json({ success: false, message: "Password Mismatch"});
        }

        generateToken(res, user._id);
        // change the last login time to now
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            user: {
                ...user._doc,
                password: undefined
            },
        });
    } catch (error) {
        console.log("Error in Login: ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success:false, message: "user doesn't exist, try creating a new one"});
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        })
    } catch (error) {
        console.log("Error in forgotPassword",error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    // since we used /reset-password/:->token<-
    const { token } = req.params;

    try {
        // check if the generated token and token from params are equal
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt : Date.now() }
        })

        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token"});
        }

        // now user exists, so update the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // after updating the password, set the other fields to undefined
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save()
        
        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password Reset Successful"
        })
    } catch (error) {
        console.log("Error in Reset Password",error);
        res.status(400).json({ success: false, message: error.message });
    }
}