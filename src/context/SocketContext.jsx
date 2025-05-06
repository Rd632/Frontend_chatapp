import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			// Only create a socket if one doesn't already exist
			if (!socket) {
				const socketInstance = io("https://backend-chatapp-5e95.onrender.com/", {
					query: {
						userId: authUser._id,
					},
				});
	
				setSocket(socketInstance);
	
				socketInstance.on("getOnlineUsers", (users) => {
					setOnlineUsers(users);
				});
			}
		} else {
			// Clean up when authUser is removed or changes
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	
		// Clean up on unmount
		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, [authUser , socket]); // Only rerun when authUser changes
	

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};