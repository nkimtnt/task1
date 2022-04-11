require("dotenv").config();
const User = require("../models/User");
const {generateAccessToken} = require("../middlewares/token");


module.exports = {
    createControl: (req, res) => {
        const { userId, userPassword } = req.body;
        console.log(req.body)
        const newUser = {
            userId: userId,
            userPassword: userPassword,
        }
        if(userId && userPassword) {
            const jwtToken = generateAccessToken({userId, userPassword})
            console.log("===jwtToken===", jwtToken)
            new User(newUser).save();
            res.status(200).send({message: "success"});
        }
        else {
            return res.status(400).send({message: "bad request"});
        }
    },

    deleteControl: async (req, res) => {
        const { userId, userPassword } = req.body;
        const existUser = {
            userId: userId,
            userPassword: userPassword
        }
        const userCount = await User.findOne(existUser).count();
        const userDelete = await User.findOne(existUser).remove.exec();
        res.status(200).send({message: `${userCount} user has been removed`});
    }
}