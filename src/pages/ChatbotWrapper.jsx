import { useParams } from "react-router-dom";
import Chatbot from "./Chatbot";

const ChatbotWrapper = () => {
    const { formId } = useParams();

    if (!formId) {
        return <div>No form ID provided</div>;
    }

    return <Chatbot formId={formId} />;
};

export default ChatbotWrapper;
