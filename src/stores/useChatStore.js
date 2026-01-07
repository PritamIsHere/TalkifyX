import { create } from "zustand";
import { api, socket } from "../api/api";
const useChatStore = create((set, get) => ({
  socketConnected: false,

  // State Variable
  chats: [],
  selectedChat: null,
  messages: [],
  notifications: [],

  // UI States
  isLoadingChats: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  isTyping: false,

  //    1. Socket Connection & Event Listeners

  connectSocket: (userId) => {
    if (socket.connected) return;

    socket.connect();

    // 2. Emit setup immediately upon connection
    socket.emit("setup", userId);
    // socket.on("connect", () => {
    //   console.log("Socket connected");
    // });

    // 3. Define Event Listeners
    socket
      .off("connected")
      .on("connected", () => set({ socketConnected: true }));

    socket.off("typing").on("typing", () => set({ isTyping: true }));
    socket.off("stop typing").on("stop typing", () => set({ isTyping: false }));

    socket
      .off("message received")
      .on("message received", (newMessageRecieved) => {
        const { selectedChat, messages, notifications } = get();

        // Case 1: Message is for the currently open chat
        if (selectedChat && selectedChat._id === newMessageRecieved.chat._id) {
          set({ messages: [...messages, newMessageRecieved] });
        }
        // Case 2: Message is for a different chat
        else {
          if (!notifications.some((n) => n._id === newMessageRecieved._id)) {
            set({ notifications: [newMessageRecieved, ...notifications] });
            // Optional: Update chat list order
            get().fetchChats();
          }
        }
      });
  },

  disconnectSocket: () => {
    if (socket.connected) {
      socket.disconnect();
      set({ socketConnected: false });
    }
  },

  //    2. Chat Management (HTTP)
  fetchChats: async () => {
    set({ isLoadingChats: true });
    try {
      const { data } = await api.get("/chat/fetch");
      set({ chats: data, isLoadingChats: false });
    } catch (error) {
      console.error("Failed to fetch chats", error);
      set({ isLoadingChats: false });
    }
  },

  accessChat: async (userId) => {
    set({ isLoadingChats: true });
    try {
      const { data } = await api.post("/chat/create", { userId });

      const { chats } = get();
      if (!chats.find((c) => c._id === data._id)) {
        set({ chats: [data, ...chats] });
      }

      set({ selectedChat: data, isLoadingChats: false });
    } catch (error) {
      console.error("Failed to access chat", error);
      set({ isLoadingChats: false });
    }
  },

  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    get().fetchMessages();
  },

  reSetSelectedChat: () => {
    set({
      selectedChat: null,
    });
  },

  //    3. Message Management

  fetchMessages: async (chatId = null) => {
    const { selectedChat } = get();
    const targetChatId = chatId || selectedChat?._id;

    if (!targetChatId) return;

    set({ isLoadingMessages: true });
    try {
      const { data } = await api.get(`/message/${targetChatId}`);
      set({ messages: data, isLoadingMessages: false });
      // Join the chat room
      socket.emit("join chat", targetChatId);
      // console.log(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (content) => {
    const { selectedChat, messages } = get();
    if (!selectedChat) return;

    set({ isSendingMessage: true });
    socket.emit("stop typing", selectedChat._id);

    try {
      const { data } = await api.post("/message/send", {
        content: content,
        chatId: selectedChat._id,
      });

      set({
        messages: [...messages, data],
        isSendingMessage: false,
      });
    } catch (error) {
      console.error("Failed to send message", error);
      set({ isSendingMessage: false });
    }
  },

  // 4. Typing Indicators
  emitTyping: () => {
    const { selectedChat } = get();
    if (!selectedChat) return;
    socket.emit("typing", selectedChat._id);
  },

  emitStopTyping: () => {
    const { selectedChat } = get();
    if (!selectedChat) return;
    socket.emit("stop typing", selectedChat._id);
  },
}));

export default useChatStore;
