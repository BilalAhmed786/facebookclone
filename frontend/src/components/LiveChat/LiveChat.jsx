import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaMinus } from 'react-icons/fa';
import Picker from 'emoji-picker-react';
import profilephoto from '../../images/profilepic.webp';
import { format } from 'timeago.js';
import axios from 'axios';
import {
  BsEmojiSmileFill,
  BsPaperclip,
  BsFillSendFill,
} from 'react-icons/bs';
import { backendurl } from '../../baseurls/baseurls';

const LiveChat = ({
  friend,
  setChatUser,
  userlogin,
  socket,
  setMinimized,
  minimized,
  handleUpdatenotific,
  handleupdatechatnotification,
  statelivechatnotific,
  tracker = [],
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const liveChatRef = useRef(null);

  const exist = tracker.some(
    (users) =>
      users.loginuser === friend?.userid &&
      users.chatuser === userlogin
  );

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handlePinClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);

    setSelectedFiles((prev) => [...prev, ...files]);

    // Allows selecting the same file again later
    e.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleMiniChat = async (
    chatuserid,
    loginuser,
    isMinimized
  ) => {
    if (isMinimized) {
      socket?.emit('chattracker', {
        loginuser,
        chatuser: chatuserid,
      });

      await handleUpdatenotific(chatuserid);
      await handleupdatechatnotification(chatuserid);

      statelivechatnotific(Date.now());
    } else {
      socket?.emit('chattracker', {
        loginuser,
        chatuser: '12345',
      });
    }

    setMinimized(!isMinimized);
  };

  const handleCloseChat = (loginuser) => {
    socket?.emit('chattracker', {
      loginuser,
      chatuser: '12345',
    });

    setChatUser(false);
  };

  // Receive new chat messages
  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        msg,
      ]);
    };

    socket?.on('chatretreive', handleIncomingMessage);

    return () => {
      socket?.off(
        'chatretreive',
        handleIncomingMessage
      );
    };
  }, [socket]);

  // Fetch existing messages
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const result = await axios.get(
          `${backendurl}/api/livechat/messages`,
          {
            withCredentials: true,
          }
        );

        setMessages(result.data);
      } catch (error) {
        console.error(
          'Error fetching chat messages:',
          error
        );
      }
    };

    fetchChatMessages();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (
      message.trim() ||
      selectedFiles.length > 0
    ) {
      const filesData = selectedFiles.map((file) => {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
          reader.readAsDataURL(file);

          reader.onload = () => {
            resolve({
              name: file.name,
              data: reader.result,
            });
          };

          reader.onerror = (error) => {
            reject(error);
          };
        });
      });

      Promise.all(filesData)
        .then((files) => {
          socket?.emit('chatMessage', {
            senderId: userlogin,
            receiverId: friend?.userid,
            content: message,
            isreviewed:
              exist && friend?.userstatus === 1,
            files,
          });

          setSelectedFiles([]);
          setMessage('');
          setShowPicker(false);
        })
        .catch((error) => {
          console.error(
            'Error reading files:',
            error
          );
        });
    }
  };

  // Scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, selectedFiles]);

  const filteredMessages =
    messages.length > 0
      ? messages.filter(
          (msg) =>
            (msg.sender?._id === userlogin &&
              msg.receiver?._id === friend?.userid) ||
            (msg.sender?._id === friend?.userid &&
              msg.receiver?._id === userlogin)
        )
      : [];

  // Supports Cloudinary URLs as well as normal filenames
  const isImageFile = (file) => {
    if (typeof file !== 'string') {
      return false;
    }

    const lower = file.toLowerCase().split('?')[0];

    return (
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.png') ||
      lower.endsWith('.gif') ||
      lower.endsWith('.webp') ||
      lower.endsWith('.jfif') ||
      lower.endsWith('.avif')
    );
  };

  return (
    <div
      ref={liveChatRef}
      className={`fixed z-50 bottom-0 right-0 sm:right-4 w-full sm:w-[360px] bg-white border-t sm:border border-gray-200 shadow-2xl sm:rounded-t-xl flex flex-col overflow-hidden transition-all duration-300 ${
        minimized
          ? 'h-12'
          : 'h-[85vh] sm:h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:py-2.5 bg-blue-600 text-white select-none">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={
                friend?.userprofile ||
                profilephoto
              }
              alt={friend?.username || 'User'}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-full object-cover border border-white/30"
            />

            {friend?.userstatus === 1 && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-2 sm:h-2 bg-green-400 rounded-full ring-2 ring-blue-600" />
            )}
          </div>

          <span className="font-semibold text-base sm:text-sm truncate">
            {friend?.username}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-white/80">
          <button
            onClick={() =>
              handleMiniChat(
                friend?.userid,
                userlogin,
                minimized
              )
            }
            className="hover:text-white transition-colors p-2 sm:p-1"
            title="Minimize"
          >
            <FaMinus className="text-sm sm:text-xs" />
          </button>

          <button
            onClick={() =>
              handleCloseChat(userlogin)
            }
            className="hover:text-white transition-colors p-2 sm:p-1"
            title="Close"
          >
            <FaTimes className="text-base sm:text-sm" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      {!minimized && (
        <div className="relative flex-1 flex flex-col min-h-0 bg-gray-50">
          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-3.5 sm:p-3 overflow-y-auto space-y-3 scroll-smooth"
          >
            {filteredMessages.map((msg, index) => {
              const isMe =
                msg.sender?._id === userlogin;

              return (
                <div
                  key={msg._id || index}
                  className={`flex items-end space-x-2 ${
                    isMe
                      ? 'flex-row-reverse space-x-reverse'
                      : 'flex-row'
                  }`}
                >
                  {/* Message Sender Profile Picture */}
                  <img
                    src={
                      msg?.sender?.profilepicture?.url ||
                      profilephoto
                    }
                    alt={
                      msg?.sender?.username || 'User'
                    }
                    className="w-7 h-7 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0 mb-1"
                  />

                  <div
                    className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3.5 py-2 sm:px-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {/* Sender + Time */}
                    <div
                      className={`flex items-center justify-between space-x-2 mb-1 ${
                        isMe
                          ? 'text-blue-100'
                          : 'text-gray-400'
                      }`}
                    >
                      <span className="font-semibold truncate max-w-[100px]">
                        {msg?.sender?.username}
                      </span>

                      <span className="text-[10px] flex-shrink-0">
                        {format(msg.createdAt)}
                      </span>
                    </div>

                    {/* Message Content */}
                    {msg.content && (
                      <p className="break-words whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}

                    {/* Files */}
                    {Array.isArray(msg.files) &&
                      msg.files.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {msg.files.map(
                            (file, fileIndex) => {
                          
                              const fileUrl =
                                typeof file ===
                                'string'
                                  ? file
                                  : file?.url;

                              const fileName =
                                typeof file ===
                                'string'
                                  ? file.split('/').pop()
                                  : file?.name ||
                                    'Download file';

                              if (!fileUrl) {
                                return null;
                              }

                              return (
                                <div
                                  key={fileIndex}
                                >
                                  {isImageFile(
                                    fileUrl
                                  ) ? (
                                    <div className="space-y-1">
                                      <img
                                        src={fileUrl}
                                        alt={fileName}
                                        className="w-full max-h-48 object-cover rounded-lg border border-black/10"
                                      />

                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className={`block text-[10px] underline ${
                                          isMe
                                            ? 'text-blue-100'
                                            : 'text-blue-600'
                                        }`}
                                      >
                                        Download Image
                                      </a>
                                    </div>
                                  ) : (
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                      className={`block text-xs underline truncate ${
                                        isMe
                                          ? 'text-blue-100'
                                          : 'text-blue-600'
                                      }`}
                                    >
                                      📎 {fileName}
                                    </a>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                  </div>
                </div>
              );
            })}

            {/* Empty chat */}
            {filteredMessages.length === 0 && (
              <div className="flex flex-1 items-center justify-center h-full text-sm text-gray-400">
                Start a conversation with{' '}
                {friend?.username || 'this user'}
              </div>
            )}
          </div>

          {/* Emoji Picker */}
          {showPicker && (
            <div className="absolute bottom-16 left-0 right-0 sm:left-2 sm:right-auto z-20 shadow-2xl rounded-t-xl sm:rounded-lg overflow-hidden border bg-white max-w-full">
              <Picker
                height={280}
                width="100%"
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="px-3 pt-2 bg-white border-t flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-100 border rounded-lg p-1 flex items-center pr-6 text-xs text-gray-700"
                >
                  {file.type.startsWith(
                    'image/'
                  ) ? (
                    <img
                      src={URL.createObjectURL(
                        file
                      )}
                      alt={file.name}
                      className="w-7 h-7 object-cover rounded mr-1.5"
                    />
                  ) : (
                    <span className="truncate max-w-[100px] mr-1">
                      {file.name}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      removeFile(index)
                    }
                    className="absolute right-1 top-1 text-gray-400 hover:text-red-500 font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Chat Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-2.5 bg-white border-t border-gray-200 flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3.5 py-2 sm:py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
              {/* Emoji */}
              <button
                type="button"
                onClick={() =>
                  setShowPicker((prev) => !prev)
                }
                className="text-yellow-500 hover:opacity-80 transition-opacity p-1 flex-shrink-0"
              >
                <BsEmojiSmileFill className="text-xl sm:text-lg" />
              </button>

              {/* Attachment */}
              <button
                type="button"
                onClick={handlePinClick}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 flex-shrink-0"
              >
                <BsPaperclip className="text-xl sm:text-lg" />
              </button>

              {/* Message Input */}
              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm sm:text-xs text-gray-800 outline-none px-1"
              />

              {/* Send */}
              <button
                type="submit"
                disabled={
                  !message.trim() &&
                  selectedFiles.length === 0
                }
                className="text-blue-600 hover:text-blue-700 disabled:opacity-40 transition-opacity p-1 flex-shrink-0"
              >
                <BsFillSendFill className="text-lg sm:text-base" />
              </button>
            </div>

            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
