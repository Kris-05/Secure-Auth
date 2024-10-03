import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // next() calls the next function, here checkAuth is called once token is verified
    // .token because we defined it as token in generateToken.js
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({success:false, message: "Unauthorized - no token provided"})
    }
    try {
        // to verify, we use the same SECRET that we used to create
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({success: false, message: "Unauthorized - invalid token"});
        }
        // console.log(decoded.userId);
        
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error in verify Token", error);
        return res.status(500).json({ success:false, message:"Server Error"});
    }
}
