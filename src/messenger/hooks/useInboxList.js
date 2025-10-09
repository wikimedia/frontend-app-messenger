import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../components/messages';
import useClient from './useClient';
import { fetchInboxListService } from '../data/service';

export default function useInboxList(inboxPageNumber, setSelectedInboxUser, setInboxPageNumber, searchInbox) {
  const { notification } = useClient();
  const intl = useIntl();

  const [inboxList, setInboxList] = useState([]);
  const [inboxHasMore, setInboxHasMore] = useState(false);
  const [inboxLoading, setInboxLoading] = useState(false);

  const fetchInboxList = async (pageNumber) => {
    try {
      setInboxLoading(true);
      const inboxListData = await fetchInboxListService(pageNumber, searchInbox);

      if (inboxListData) {
        if (pageNumber === 1) {
          setInboxList(inboxListData.results);
          if (inboxListData.results.length) {
            setSelectedInboxUser(inboxListData.results[0].withUser);
          }
        } else {
          setInboxList((previousList) => [...previousList, ...inboxListData.results]);
        }
        setInboxHasMore(pageNumber < inboxListData.numPages);
      }

      setInboxLoading(false);
    } catch (e) {
      notification(toast.error, intl.formatMessage(messages['messenger.error.loadConversation']));
      console.error(e);
    }
  };

  useEffect(() => {
    setInboxLoading(true);
    const delayDebounceFetch = setTimeout(() => {
      setInboxPageNumber(1);
      fetchInboxList(1);
    }, 3000);

    return () => clearTimeout(delayDebounceFetch);
  }, [searchInbox]);

  useEffect(() => {
    if (inboxPageNumber > 1) {
      fetchInboxList(inboxPageNumber);
    }
  }, [inboxPageNumber]);

  return {
    inboxList, setInboxList, inboxLoading, inboxHasMore,
  };
}
