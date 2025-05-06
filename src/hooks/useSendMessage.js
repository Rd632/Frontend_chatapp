import { useState } from "react";
import useConversation from "../zustand/userConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext"; // ✅

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const {  setMessages, selectedConversation } = useConversation();
	const { socket } = useSocketContext(); // ✅

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages((prevMessages) => [...prevMessages, data]);



			// ✅ Emit message to receiver via socket
			socket.emit("sendMessage", {
				...data,
				receiverId: selectedConversation._id,
			});
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
