import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();
    const socketRef = useRef(null); // Ref to store socket instance

    useEffect(() => {
        if (authUser) {
            // Only create a socket if it doesn't already exist
            if (!socketRef.current) {
                socketRef.current = io("https://backend-chatapp-5e95.onrender.com/", {
                    query: {
                        userId: authUser._id,
                    },
                });

                socketRef.current.on("getOnlineUsers", (users) => {
                    setOnlineUsers(users);
                });
            }
        } else {
            // Clean up when authUser is removed or changes
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        }

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [authUser]); // Only rerun when authUser changes

    return <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>{children}</SocketContext.Provider>;
};
