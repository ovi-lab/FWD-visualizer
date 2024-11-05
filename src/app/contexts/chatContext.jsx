'use client'
import React, { createContext, useState, useContext } from 'react';

/** 
 * @constant
 * @type {React.Context}
 * @description Creates a context for managing chat anchor state.
 */
const ChatContext = createContext();

/**
 * the chat anchor state and its setter function to the component tree. This context is what makes the chat jump to a specific sentence when a user selects it within the information panel.
 * @param {Object} props - The properties passed to the provider.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @returns {JSX.Element} The provider component that wraps the children with the ChatContext.
 */
export const ChatProvider = ({ children }) => {
    const [chatAnchor, setChatAnchor] = useState(null);
    
  return (
    <ChatContext.Provider value={{ chatAnchor, setChatAnchor }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatAnchor = () => useContext(ChatContext);