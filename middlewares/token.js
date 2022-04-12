require("dotenv").config();
const {sign, verify} = require("jsonwebtoken");

module.exports = {
    generateAccessToken: data => {
        return sign(data, process.env.ACCESS_SECRET, {expiresIn: "3h"});
    },
    isAuthorized: (req, res) => {
        const authorization =
            req.headers["Authorization"] || req.headers["authorization"];
        if (!authorization) {
            return null;
        }
        const token = authorization.split(" ")[1]; // `Bearer ${Authorization}`
        try {
            return verify(token, process.env.ACCESS_SECRET);
        } catch (err) {
            return null;
        }
    },
};