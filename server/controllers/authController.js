const bcrypt = require('bcryptjs')

module.exports = {

    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, password, isAdmin} = req.body
        const existingUser = await db.get_user(username)
        if(existingUser[0]){
            return res.status(401).json('Username taken')
        }
        else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const result = await db.register_user([isAdmin, username, hash])
            console.log(result)
            req.session.user = {isAdmin: result[0].is_admin, username: result[0].username, id: result[0].id}
            return res.status(201).json(req.session.user)
        }
    },

    login: async (req, res) => {
        const db = req.app.get('db')
        const {username, password} = req.body
        const foundUser = await db.get_user(username)
        if(!foundUser[0]){
            res.status(401).json('User not found. Please register as a new user before logging in')
        }
        else {
            isAuthenticated = bcrypt.compareSync(password, foundUser[0].hash)
            if(!isAuthenticated){
                res.status(403).json('Incorrect Password')
            }
            else {
                req.session.user = {isAdmin: foundUser[0].is_admin, username: foundUser[0].username, id: foundUser[0].id}
                res.status(200).json(req.session.user)
            }
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        return res.sendStatus(200)
    }



}