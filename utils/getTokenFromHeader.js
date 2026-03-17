const getTokenFromHeader = (req) => {
    const headers = req.headers
    const token = headers.authorization.split(" ")[1]
    // console.log(token, "header");
    if(token !== undefined){
        return token
    }
    else{
        return false
    }
}

module.exports = getTokenFromHeader;