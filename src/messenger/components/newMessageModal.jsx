import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import Multiselect from 'multiselect-react-dropdown';
import useUserSearch from '../hooks/useUserSearch';
import messages from './messages';

const NewMessageModal = ({ createGroupMessages }) => {
  const intl = useIntl();
  const [newMessageUsers, setNewMessageUsers] = useState([]);
  const [groupNewMessage, setGroupNewMessage] = useState('');
  const [newMessageSelectedUsers, setNewMessageSelectedUsers] = useState([]);
  const { fetchUsers } = useUserSearch();

  const handleSearch = (query) => {
    fetchUsers(query, setNewMessageUsers);
  };

  const handleNewMessageBtnClick = (event) => {
    event.preventDefault();
    createGroupMessages(groupNewMessage, setGroupNewMessage, newMessageSelectedUsers);
  };

  return (
    <div>
      <div
        className="modal fade modal-update"
        id="messageModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="messageModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <form onSubmit={(e) => handleNewMessageBtnClick(e)}>
              <div className="modal-header">
                <h5 className="modal-title" id="messageModalLongTitle">
                  {intl.formatMessage(messages['messenger.label.newMessage'])}
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label>{intl.formatMessage(messages['messenger.label.users'])}</label>
                <Multiselect
                  options={newMessageUsers}
                  displayValue="username"
                  onSearch={(data) => handleSearch(data)}
                  selectedValues={newMessageSelectedUsers}
                  onSelect={setNewMessageSelectedUsers}
                  placeholder={intl.formatMessage(messages['messenger.placeholder.select'])}
                />
                <div className="form-group">
                  <label htmlFor="group-message">{intl.formatMessage(messages['messenger.label.message'])}</label>
                  <textarea
                    className="form-control"
                    id="group-message"
                    placeholder={intl.formatMessage(messages['messenger.placeholder.enterMessage'])}
                    required
                    onChange={(e) => setGroupNewMessage(e.target.value)}
                    value={groupNewMessage}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                  {intl.formatMessage(messages['messenger.button.close'])}
                </button>
                <button type="submit" className="btn btn-primary">
                  {intl.formatMessage(messages['messenger.button.send'])}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

NewMessageModal.propTypes = {
  createGroupMessages: PropTypes.func.isRequired,
};

export default NewMessageModal;
