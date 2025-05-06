import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/userConversation";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;

			// ✅ Check if this message is already in state to prevent duplicates
			const alreadyExists = messages.some(
				(msg) => msg._id === newMessage._id
			);

			if (!alreadyExists) {
				setMessages((prev) => [...prev, newMessage]);
			}
		};

		socket.on("newMessage", handleNewMessage);

		return () => socket.off("newMessage", handleNewMessage);
	}, [socket, messages, setMessages]);
};

export default useListenMessages;
