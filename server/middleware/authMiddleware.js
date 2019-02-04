module.exports = {
    usersOnly: (req, res, next) => {
        if(!req.session.user){
            res.status(401).json('Please log in')
        }
        else {
            return next()
        }
    },

    adminsOnly: (req, res, next) => {
        if(!req.session.user.isAdmin){
            res.status(403).json('You are not an adnim')
        }
        else {
            return next()
        }
    }
}