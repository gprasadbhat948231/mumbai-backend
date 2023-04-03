const express = require("express")

const { UserModel } = require("../model/userModel");

const userRouter = express.Router();

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }
        else {
            if (password === user.password) {
                let temp = new Date(user.expire).getTime() - new Date(Date.now()).getTime();
                temp = temp / (60 * 60 * 1000);
                if (user.loginStatus == "blocked" && temp > 0) {
                    res.json({message:"Your account has been blocked"});
                }
                else{
                    user.loginAttempts = 0;
                    user.loginStatus = "active";
                    user.save();
                    res.status(200).json({ message: "Login Successful" });
                }
            }
            else {
                user.loginAttempts++;
                if (user.loginAttempts < 5) {
                    user.save();
                    res.status(401).json({message:"Wrong attempt"})
                }
                else if (user.loginAttempts >= 5) {
                    user.loginStatus = "blocked";
                    user.expire = new Date(Date.now() + 60 * 60 * 1000 * 24);
                    user.save();
                    res.status(401).json({message:"Your account has beed blocked for 24 hrs"})
                }
                else {
                    return res.status(401).json({message:"Invalid UserName or Password"})
                }
            }
        }
    }
    catch (err) {
        res.send(err)
    }
})

userRouter.post("/register", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const user = new UserModel({ email, password });
        await user.save();
        res.send("Successfull Registration");
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = { userRouter }