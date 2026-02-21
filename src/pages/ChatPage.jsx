import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, ArrowLeft, User } from "lucide-react";
import { api } from "../services/api";

export const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showContacts, setShowContacts] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const loadContacts = async () => {
    try {
      const result = await api.getContacts();
      if (result.success) setContacts(result.contacts || []);
    } catch (err) {
      console.error("Failed to load contacts");
    }
  };

  const loadMessages = async (userId) => {
    try {
      const result = await api.getMessagesByUserId(userId);
      if (result.success) setMessages(result.messages || []);
    } catch (err) {
      console.error("Failed to load messages");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setShowContacts(false);
    loadMessages(contact._id);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedContact) return;
    try {
      await api.sendMessage(selectedContact._id, input);
      setInput("");
      loadMessages(selectedContact._id);
    } catch (err) {
      console.error("Failed to send message");
    }
  };

  const getInitials = (contact) => {
  const name = contact?.fullName || contact?.userName || "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

  return (
    <div className="fade-in flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-purple-500/15 p-2 rounded-xl">
            <MessageCircle className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Messages
          </h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">
          {contacts.length > 0
            ? `${contacts.length} contact${contacts.length !== 1 ? "s" : ""}`
            : "Your conversations"}
        </p>
      </div>

      {/* Chat layout */}
      <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 flex overflow-hidden min-h-0">
        {/* Contacts sidebar */}
        <div
          className={`${
            showContacts ? "flex" : "hidden"
          } md:flex flex-col w-full md:w-80 lg:w-72 border-r border-gray-800 shrink-0`}
        >
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">Contacts</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.length > 0 ? (
              <div className="p-2 space-y-1">
                {contacts.map((contact, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectContact(contact)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                      selectedContact?._id === contact._id
                        ? "bg-purple-500/15 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                        selectedContact?._id === contact._id
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {getInitials(contact)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {contact.fullName || contact.userName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {contact.email || "Tap to message"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <User className="w-8 h-8 text-gray-600 mb-3" />
                <p className="text-sm text-gray-500">No contacts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div
          className={`${
            !showContacts ? "flex" : "hidden"
          } md:flex flex-col flex-1 min-w-0`}
        >
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                <button
                  onClick={() => setShowContacts(true)}
                  className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {getInitials(selectedContact)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => {
                    const isSender = msg.senderId !== selectedContact._id;
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                            isSender
                              ? "bg-purple-600 text-white rounded-tr-md"
                              : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-md"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <MessageCircle className="w-8 h-8 text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500">
                      No messages yet. Say hello!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-colors shrink-0"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No contact selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 mb-4">
                <MessageCircle className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Choose a contact from the sidebar to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
