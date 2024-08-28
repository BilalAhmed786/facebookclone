
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaMinus } from 'react-icons/fa';
import { io } from 'socket.io-client';
import Picker from 'emoji-picker-react';
import { format } from 'timeago.js';
import { BsEmojiSmileFill, BsPaperclip, BsFillSendFill } from 'react-icons/bs';

const socket = io('http://localhost:4000', { autoConnect: false });

const LiveChat = ({ friend, Chatuser, userlogin, setMinimized, minimized }) => {
    const [message, setMessage] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [messages, setMessages] = useState([]);
    const fileInputRef = useRef(null);
    const chatContainerRef = useRef(null); // Reference for the chat container
    const messagesEndRef = useRef(null); // Reference for the bottom of the chat

    // Emoji handler
    const onEmojiClick = (event, emojiObject) => {
        setMessage((prevInput) => prevInput + event.emoji);
    };

    // File handler to open file dialog
    const handlePinClick = () => {
        fileInputRef.current.click();
    };

    // File upload handler
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    // Remove a file from the list of selected files
    const removeFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // Handle sending messages
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() || selectedFiles.length > 0) {
            const filesData = selectedFiles.map((file) => {
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve({ name: file.name, data: reader.result });
                    reader.onerror = (error) => reject(error);
                });
            });

            Promise.all(filesData).then((files) => {
                socket.emit('chatMessage', {
                    senderId: userlogin,
                    receiverId: friend.userid,
                    content: message,
                    files: files,
                });

                setSelectedFiles([]);
                setMessage('');
            }).catch((error) => {
                console.error('Error reading files:', error);
            });
        }
    };

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            if (userlogin) {
                socket.emit('userid', userlogin);
            }
        });

        const handleIncomingMessage = (msg) => {
            if (Array.isArray(msg)) { // for all messages when page refresh history messages
                setMessages(msg);
            } else { //for current mesasges
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
        };

        socket.on('chatretreive', handleIncomingMessage);

        return () => {
            socket.off('chatretreive', handleIncomingMessage);
            socket.disconnect();
        };
    }, [userlogin, friend]);

    // Scroll to bottom when a new message is received
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    const filteredMessages = messages.length > 0 && messages.filter(
        (msg) => (
            (msg.sender._id === userlogin && msg.receiver._id === friend.userid) ||
            (msg.sender._id === friend.userid && msg.receiver._id === userlogin)
        )
    );

    return (
        <div className={`fixed bottom-0 right-0 w-[360px] border rounded-t-lg bg-white ${minimized ? 'h-12' : 'h-[78%]'}`}>
            <div className="flex justify-between items-center p-2 border-b bg-blue-500 text-white">
                <div className="flex items-center space-x-2">
                    <img
                        src={`http://localhost:4000/uploads/${friend.userprofile}`}
                        alt={friend.username}
                        className="w-8 h-8 rounded-full"
                    />
                    <span>{friend.username}</span>
                </div>
                <div className="cursor-pointer flex space-x-2">
                    <FaMinus onClick={() => setMinimized(!minimized)} />
                    <FaTimes onClick={() => Chatuser('')} />
                </div>
            </div>

            {!minimized && (
                <div className="relative flex flex-col h-[90%]">
                    <div ref={chatContainerRef} className="flex-1 p-2 overflow-y-auto">
                        {filteredMessages && filteredMessages.map((msg, index) => (
                            <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender?._id === userlogin ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}>
                                <div className="flex items-center space-x-2 mb-1">
                                    <img
                                        src={`http://localhost:4000/uploads/${msg.sender?.profilepicture}`}
                                        alt={msg.sender?.username}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="font-semibold">{msg.sender?.username}</span>
                                    <span className="text-gray-500 text-sm ml-2">{format(msg.createdAt)}</span>
                                </div>
                                {msg.content && <p>{msg.content}</p>}
                                {msg.files && msg.files.map((file, fileIndex) => (
                                    <div key={fileIndex}>
                                        {file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') ? (
                                            <img
                                                src={`http://localhost:4000/uploads/${file}`}
                                                alt={file}
                                                className="w-40 h-40 object-cover rounded mt-1"
                                            />
                                        ) : (
                                            <a href={`http://localhost:4000/uploads/${file}`} download={file}>{file}</a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> {/* This div will be scrolled into view */}
                    </div>

                    <form className="flex flex-col p-4 border-t" onSubmit={handleSendMessage}>
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full p-2 pl-14 border rounded-lg"
                                style={{ height: selectedFiles.length > 0 ? '80px' : '40px' }}
                            />
                            <div className="flex flex-wrap mt-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="relative m-1 p-2 border rounded bg-gray-100 flex items-center">
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-10 h-10 object-cover rounded mr-2"
                                            />
                                        ) : (
                                            <span className="mr-2">{file.name}</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 absolute top-0 right-0 m-1"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center mt-2">
                            <BsEmojiSmileFill
                                className='text-xl text-yellow-500 cursor-pointer mr-2'
                                onClick={() => setShowPicker(val => !val)}
                            />
                            <BsPaperclip
                                className='text-xl cursor-pointer'
                                onClick={handlePinClick}
                            />
                            <button type='submit' className='ml-auto'>
                                <BsFillSendFill className='text-xl' />
                            </button>
                        </div>
                    </form>

                    {showPicker && (
                        <div className='absolute top-0 emojiwraper'>
                            <Picker height={320} width={350} onEmojiClick={onEmojiClick} />
                        </div>
                    )}

                    <div>
                        <input
                            type='file'
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveChat;