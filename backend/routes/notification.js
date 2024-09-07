const express = require('express');
const Notifications = require('../models/Notification')
const router = express.Router();

router.get('/followers', async (req, res) => {

    try {

        const notification = await Notifications.find({ receiver: req.user.userId }).sort({createdAt:-1})
        .populate('sender', 'name profilepicture')

        if (notification.length === 0 ) {

            return res.status(404).json('notification not found')
        }

        return res.json(notification)


    } catch (error) {

        console.log(error)
    }


})

router.put('/updatenotifications',async(req,res)=>{

    try {
                
        const result = await Notifications.updateMany({ receiver: req.user.userId }, { $set: { isread: true } });
         
        if(!result){
           
           return res.status(404).json('messags not found')
        }

        return res.json('update notifications')


       } catch (error) {
           console.error('Error updating review status:', error);
       }



})

module.exports = router