const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // console.log('===========this is the request', req)
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
        message: "No token provided!"
        });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({auth: false,
            message: "Please login to view."
            });
        } else {
            console.log('decoded', decoded)
        req.userId = decoded.id;
        req.username = decoded.username;
            
        next();
        }
    });
};

const authJwt = {
    verifyToken: verifyToken
  };

  module.exports = authJwt;