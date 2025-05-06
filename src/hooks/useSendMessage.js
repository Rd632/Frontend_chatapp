import { useState } from "react";
import useConversation from "../zustand/userConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { socket } = useSocketContext(); // ⬅️ Import socket

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/api/messages/send/${selectedConversation._id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ message }),
				}
			);
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			// 1. Optimistic update
			setMessages([...messages, data]);

			// 2. Emit to socket for real-time messaging
			socket?.emit("sendMessage", data); // ⬅️ Send new message via socket

		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
