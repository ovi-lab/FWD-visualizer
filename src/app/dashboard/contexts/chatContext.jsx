'use client'
import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatAnchor, setChatAnchor] = useState(null);
    
  return (
    <ChatContext.Provider value={{ chatAnchor, setChatAnchor }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatAnchor = () => useContext(ChatContext);