import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import Spinner from '../assets/spinner';
import messages from './messages';

const Conversation = ({
  selectedInboxMessages,
  createMessage,
  messagesLoading,
  updateLastMessage,
  lastMessageRef,
  selectedInboxUser,
  loggedinUser,
}) => {
  const intl = useIntl();
  const [message, setMessage] = useState('');
  const [isReplying, setReplying] = useState(false);

  const handleSendMessageBtnClick = () => {
    createMessage(message, setMessage, updateLastMessage, setReplying);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = '5px';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleCancelReply = (e) => {
    setReplying(false);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{intl.formatMessage(messages['messenger.label.inbox'])} / {selectedInboxUser}&nbsp;</h2>
      </div>
      <div className="chat">
        {
                    isReplying && (
                    <div className="chat-row">
                      {
                                loggedinUser.hasProfileImage ? (
                                  <img src={loggedinUser.profileImage} alt={loggedinUser.name} />
                                ) : (
                                  <span className="img-placeholder" style={{ background: '#a7f9e0' }}>{loggedinUser.profileName}</span>
                                )
                            }
                      <div className="chat-detail">
                        <div className="new-message">
                          <textarea
                            className="new-message-input"
                            value={message}
                            placeholder={intl.formatMessage(messages['messenger.placeholder.typeMessage'])}
                            onChange={handleInputChange}
                            autoFocus
                          />
                          <div className="btn-box">
                            <button
                              className="btn btn-primary"
                              onClick={handleSendMessageBtnClick}
                              disabled={!message.length}
                            >{intl.formatMessage(messages['messenger.button.send'])}
                            </button>
                            <button
                              className="btn btn-default"
                              onClick={(e) => handleCancelReply(e)}
                            >{intl.formatMessage(messages['messenger.button.close'])}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )
                }
        {
                    selectedInboxMessages.length > 0 && !messagesLoading && !isReplying && (
                    <div className="chat-reply">
                      <button
                        className="btn btn-default"
                        onClick={(e) => setReplying(true)}
                      >{intl.formatMessage(messages['messenger.button.reply'])}
                      </button>
                    </div>
                    )
                }
        {selectedInboxMessages && !messagesLoading && selectedInboxMessages.map(
          (message, index) => {
            const setRef = (selectedInboxMessages.length === index + 1);
            const hasProfileImage = message.sender_img.indexOf('default_50') === -1;
            const profileName = `${message.sender[0]}${message.sender.split(' ')[1] ? message.sender.split(' ')[1][0] : message.sender[1]}`;
            return (
              <div className="chat-row" key={index} ref={setRef ? lastMessageRef : null}>
                {
                                    hasProfileImage
                                      ? (<img src={message.sender_img} alt={message.sender} />)
                                      : (<span className="img-placeholder" style={{ background: '#a7f9e0' }}>{profileName}</span>)
                                }
                <div className="chat-detail">
                  <span className="msg-sender">{message.sender}</span>
                  <span className="chat-time">{message.created}</span>
                  <pre>{message.message}</pre>
                </div>
              </div>
            );
          },
        )}
        {
                    messagesLoading && (
                    <Spinner />
                    )
                }
      </div>
    </div>
  );
};

Conversation.propTypes = {
  selectedInboxMessages: PropTypes.arrayOf(
    PropTypes.shape({
      sender: PropTypes.string.isRequired,
      sender_img: PropTypes.string,
      created: PropTypes.string,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
  createMessage: PropTypes.func.isRequired,
  messagesLoading: PropTypes.bool.isRequired,
  updateLastMessage: PropTypes.func.isRequired,
  lastMessageRef: PropTypes.func.isRequired,
  selectedInboxUser: PropTypes.string.isRequired,
  loggedinUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
    hasProfileImage: PropTypes.bool.isRequired,
    profileImage: PropTypes.string,
  }).isRequired,
};

export default Conversation;
