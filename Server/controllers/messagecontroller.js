import Conversation from "../model/conversationModel.js";
import Message from "../model/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try{
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id
        
        let conversation = await Conversation.findOne(
            {
                participants:{$all:[senderId,receiverId]},
            }
        )
        
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId],
            })
        }
        
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        
        await Promise.all([conversation.save(),newMessage.save()]);
        
        // socket io functionality will go here 

        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",{senderId, receiverId , newMessage })
        }
        
        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("Error in message controller" , error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const getMessages = async (req,res) => {
    try{
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all : [senderId,userToChatId]},
        }).populate('messages'); // NOT REFERENCE BUT ACTUALL MESSAGES
        
        if(!conversation){
            res.status(200).json([]);
            return;
        }

        const messages= conversation.messages;

        res.status(200).json(messages);

    }
    catch(error){
        console.log("error in getmessage controller: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}