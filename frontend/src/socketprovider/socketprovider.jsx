// SocketContext.js
import { createContext,useEffect } from "react";
import { io } from "socket.io-client";
import { backendurl } from "../baseurls/baseurls";
export const SocketContext = createContext(null);
 const socket = io(backendurl)
export const SocketProvider = ({ children }) => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket?.disconnect(); 
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  );
};