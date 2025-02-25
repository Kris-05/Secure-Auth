import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();        // to get the constants from the dotenv file instead of undefined

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// origin -> our React application
// credentials -> so that we can send cookies and requests
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

app.use(express.json()); // middleware to fetch data from user || allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "frontend/dist"))); // to make frontend as static assests

    app.get("*", (req,res) =>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}


app.listen(PORT, () => {
    connectDB();
    console.log("Server is running in the port", PORT);
});
