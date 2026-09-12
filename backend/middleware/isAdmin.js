import jwt from "jsonwebtoken"

export default (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(401).json({ 
            status: 401,
            error: { name: "MissingAuthorizationHeader", message: "Unauthorized" }
        })
    if (!req.locals)
        req.locals = {}
    jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        // todo: update with redirect ig once done with apis
        if (err) {
            req.locals.jwtError = err
            return res.status(401).json({status: 401, error: err})
        }
        
        req.locals.user = decoded
        next()
    })
}