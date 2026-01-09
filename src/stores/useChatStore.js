import { create } from "zustand";
import { api, socket } from "../api/api";
import { createJSONStorage, persist } from "zustand/middleware";
const useChatStore = create(
  persist(
    (set, get) => ({
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
        socket
          .off("stop typing")
          .on("stop typing", () => set({ isTyping: false }));

        socket
          .off("message received")
          .on("message received", (newMessageReceived) => {
            const { selectedChat, messages, chats, notifications } = get();

            // --- LOGIC 1: Update the Active Conversation ---
            // If the user is currently looking at this chat
            if (
              selectedChat &&
              selectedChat._id === newMessageReceived.chat._id
            ) {
              // Prevent duplicate messages
              if (!messages.some((m) => m._id === newMessageReceived._id)) {
                set({ messages: [...messages, newMessageReceived] });
              }
            }

            // --- LOGIC 2: Update Notifications (If chat is NOT open) ---
            else {
              // Only add if not already notified
              if (
                !notifications.some((n) => n._id === newMessageReceived._id)
              ) {
                set({ notifications: [newMessageReceived, ...notifications] });
              }
            }

            // --- LOGIC 3: INSTANTLY Refresh Sidebar (Move Chat to Top) ---
            // This updates the "Last Message" preview without an API call
            const updatedChats = chats.map((chat) => {
              if (chat._id === newMessageReceived.chat._id) {
                return { ...chat, latestMessage: newMessageReceived };
              }
              return chat;
            });

            // Sort: Move the updated chat to index 0
            const chatToMove = updatedChats.find(
              (c) => c._id === newMessageReceived.chat._id
            );
            const otherChats = updatedChats.filter(
              (c) => c._id !== newMessageReceived.chat._id
            );

            if (chatToMove) {
              set({ chats: [chatToMove, ...otherChats] });
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

      // Inside chatStore.js

      setSelectedChat: (chat) => {
        const { notifications } = get();

        // Remove all notifications that belong to the chat we just opened
        const filteredNotifications = notifications.filter(
          (n) => n.chat._id !== chat._id
        );

        set({
          selectedChat: chat,
          notifications: filteredNotifications, // Clear badge
          messages: [],
        });

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
    }),
    {
      name: "XDAFRBA",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        chats: state.chats,
      }),
    }
  )
);

export default useChatStore;
