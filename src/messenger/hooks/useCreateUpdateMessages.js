import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  createMessageService,
  createGroupMessagesService,
  updateUnreadCountService,
}
  from '../data/service';

export default function useCreateUpdateMessages(
  inboxList,
  setInboxList,
  selectedInboxUser,
  setSelectedInboxMessages,
  username,
  profileImage,
) {
  const loggedInUsername = username;
  let currentInbox = {};

  const createMessage = async (message, setMessage, updateLastMessage, setReplying) => {
    try {
      const createdMessage = await createMessageService({
        receiver: selectedInboxUser,
        message,
      });
      if (createdMessage) {
        setSelectedInboxMessages((prevMsgs) => [createdMessage, ...prevMsgs]);
        setMessage('');
        setReplying(false);
        updateLastMessage(message);
      }
      toast.success('Message sent successfully');
    } catch (e) {
      toast.error('Failed to send message');
      console.error(e);
    }
  };

  const updateInboxList = (updatedInbox) => {
    const updatedInboxIds = updatedInbox.map((inbox) => inbox.id);
    let newList = inboxList.filter((inbox) => !updatedInboxIds.includes(inbox.id));
    newList = [...updatedInbox, ...newList];
    setInboxList(newList);
  };

  const updateOpenedConversation = (message, users) => {
    const isConversationOpened = users.some((user) => user.username === selectedInboxUser);
    if (isConversationOpened) {
      setSelectedInboxMessages((prevMsgs) => [
        {
          sender: loggedInUsername,
          sender_img: profileImage.imageUrlFull,
          created: 'now',
          message,
        },
        ...prevMsgs,
      ]);
    }
  };

  const createGroupMessages = async (message, setMessage, users) => {
    try {
      const updatedInbox = await createGroupMessagesService({
        receivers: users.map((user) => user.id),
        message,
      });

      updateInboxList(updatedInbox);
      updateOpenedConversation(message, users);
      setMessage('');
      toast.success('Messages sent successfully');
    } catch (e) {
      toast.error('Failed to send messages');
      console.error(e);
    }
  };

  const updateUnreadCount = async (inboxId) => {
    try {
      const updatedInbox = await updateUnreadCountService(inboxId);
      if (updatedInbox) {
        setInboxList((previousList) => previousList.map((inbox) => (inbox.id === updatedInbox.id
          ? updatedInbox : inbox)));
      }
    } catch (ex) {
      toast.error('Failed to mark messages as read');
      console.error(ex);
    }
  };

  const updateLastMessage = (message) => {
    currentInbox = inboxList.find((inbox) => inbox.with_user === selectedInboxUser);
    if (currentInbox) {
      currentInbox.last_message = message.length > 30 ? `${message.substring(0, 30)}...` : message;
      setInboxList((previousList) => previousList.map((inbox) => (inbox.id === currentInbox.id
        ? currentInbox : inbox)));
    }
  };

  useEffect(() => {
    currentInbox = inboxList.find((inbox) => inbox.with_user === selectedInboxUser);
    if (currentInbox && currentInbox.unread_count) {
      setTimeout(() => {
        updateUnreadCount(currentInbox.id);
      }, 3000);
    }
  }, [selectedInboxUser]);

  return {
    updateLastMessage, createGroupMessages, createMessage, updateUnreadCount,
  };
}
