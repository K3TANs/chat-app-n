import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
    const {socket} = useSocketContext();
    const {messages , setMessages} = useConversation();
    const {selectedConversation} = useConversation();

    useEffect(() => {
        socket?.on("newMessage" , ({senderId ,receiverId , newMessage}) => {
            console.log(';)');
            if(receiverId===selectedConversation?._id || senderId===selectedConversation?._id ){
                setMessages([...messages,newMessage])
            }
        })

        return () => socket?.off("newMessage")
    } , [socket , messages , setMessages])

}

export default useListenMessages