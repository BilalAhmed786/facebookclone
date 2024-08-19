const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path')
const upload = require('../multer/multer')

const router = express.Router();

//user update
// router.put('/:id', async (req, res) => {

//     try {
//         if (req.params.id === req.body.userId || req.user.isAdmin) {

//             if (req.body.password) {

//                 if (req.body.password !== req.body.retypepassword) {


//                     return res.status(400).json('passwords are not matched')
//                 }

//                 const user = await User.findOne({ _id: req.params.id })

//                 const comparepass = await bcrypt.compare(req.body.oldpassword, user.password)


//                 if (!comparepass) {


//                     return res.status(400).json('Invalid old password')

//                 }

//                 const salt = await bcrypt.genSalt(10)

//                 req.body.password = await bcrypt.hash(req.body.password, salt)
//                 req.body.retypepassword = await bcrypt.hash(req.body.retypepassword, salt)

//             }

//             const userupdate = await User.findByIdAndUpdate(req.params.id, { $set: req.body })


//             return res.json('Account info update successfully')
//         } else {

//             console.log('u can update yourselt only')
//         }

//     } catch (error) {

//         console.log(error)
//     }


// })

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

router.get('/singleuser/:id', async (req, res) => {
            
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


// router.put('/unfollow/:id', async (req, res) => {

//     if (req.params.id !== req.body.userId) {

//         try {

//             const user = await User.findOne({ _id: req.params.id })
//             const currentuser = await User.findOne({ _id: req.body.userId })


//             if (user.followers.includes(req.body.userId)) {

//                 await user.updateOne({ $pull: { followers: req.body.userId } })
//                 await currentuser.updateOne({ $pull: { following: req.params.id } })

//                 return res.json('unfollow successfully')
//             } else {

//                 return res.json('u didnot follow this user')
//             }


//         } catch (error) {

//             console.log(error)
//         }

//     } else {

//         return res.json('u cant unfollow yourself')
//     }




// })

// api for profile cover photo

router.post('/uploadcover',upload.single('file'),async(req,res)=>{

    
    const user = await User.findById(req.user.userId)

    if (!req.file || req.file.length === 0) {

        return res.status(400).send('No files uploaded.');

    }

         const filepath =  path.join(__dirname,'../public/uploads',user.coverpicture)
             
          fs.unlink(filepath,(err)=>{

            if(err){
               
                console.log('file not found')
            }else{

                console.log('previous cover remove')
            }

        
          })

        user.coverpicture = req.file.filename;

        const usercoverpic = await user.save()

    if(usercoverpic){

        return res.json('Cover pic updated')
    }


})


router.post('/uploadprofile',upload.single('file'),async(req,res)=>{

    
    const user = await User.findById(req.user.userId)

    if (!req.file || req.file.length === 0) {

        return res.status(400).send('No files uploaded.');

    }

    const filepath =  path.join(__dirname,'../public/uploads',user.profilepicture)
             
          fs.unlink(filepath,(err)=>{

            if(err){
               

                console.log('file not found')


            }else{

                console.log('previous profile pic remove')
            }   

        
          })

        user.profilepicture = req.file.filename;

        const userprofilepic = await user.save()

    if(userprofilepic){

        return res.json('profile pic updated')
    }


})

router.put('/usernameedit',async(req,res)=>{


                    if(!req.body.username){


                        return res.status(400).json('field is required')
                    }

        try{

               const user = await User.findByIdAndUpdate({_id:req.user.userId},{name:req.body.username})

                    if(!user){

                        return res.status(404).json('something wrong happend')
                    }

                   return res.json('update user name succesfully') 


        }catch(error){

            console.log(error)
        }

})

router.put('/userinfoedit',async(req,res)=>{

const {city,from,relationship} = req.body

            if(!city || !from || !relationship){

            return res.status(400).json('All fields required')
     
        }

        
    try{


        const userinfo  = await User.findByIdAndUpdate({_id:req.user.userId},{city,from,relationship})

            if(!userinfo){

                return res.status(404).json('user is not found')
            }

                
                return res.json('userinfo updated')

    }catch(error){




        console.log(error)
    }



})


router.get('/followers',async(req,res)=>{

        try{


        const followers = await User.find({_id:{$in:req.query.follow}},{name:1,profilepicture:1})


        if(!followers){

            return res.status(404).json('followers not found')
        }

           return res.json(followers)
      


    }catch(error){

      
        console.log(error)
    
    }

})

module.exports = router