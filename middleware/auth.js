const jwt = require("jsonwebtoken")
require("dotenv").config()
exports.authenticate = async(req,res,next) => {
    try {
let bToken = req.headers.authorization.split(" ")[1]
        let tokenId = jwt.verify(bToken,process.env.JWT_TOKEN) 
        console.log('data', tokenId)
        req.id = tokenId.userId
        next()
    } catch (error) {
        console.log('err at auth.js', error)
    }
}