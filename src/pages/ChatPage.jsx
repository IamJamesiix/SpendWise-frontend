import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { api } from "../services/api";

export const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-8">Messages</h1>

      <div className="grid grid-cols-3 gap-6 h-[600px]">
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-4 overflow-y-auto">
          <h3 className="text-white font-bold mb-4">Contacts</h3>
          {contacts.map((contact, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedContact(contact);
                loadMessages(contact._id);
              }}
              className="w-full p-3 mb-2 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-white text-left"
            >
              {contact.firstName} {contact.lastName}
            </button>
          ))}
        </div>

        <div className="col-span-2 bg-gray-800/50 rounded-2xl border border-purple-500/20 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-purple-500/20">
                <h3 className="text-white font-bold">
                  {selectedContact.firstName} {selectedContact.lastName}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.senderId === selectedContact._id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl ${
                        msg.senderId === selectedContact._id
                          ? "bg-gray-700 text-white"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-purple-500/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
