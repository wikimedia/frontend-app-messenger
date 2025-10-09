import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import Spinner from '../assets/spinner';
import messages from './messages';

const Inbox = ({
  inboxList,
  lastInboxRef,
  inboxLoading,
  setSelectedInboxUser,
  selectedInboxUser,
  isDrawerShown,
  setDrawerShown,
  searchInbox,
  setSearchInbox,
}) => {
  const intl = useIntl();

  const handleInboxClick = (event) => {
    setSelectedInboxUser(event.currentTarget.dataset.user);
    setDrawerShown(!isDrawerShown);
  };

  const renderDate = (dateStr) => {
    const date = new Date(dateStr).toDateString();
    const today = new Date().toDateString();
    const yesterday = (new Date(Date.now() - 86400000)).toDateString();
    if (today === date) { return 'Today'; }
    if (yesterday === date) { return 'Yesterday'; }
    return dateStr;
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <div className="btn-box">
          <strong className="text">{intl.formatMessage(messages['messenger.label.inbox'])}</strong>
          <button
            className="btn btn-primary btn-lg start-new-msg-btn"
            data-toggle="modal"
            data-target="#messageModalCenter"
          >
            <span className="icon-plus">+</span>{intl.formatMessage(messages['messenger.button.newMessage'])}
          </button>
        </div>
        <div className="search-box">
          <span className="fa fa-search" />
          <input
            type="text"
            value={searchInbox}
            onChange={(e) => setSearchInbox(e.target.value)}
            className="search-field"
            placeholder={intl.formatMessage(messages['messenger.placeholder.searchUsers'])}
          />
          {
            searchInbox && (
            <span
              className="fa fa-times-circle"
              onClick={() => { setSearchInbox(''); }}
            />
            )
                    }
        </div>
        <span
          className="fa fa-cog"
          onClick={() => { setDrawerShown(!isDrawerShown); }}
        />
      </div>
      <ul className="inbox-list">
        {
                    inboxLoading && (
                    <Spinner />
                    )
                }
        {
                    (!inboxList) ? <span>{intl.formatMessage(messages['messenger.inbox.noConversation'])}</span>
                      : inboxList.map(
                        (inbox, index) => {
                          const setRef = (inboxList.length === index + 1);
                          const name = (selectedInboxUser === inbox.with_user)
                            ? 'inbox-message active' : 'inbox-message';
                          const unreadClass = inbox.unread_count ? 'unread' : '';
                          const hasProfileImage = inbox.with_user_img.indexOf('default_50') === -1;
                          const profileName = `${inbox.with_user[0]}${inbox.with_user.split(' ')[1]
                            ? inbox.with_user.split(' ')[1][0] : inbox.with_user[1]}`;
                          return (
                            <li
                              key={index}
                              data-user={inbox.with_user}
                              className={`${name} ${unreadClass}`}
                              ref={setRef ? lastInboxRef : null}
                              onClick={(e) => handleInboxClick(e)}
                            >
                              {
                                        hasProfileImage
                                          ? (<img src={inbox.with_user_img} alt={inbox.with_user} />)
                                          : (
                                            <span
                                              className="img-placeholder"
                                              style={{ background: '#a7f9e0' }}
                                            >
                                              {profileName}
                                            </span>
                                          )
                                    }
                              <div className="about">
                                <div className="title">
                                  <span className="date">{renderDate(inbox.last_message_date)}</span>
                                  <span className="name">{inbox.with_user}</span>
                                </div>
                              </div>
                              <span className="badge rounded-pill bg-danger unread-count">
                                {inbox.unread_count ? inbox.unread_count : ''}
                              </span>
                            </li>
                          );
                        },
                      )
                }
      </ul>
    </div>
  );
};

Inbox.propTypes = {
  inboxList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      with_user: PropTypes.string.isRequired,
      with_user_img: PropTypes.string,
      last_message_date: PropTypes.string,
      unread_count: PropTypes.number,
    }),
  ).isRequired,
  lastInboxRef: PropTypes.func.isRequired,
  inboxLoading: PropTypes.bool.isRequired,
  setSelectedInboxUser: PropTypes.func.isRequired,
  selectedInboxUser: PropTypes.string.isRequired,
  isDrawerShown: PropTypes.bool.isRequired,
  setDrawerShown: PropTypes.func.isRequired,
  searchInbox: PropTypes.string.isRequired,
  setSearchInbox: PropTypes.func.isRequired,
};

export default Inbox;
