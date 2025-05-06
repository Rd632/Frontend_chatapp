import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/userConversation";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation();

	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;

			setMessages((prevMessages) => {
				const alreadyExists = prevMessages.some(
					(msg) => msg._id === newMessage._id
				);
				if (alreadyExists) return prevMessages;
				return [...prevMessages, newMessage];
			});
		};

		socket.on("newMessage", handleNewMessage);
		return () => socket.off("newMessage", handleNewMessage);
	}, [socket, setMessages]);
};

export default useListenMessages;
