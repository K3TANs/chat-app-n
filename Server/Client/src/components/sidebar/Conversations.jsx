import useGetConversation from "../../hooks/useGetConversation"
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation"

const Conversations = () => {

  const {loading , conversations} = useGetConversation();


  return (
    <div className="py-2 flex flex-col overflow-auto" >
      {conversations.map((conversation,idx) => (
          <Conversation key={conversation._id} conversation={conversation} emoji={getRandomEmoji()} lastIdx={idx==conversation.length-1} />
      ))}

      {loading && <span className="loading spinner-loading" ></span>}
    </div>
  )
}

export default Conversations