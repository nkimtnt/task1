const { v4 } = require('uuid');
const {isAuthorized} = require("../middlewares/token");
const User = require("../models/User");


module.exports = {
    tokenControl: async (req, res) => {
        const token = req.headers.authorization;
        if(!token) {
            return res.status(400).send({message: "bad request"})
        }
        else {
            const jwtAuth = isAuthorized(req, res);
            if(!jwtAuth) {
                return res.status(404).send({message:"invalid request"})
            }
            else {
                const issueDate = new Date();
                const accessToken =  v4();
                const accessTokenExpiry = new Date(Date.parse(issueDate) + 10800000); // +3h
                const refreshToken = v4();
                const refreshTokenExpiry = new Date(Date.parse(issueDate) + 1209600000); // +14d

                const userInfo = await User.updateMany(
                    {
                        userId: jwtAuth.userId,
                        userPassword: jwtAuth.userPassword
                    },
                    {
                        $set: {
                            accessToken: accessToken,
                            accessTokenExpiry: accessTokenExpiry,
                            refreshToken: refreshToken,
                            refreshTokenExpiry: refreshTokenExpiry
                        }
                    },
                    {
                        upsert: true,
                    }
                ).exec();
                console.log(userInfo)
                return res.status(200).send({message:"success", accessToken: accessToken, refreshToken:refreshToken})
            }
        }

    },

    validateControl: (req, res) => {
        res.status(200).send();
    },

    revokeControl: (req, res) => {
        res.status(200).send();
    }
}