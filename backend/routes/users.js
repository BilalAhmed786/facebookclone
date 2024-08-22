const express = require('express');
const User = require('../models/User');
const fs = require('fs');
const path = require('path')
const upload = require('../multer/multer')

const router = express.Router();

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


        return res.json({finduser:finduser,loginuser:req.user.userId})

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
    try {
        const user = await User.findOne({ _id: req.params.id });
        const currentUser = await User.findOne({ _id: req.user.userId });

        if (!user.followers.includes(req.user.userId)) {
            // Add current user to the followers array
            user.followers.push(req.user.userId);

            // Add the user to the following array of the current user
            currentUser.following.push(req.params.id);

            await user.save();
            await currentUser.save();

            return res.json({ msg: 'Followed successfully', following: currentUser.following });
        } else {
            // Remove current user from the followers array
            user.followers.pull(req.user.userId);

            // Remove the user from the following array of the current user
            currentUser.following.pull(req.params.id);

            await user.save();
            await currentUser.save();

            return res.json({ msg: 'Unfollowed successfully', following:''});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while trying to follow/unfollow the user' });
    }
});


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