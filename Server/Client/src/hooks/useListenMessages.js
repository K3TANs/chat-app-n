import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
    const {socket} = useSocketContext();
    const {messages , setMessages} = useConversation();
    const {selectedConversation} = useConversation();
    const {authUser} = useAuthContext();

    useEffect(() => {
        socket?.on("newMessage" , ({senderId ,receiverId , newMessage}) => {
            console.log(';)');
            if(receiverId===selectedConversation?._id || senderId===selectedConversation?._id ){
                setMessages([...messages,newMessage])
            }
        })
        console.log(";)");
        return () => socket?.off("newMessage")
    } , [socket , messages , setMessages , selectedConversation ])

    useEffect(() => {
        const lastMessageFromOtherUser = messages.length && messages[messages.length-1].sender !== selectedConversation?._id;
        if (lastMessageFromOtherUser) {
            socket?.emit("markMessageAsSeen", {
                receiverId: authUser?._id,
                senderId: selectedConversation?._id
            })
        }
        socket?.on("messagesSeen", ({ receiverId }) => {
            if (receiverId === selectedConversation?._id) {
                let updatedMessages = []
                updatedMessages =  messages.map(message => (
                    {
                        ...message,
                        seen: true,
                    }

                ))
                setMessages(updatedMessages)
            }
        })

        return () => socket?.off("messagesSeen")

    } , [selectedConversation , messages.length , socket , setMessages]);

}

export default useListenMessages