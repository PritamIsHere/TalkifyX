export const formatChatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffInMs = today - messageDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  
  if (diffInDays < 7 && diffInDays > 1) {
    return date.toLocaleDateString([], { weekday: "long" });
  }
  
  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
