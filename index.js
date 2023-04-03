const express = require("express")
const cors = require("cors");
const { connection } = require("./config/db")
const {userRouter}=require("./route/userRoutes");

const app = express()
app.use(express.json());

app.use(cors())

app.use("/user",userRouter);

app.listen("4500", async () => {
    try {
        await connection;
        console.log("Connected to Database")
    }
    catch (err) {
        console.log("error while connecting to Database")
    }
})