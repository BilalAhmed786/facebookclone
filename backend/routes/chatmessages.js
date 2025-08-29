const express = require('express');
const Message = require('../models/Messages')
const router = express.Router();
router.get('/messages',async(req,res)=>{

    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.userId }, { receiver:req.user.userId }]
        })
        .populate('sender','name profilepicture status')
        .populate('receiver','name profilepicture status')
        .sort({ createdAt: 1 });
       
            if(!messages){

                return res.status(403).json('messages not found')
            }

            return res.json(messages)
        
    } catch (error) {
        console.error('Error fetching historical messages:', error);
    }


})

//comment updates notifications
router.put('/updatenotification/:msgsender',async(req,res)=>{

    try {
                
             const result = await Message.updateMany({ sender:req.params.msgsender,receiver: req.user.userId }, { $set: { isreviewed: true } });
              
             if(!result){
                
                return res.status(404).json('messags not found')
             }

             return res.json('update notifications')


            } catch (error) {
                console.error('Error updating review status:', error);
            }


})


router.put('/updatespecificnotific/:id',async(req,res)=>{

try{

    const result  = await Message.updateMany({sender:req.params.id,receiver:req.user.userId},{$set:{isreviewed:true}})

        if(!result){

            return res.status(404).json('messages not found')
        }    

        return  res.json('update succesfully')

}catch(error){
    console.log(error)
}


})

module.exports = router