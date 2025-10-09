import { toast } from 'react-toastify';
import { useIntl } from '@edx/frontend-platform/i18n';

import useClient from './useClient';
import { fetchUsersService } from '../data/service';
import messages from '../components/messages';

export default function useUserSearch() {
  const { notification } = useClient();
  const intl = useIntl();

  const fetchUsers = async (query, setNewMessageUsers) => {
    try {
      if (query) {
        const users = await fetchUsersService(query);
        if (users) {
          setNewMessageUsers(
            users.results.map((user) => ({
              id: user.username,
              username: user.username,
            })),
          );
        }
      }
    } catch (ex) {
      notification(toast.error, intl.formatMessage(messages['messenger.error.userSearch']));
      console.error(ex);
    }
  };

  return { fetchUsers };
}
