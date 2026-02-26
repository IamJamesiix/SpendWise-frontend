import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, ArrowLeft, User, Image, X, Search, Plus } from "lucide-react";
import { api } from "../services/api";

// ✅ Fix 5 — compress image before upload to speed up sending
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const ChatPage = () => {
  // ✅ Fix 4 — show chat partners by default, not all users
  const [chatPartners, setChatPartners] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showContacts, setShowContacts] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadChatPartners = async () => {
    try {
      // Use chat partners (people you've messaged) for sidebar
      const result = await api.getChatPartners();
      if (Array.isArray(result)) setChatPartners(result);
      else if (result?.contacts) setChatPartners(result.contacts);
    } catch (err) {
      console.error("Failed to load chat partners");
    }
  };

  const loadAllContacts = async () => {
    try {
      const result = await api.getContacts();
      if (result.success) setAllContacts(result.contacts || []);
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
    loadChatPartners();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setShowContacts(false);
    setShowNewChat(false);
    loadMessages(contact._id);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const startNewChat = async (contact) => {
    // Add to chat partners if not already there
    setChatPartners((prev) =>
      prev.find((p) => p._id === contact._id) ? prev : [contact, ...prev]
    );
    selectContact(contact);
  };

  // ✅ Fix 5 — compress before converting
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image");
    if (file.size > 10 * 1024 * 1024) return alert("Image must be under 10MB");

    const compressed = await compressImage(file);
    setImagePreview(compressed);
    setImageBase64(compressed);
    e.target.value = "";
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !imageBase64) || !selectedContact) return;
    setSending(true);
    try {
      await api.sendMessage(selectedContact._id, input, imageBase64);
      setInput("");
      clearImage();
      loadMessages(selectedContact._id);
      // refresh chat partners so new conversation appears
      loadChatPartners();
    } catch (err) {
      console.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getInitials = (contact) => {
    const name = contact?.fullName || contact?.userName || "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const ContactAvatar = ({ contact, active = false }) => (
    contact?.profilePic ? (
      <img src={contact.profilePic} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
    ) : (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
        active ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 border border-gray-700"
      }`}>
        {getInitials(contact)}
      </div>
    )
  );

  const filteredContacts = allContacts.filter((c) =>
    (c.fullName || c.userName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-purple-500/15 p-2 rounded-xl">
            <MessageCircle className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Messages</h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">
          {chatPartners.length > 0
            ? `${chatPartners.length} conversation${chatPartners.length !== 1 ? "s" : ""}`
            : "Start a new conversation"}
        </p>
      </div>

      <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className={`${showContacts ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 lg:w-72 border-r border-gray-800 shrink-0`}>
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Conversations</h3>
            {/* ✅ Fix 4 — New chat button */}
            <button
              onClick={() => { setShowNewChat(true); loadAllContacts(); setSearchQuery(""); }}
              className="p-1.5 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
              title="New conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatPartners.length > 0 ? (
              <div className="p-2 space-y-1">
                {chatPartners.map((contact, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectContact(contact)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                      selectedContact?._id === contact._id
                        ? "bg-purple-500/15 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <ContactAvatar contact={contact} active={selectedContact?._id === contact._id} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.fullName || contact.userName}</p>
                      <p className="text-xs text-gray-500 truncate">{contact.email || "Tap to message"}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle className="w-8 h-8 text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 mb-3">No conversations yet</p>
                <button
                  onClick={() => { setShowNewChat(true); loadAllContacts(); }}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Start a conversation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* New Chat Search Panel */}
        {showNewChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-white">New Conversation</h3>
                <button onClick={() => setShowNewChat(false)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  />
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact, idx) => (
                    <button
                      key={idx}
                      onClick={() => startNewChat(contact)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-gray-800 transition-colors"
                    >
                      <ContactAvatar contact={contact} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{contact.fullName || contact.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">
                      {searchQuery ? "No users found" : "Loading users..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat area */}
        <div className={`${!showContacts ? "flex" : "hidden"} md:flex flex-col flex-1 min-w-0`}>
          {selectedContact ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                <button onClick={() => setShowContacts(true)} className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <ContactAvatar contact={selectedContact} active />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedContact.fullName || selectedContact.userName}
                  </p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => {
                    const isSender = msg.senderId !== selectedContact._id;
                    return (
                      <div key={idx} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl text-sm overflow-hidden ${
                          isSender
                            ? "bg-purple-600 text-white rounded-tr-md"
                            : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-md"
                        }`}>
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="sent"
                              className="max-w-full max-h-60 object-cover cursor-pointer"
                              onClick={() => window.open(msg.image, "_blank")}
                            />
                          )}
                          {msg.text && <p className="px-4 py-2.5">{msg.text}</p>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <MessageCircle className="w-8 h-8 text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500">No messages yet. Say hello!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {imagePreview && (
                <div className="px-4 pt-3">
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="preview" className="h-24 rounded-xl object-cover border border-gray-700" />
                    <button onClick={clearImage} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 sm:p-4 border-t border-gray-800">
                <div className="flex gap-2 items-end">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-colors shrink-0"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={(!input.trim() && !imageBase64) || sending}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 p-2.5 rounded-xl transition-colors shrink-0"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 mb-4">
                <MessageCircle className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Select a conversation</h3>
              <p className="text-sm text-gray-500 max-w-xs mb-4">Choose from your conversations or start a new one.</p>
              <button
                onClick={() => { setShowNewChat(true); loadAllContacts(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-purple-400 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                New Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};