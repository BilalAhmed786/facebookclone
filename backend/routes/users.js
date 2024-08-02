const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

//user update
router.put('/:id', async (req, res) => {

    try {
        if (req.params.id === req.body.userId || req.user.isAdmin) {

            if (req.body.password) {

                if (req.body.password !== req.body.retypepassword) {


                    return res.status(400).json('passwords are not matched')
                }

                const user = await User.findOne({ _id: req.params.id })

                const comparepass = await bcrypt.compare(req.body.oldpassword, user.password)


                if (!comparepass) {


                    return res.status(400).json('Invalid old password')

                }

                const salt = await bcrypt.genSalt(10)

                req.body.password = await bcrypt.hash(req.body.password, salt)
                req.body.retypepassword = await bcrypt.hash(req.body.retypepassword, salt)

            }

            const userupdate = await User.findByIdAndUpdate(req.params.id, { $set: req.body })


            return res.json('Account info update successfully')
        } else {

            console.log('u can update yourselt only')
        }

    } catch (error) {

        console.log(error)
    }


})

router.delete('/:id', async (req, res) => {

    try {

        if (req.params.id = req.body.userId || req.user.isAdmin) {

            const deleteuser = await User.findByIdAndDelete(req.params.id)

            return res.json("user deleted successfully")
        }

    } catch (error) {

        console.log(error)
    }


})

router.get('singleuser/:id', async (req, res) => {
    try {

        const finduser = await User.findOne({ _id: req.params.id }, { password: 0, retypepassword: 0 })


        return res.json(finduser)

    } catch (error) {

        console.log(error)
    }


})


router.get('/onlineuser', async (req, res) => {
    try {

        const finduser = await User.find({ _id:{$ne:req.user.userId}  }, { password: 0, retypepassword: 0 })


        return res.json(finduser)

    } catch (error) {

        console.log(error)
    }


})

router.put('/follow/:id', async (req, res) => {

    if (req.params.id !== req.body.userId) {

        try {

            const user = await User.findOne({ _id: req.params.id })
            const currentuser = await User.findOne({ _id: req.body.userId })

            if (!user.followers.includes(req.body.userId)) {

                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentuser.updateOne({ $push: { following: req.params.id } })

                return res.json('follow successfully')
            } else {

                return res.status(400).json("u already follow this user")
            }


        } catch (error) {

            console.log(error)
        }

    } else {

        return res.json('u cant follow yourself')
    }




})


router.put('/unfollow/:id', async (req, res) => {

    if (req.params.id !== req.body.userId) {

        try {

            const user = await User.findOne({ _id: req.params.id })
            const currentuser = await User.findOne({ _id: req.body.userId })


            if (user.followers.includes(req.body.userId)) {

                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentuser.updateOne({ $pull: { following: req.params.id } })

                return res.json('unfollow successfully')
            } else {

                return res.json('u didnot follow this user')
            }


        } catch (error) {

            console.log(error)
        }

    } else {

        return res.json('u cant unfollow yourself')
    }




})



module.exports = router