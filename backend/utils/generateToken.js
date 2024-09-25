import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,     // to prevent attack from XSS
        secure: process.env.NODE_ENV === "production",  // secure only if we are in production i.e localhost:http, production:https
        sameSite: "strict", // to prevent from csrf
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return token;
}
