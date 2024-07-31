const jwt = require('jsonwebtoken')

const userverify = async (req, res, next) => {

    try {

        const token = await req.cookies?.auth_token;

             jwt.verify(token, process.env.TOKEN_SEC, (err, decode) => {

                if (err) {


                    return res.status(401).json('invalid user')

                } else {

                    req.user = decode

                    next()

                }


            })
        
    } catch (error) {

        if (error) {

            return res.status(401).json('unauthrize user')
        }

    }
}

module.exports = userverify

