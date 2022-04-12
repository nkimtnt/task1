const { v4 } = require('uuid');
const {isAuthorized} = require("../middlewares/token");
const User = require("../models/User");
const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

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
                const issueDate =  new Date();
                const accessToken =   v4();
                const accessTokenExpiry =  new Date(Date.parse(issueDate) + 10800000);
                const refreshToken =  v4();
                const refreshTokenExpiry =  new Date(Date.parse(issueDate) + 1209600000);
                console.log("===accessTokenExpiry===", accessTokenExpiry)
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
                        new: true,
                        upsert: true,
                    },
                ).exec();
                console.log(userInfo)
                return res.status(200).send({message:"success", accessToken: accessToken, refreshToken:refreshToken})
            }
        }

    },

    validateControl: async (req, res) => {
        const accessToken = req.query.accessToken;
        if(!accessToken) {
            return res.status(400).send({message: "bad request"});
        } else {
            const today =  new Date();
            const overdate =  new Date(Date.parse(today) + 1209600000);
            const validateToken = await User.findOne({refreshToken: accessToken});
            const validateDate = validateToken.refreshTokenExpiry;
            console.log('===today===', today)
            console.log('===overdate===', overdate)
            console.log('===validateDate===', validateDate)
            const validate = dayjs(today).isBefore(validateDate)
            if(!validate) {
                return res.status(404).send({message: "invalid request"})
            } else {
                return res.status(200).send({
                    message: "success",
                    data: {userId: validateToken.userId}})
            }
        }
    },

    revokeControl: (req, res) => {
        res.status(200).send();
    }
}