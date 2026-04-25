const getTokenFromHeader = require("../utils/getTokenFromHeader")
const verifyToken = require("../utils/verifyToken")

const isLogIn = async (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req)
    // verifyToken
    const decodedUser = await verifyToken(token)
    // console.log(decodedUser, "decoded");
    // save user into request obj
    req.userAuth = decodedUser.id
    // console.log(decodedUser.id, "isLogin");
    if (!decodedUser) {
        return res.json("Invalid or expired token, please login again", 401);
    }
    else {
        next();
    }
}

module.exports = isLogIn;