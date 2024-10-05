import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();        // to get the constants from the dotenv file instead of undefined

const app = express();
const PORT = process.env.PORT || 5000;

// origin -> our React application
// credentials -> so that we can send cookies and requests
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

app.use(express.json()); // middleware to fetch data from user || allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running in the port", PORT);
});
