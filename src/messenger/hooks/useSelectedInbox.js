import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from '@edx/frontend-platform/i18n';

import useClient from './useClient';
import { fetchSelectedInboxMessagesService } from '../data/service';
import messages from '../components/messages';

export default function useSelectedInbox(messagesPageNumber, setMessagesPageNumber, username, profileImage) {
  const { notification } = useClient();
  const intl = useIntl();

  const [selectedInboxUser, setSelectedInboxUser] = useState('');
  const [selectedInboxMessages, setSelectedInboxMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesHasMore, setMessagesHasMore] = useState(false);

  const loggedinUser = {
    name: username,
    profileName: `${username[0]}${
      username.split(' ')[1] ? username.split(' ')[1][0] : username[1]
    }`,
    hasProfileImage: profileImage.hasImage,
    profileImage: profileImage.imageUrlFull,
  };

  const fetchSelectedInboxMessages = async (isNewUser, pageNumber) => {
    try {
      setMessagesLoading(true);
      const inboxMessages = await fetchSelectedInboxMessagesService(pageNumber, selectedInboxUser);

      if (inboxMessages) {
        if (isNewUser) {
          setSelectedInboxMessages(inboxMessages.results);
        } else {
          setSelectedInboxMessages((previousList) => [
            ...previousList,
            ...inboxMessages.results,
          ]);
        }
        setMessagesHasMore(pageNumber < inboxMessages.numPages);
      }
      setMessagesLoading(false);
    } catch (e) {
      notification(
        toast.error,
        `${intl.formatMessage(messages['messenger.error.userConversation'])} ${selectedInboxUser}.`
      );
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedInboxUser) {
      setMessagesPageNumber(1);
      fetchSelectedInboxMessages(true, 1).then();
    }
  }, [selectedInboxUser]);

  useEffect(() => {
    if (selectedInboxUser && messagesPageNumber > 1) {
      fetchSelectedInboxMessages(false, messagesPageNumber).then();
    }
  }, [messagesPageNumber]);

  return {
    selectedInboxUser,
    setSelectedInboxUser,
    selectedInboxMessages,
    setSelectedInboxMessages,
    messagesLoading,
    messagesHasMore,
    loggedinUser,
  };
}
