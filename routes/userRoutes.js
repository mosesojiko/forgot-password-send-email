const express = require('express')

const  userController  = require('../controllers/userController')
//const verifyToken = require('../middlewares/verifyToken')

const router = express.Router()

//route to create a user
router.post('/signup', userController.signup)

//route to login a suer
router.post('/login', userController.login)

//route to get all users
//router.get('/', userController.getUsers)

//route to get user by id
//router.get('/:id', userController.getSingleUser)

router.get('/forgot-password', userController.forgotPassword )
router.post('/forgot-password', userController.sendPasswordLink)
router.get('/reset-password/:id/:token', userController.getResetPage)
router.post('/reset-password/:id/:token', userController.resetPassword)




module.exports = router