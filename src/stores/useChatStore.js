// import { create } from "zustand";
// import { api, socket } from "../api/api";
// import { createJSONStorage, persist } from "zustand/middleware";
// const useChatStore = create(
//   persist(
//     (set, get) => ({
//       chats: [],
//       selectedChat: null,
//       messages: [],
//       notifications: [],
//       contactSearchResults: [],

//       socketConnected: false,
//       isSearchingContacts: false,
//       isLoadingChats: false,
//       isLoadingMessages: false,
//       isSendingMessage: false,
//       isTyping: false,

//       connectSocket: (userId) => {
//         if (socket.connected) return;

//         socket.connect();

//         socket.emit("setup", userId);

//         socket
//           .off("connected")
//           .on("connected", () => set({ socketConnected: true }));

//         socket.off("typing").on("typing", () => set({ isTyping: true }));
//         socket
//           .off("stop typing")
//           .on("stop typing", () => set({ isTyping: false }));

//         socket
//           .off("message received")
//           .on("message received", (newMessageReceived) => {
//             const { selectedChat, messages, chats, notifications } = get();

//             if (
//               selectedChat &&
//               selectedChat._id === newMessageReceived.chat._id
//             ) {
//               // Prevent duplicate messages
//               if (!messages.some((m) => m._id === newMessageReceived._id)) {
//                 set({ messages: [...messages, newMessageReceived] });
//               }
//             } else {
//               if (
//                 !notifications.some((n) => n._id === newMessageReceived._id)
//               ) {
//                 set({ notifications: [newMessageReceived, ...notifications] });
//               }
//             }

//             const updatedChats = chats.map((chat) => {
//               if (chat._id === newMessageReceived.chat._id) {
//                 return { ...chat, latestMessage: newMessageReceived };
//               }
//               return chat;
//             });

//             // Sort: Move the updated chat to index 0
//             const chatToMove = updatedChats.find(
//               (c) => c._id === newMessageReceived.chat._id
//             );
//             const otherChats = updatedChats.filter(
//               (c) => c._id !== newMessageReceived.chat._id
//             );

//             if (chatToMove) {
//               set({ chats: [chatToMove, ...otherChats] });
//             }
//           });
//       },

//       disconnectSocket: () => {
//         if (socket.connected) {
//           socket.disconnect();
//           set({ socketConnected: false });
//         }
//       },

//       searchContacts: async (query) => {
//         if (!query) {
//           set({ contactSearchResults: [], isSearchingContacts: false });
//           return;
//         }
//         set({ isSearchingContacts: true });
//         try {
//           const { data } = await api.get("/user/contact_search", {
//             params: {
//               q: query,
//             },
//           });
//           // console.log(data);
//           set({ contactSearchResults: data, isSearchingContacts: false });
//         } catch (error) {
//           console.error("Failed to search contacts", error);
//           set({ isSearchingContacts: false, contactSearchResults: [] });
//         }
//       },

//       clearContactSearch: () => {
//         set({ contactSearchResults: [], isSearchingContacts: false });
//       },

//       fetchChats: async () => {
//         set({ isLoadingChats: true });
//         try {
//           const { data } = await api.get("/chat/fetch");
//           set({ chats: data, isLoadingChats: false });
//           // console.log(data)
//         } catch (error) {
//           console.error("Failed to fetch chats", error);
//           set({ isLoadingChats: false });
//         }
//       },

//       accessChat: async (userId) => {
//         set({ isLoadingChats: true });
//         try {
//           const { data } = await api.post("/chat/create", { userId });

//           const { chats } = get();
//           if (!chats.find((c) => c._id === data._id)) {
//             set({ chats: [data, ...chats] });
//           }

//           set({
//             selectedChat: data,
//             isLoadingChats: false,
//             contactSearchResults: [],
//           });
//         } catch (error) {
//           console.error("Failed to access chat", error);
//           set({ isLoadingChats: false });
//         }
//       },

//       setSelectedChat: (chat) => {
//         const { notifications } = get();

//         const filteredNotifications = notifications.filter(
//           (n) => n.chat._id !== chat._id
//         );

//         set({
//           selectedChat: chat,
//           notifications: filteredNotifications,
//           messages: [],
//         });

//         get().fetchMessages();
//       },

//       reSetSelectedChat: () => {
//         set({
//           selectedChat: null,
//         });
//       },

//       fetchMessages: async (chatId = null) => {
//         const { selectedChat } = get();
//         const targetChatId = chatId || selectedChat?._id;

//         if (!targetChatId) return;

//         set({ isLoadingMessages: true });
//         try {
//           const { data } = await api.get(`/message/${targetChatId}`);
//           set({ messages: data, isLoadingMessages: false });

//           socket.emit("join chat", targetChatId);
//         } catch (error) {
//           console.error("Failed to fetch messages", error);
//           set({ isLoadingMessages: false });
//         }
//       },

//       sendMessage: async (content) => {
//         const { selectedChat, messages } = get();
//         if (!selectedChat) return;

//         set({ isSendingMessage: true });
//         socket.emit("stop typing", selectedChat._id);

//         try {
//           const { data } = await api.post("/message/send", {
//             content: content,
//             chatId: selectedChat._id,
//           });

//           set({
//             messages: [...messages, data],
//             isSendingMessage: false,
//           });
//         } catch (error) {
//           console.error("Failed to send message", error);
//           set({ isSendingMessage: false });
//         }
//       },

//       // 4. Typing Indicators
//       emitTyping: () => {
//         const { selectedChat } = get();
//         if (!selectedChat) return;
//         socket.emit("typing", selectedChat._id);
//       },

//       emitStopTyping: () => {
//         const { selectedChat } = get();
//         if (!selectedChat) return;
//         socket.emit("stop typing", selectedChat._id);
//       },
//     }),
//     {
//       name: "XDAFRBA",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         notifications: state.notifications,
//         chats: state.chats,
//       }),
//     }
//   )
// );

// export default useChatStore;


import { create } from "zustand";
import { api, socket } from "../api/api";
import { createJSONStorage, persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [],
      selectedChat: null,
      messages: [],
      notifications: [],
      contactSearchResults: [],

      socketConnected: false,
      isSearchingContacts: false,
      isLoadingChats: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      isTyping: false,

      connectSocket: (userId) => {
        // FIX 1: Do not return early.
        // If we return early, we skip attaching the event listeners below.
        if (!socket.connected) {
          socket.connect();
        }

        // Always identify the user
        socket.emit("setup", userId);

        // Always attach/refresh listeners (using .off().on() avoids duplicates)
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

            if (
              selectedChat &&
              selectedChat._id === newMessageReceived.chat._id
            ) {
              // Prevent duplicate messages
              if (!messages.some((m) => m._id === newMessageReceived._id)) {
                set({ messages: [...messages, newMessageReceived] });
              }
            } else {
              if (
                !notifications.some((n) => n._id === newMessageReceived._id)
              ) {
                set({ notifications: [newMessageReceived, ...notifications] });
              }
            }

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

      searchContacts: async (query) => {
        if (!query) {
          set({ contactSearchResults: [], isSearchingContacts: false });
          return;
        }
        set({ isSearchingContacts: true });
        try {
          const { data } = await api.get("/user/contact_search", {
            params: {
              q: query,
            },
          });
          set({ contactSearchResults: data, isSearchingContacts: false });
        } catch (error) {
          console.error("Failed to search contacts", error);
          set({ isSearchingContacts: false, contactSearchResults: [] });
        }
      },

      clearContactSearch: () => {
        set({ contactSearchResults: [], isSearchingContacts: false });
      },

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

          set({
            selectedChat: data,
            isLoadingChats: false,
            contactSearchResults: [],
          });

          // FIX 2: Instant Connection Logic
          // We must tell the socket to join this room immediately
          socket.emit("join chat", data._id);
        } catch (error) {
          console.error("Failed to access chat", error);
          set({ isLoadingChats: false });
        }
      },

      setSelectedChat: (chat) => {
        const { notifications } = get();

        const filteredNotifications = notifications.filter(
          (n) => n.chat._id !== chat._id
        );

        set({
          selectedChat: chat,
          notifications: filteredNotifications,
          messages: [],
        });

        get().fetchMessages();
      },

      reSetSelectedChat: () => {
        set({
          selectedChat: null,
        });
      },

      fetchMessages: async (chatId = null) => {
        const { selectedChat } = get();
        const targetChatId = chatId || selectedChat?._id;

        if (!targetChatId) return;

        set({ isLoadingMessages: true });
        try {
          const { data } = await api.get(`/message/${targetChatId}`);
          set({ messages: data, isLoadingMessages: false });

          socket.emit("join chat", targetChatId);
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