require("dotenv").config();
const User = require("../models/User");
const {generateAccessToken} = require("../middlewares/token");

module.exports = {
    createControl: async (req, res) => {
        const { userId, userPassword } = req.body;
        console.log(req.body)
        const newUser = {
            userId: userId,
            userPassword: userPassword,
            accessToken: '',
            accessTokenExpiry: '',
            refreshToken: '',
            refreshTokenExpiry: '',
        }
        if(userId && userPassword) {
            const jwtToken = await generateAccessToken({userId, userPassword})
            console.log("===jwtToken===", jwtToken)
            await new User(newUser).save();
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