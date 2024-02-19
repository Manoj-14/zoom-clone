import { setDirectChatHistory } from "../store/action";
import store from "../store/store";

export const appendNewMessageToChatHistory = (data) => {
  const { isAuthor, receiverSocketId, authorSocketId } = data;
  if (isAuthor) {
    appendNewMessageToDirectChatHistory(receiverSocketId, data);
  } else {
    appendNewMessageToDirectChatHistory(authorSocketId, data);
  }
};

const appendNewMessageToDirectChatHistory = (userSocketId, data) => {
  const chatHistory = [...store.getState().directChatHistory];
  const userChatHistory = chatHistory.find(
    (history) => history.socketId === userSocketId
  );

  if (userChatHistory) {
    const newDirectMessage = {
      isAuthor: data.isAuthor,
      messageContent: data.messageContent,
      identity: data.idenity,
    };
    const updatedUserChatHistory = {
      ...userChatHistory,
      chatHistory: [...userChatHistory.chatHistory, newDirectMessage],
    };

    const updatedChatHistory = [
      ...chatHistory.filter((h) => h.socketId !== userSocketId),
      updatedUserChatHistory,
    ];

    store.dispatch(setDirectChatHistory(updatedChatHistory));
  } else {
    const newUserChatHistory = {
      socketId: userSocketId,
      chatHistory: [
        {
          isAuthor: data.isAuthor,
          messageContent: data.messageContent,
          identity: data.idenity,
        },
      ],
    };
    const newChatHistory = [...chatHistory, newUserChatHistory];
    store.dispatch(setDirectChatHistory(newChatHistory));
  }
};
