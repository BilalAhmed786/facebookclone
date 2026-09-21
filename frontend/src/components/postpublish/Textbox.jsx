import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendurl } from '../../baseurls/baseurls';
import { FaTimes, FaCheck } from 'react-icons/fa';

const ColorPicker = ({ setBgColor, selectedColor }) => {
    // Array of gradient/solid color options mapping class to dynamic preview styles
    const colors = [
        { name: 'Default', value: '', class: 'bg-gray-100 border-2 border-gray-300' },
        { name: 'Red', value: 'bg-gradient-to-tr from-red-600 to-rose-400', class: 'bg-gradient-to-tr from-red-600 to-rose-400' },
        { name: 'Blue', value: 'bg-gradient-to-tr from-blue-600 to-indigo-500', class: 'bg-gradient-to-tr from-blue-600 to-indigo-500' },
        { name: 'Green', value: 'bg-gradient-to-tr from-emerald-600 to-teal-400', class: 'bg-gradient-to-tr from-emerald-600 to-teal-400' },
        { name: 'Yellow', value: 'bg-gradient-to-tr from-amber-500 to-yellow-400', class: 'bg-gradient-to-tr from-amber-500 to-yellow-400' },
        { name: 'Purple', value: 'bg-gradient-to-tr from-purple-600 to-pink-500', class: 'bg-gradient-to-tr from-purple-600 to-pink-500' },
        { name: 'Dark', value: 'bg-gradient-to-tr from-gray-900 to-gray-700', class: 'bg-gradient-to-tr from-gray-900 to-gray-700' },
    ];

    return (
        <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {colors.map((color, index) => {
                const isSelected = selectedColor === color.value;

                return (
                    <button
                        type="button"
                        key={index}
                        onClick={() => setBgColor(color.value)}
                        className={`relative w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-sm ${color.class} ${
                            isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : ''
                        }`}
                        title={color.name}
                    >
                        {isSelected && (
                            <FaCheck className={`text-xs ${color.value === '' ? 'text-gray-700' : 'text-white'}`} />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

const PostBox = ({ setIsVisible, isVisible, socket }) => {
    const [bgcolor, setBgColor] = useState('');
    const [text, postMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!text.trim()) {
            toast.error('Post content cannot be empty');
            return;
        }

        try {
            setLoading(true);
            const post = await axios.post(
                `${backendurl}/api/posts`,
                { bgcolor, text },
                { withCredentials: true }
            );

            toast.success(post.data.msg);

            // Emit real-time post event to friends
            socket?.emit('postdata', post.data.postdata);

            postMessage('');
            setBgColor('');
            setIsVisible(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.response?.data || 'Failed to publish post');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        postMessage('');
        setBgColor('');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        /* Fixed Modal Backdrop Overlay */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="relative flex items-center justify-center p-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-800">Create Post</h3>
                    <button
                        onClick={handleClose}
                        className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes className="text-sm" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1">
                    {/* Dynamic Background Preview Area */}
                    <div
                        className={`relative rounded-2xl transition-all duration-300 overflow-hidden flex items-center justify-center min-h-[220px] p-4 ${
                            bgcolor ? `${bgcolor} shadow-inner` : 'bg-gray-50 border border-gray-200/80'
                        }`}
                    >
                        <textarea
                            placeholder="What's on your mind?"
                            className={`w-full h-48 bg-transparent outline-none resize-none font-medium transition-colors duration-200 placeholder-opacity-70 ${
                                bgcolor
                                    ? 'text-white placeholder-white/80 text-xl font-bold text-center flex items-center justify-center'
                                    : 'text-gray-800 placeholder-gray-400 text-base'
                            }`}
                            onChange={(e) => postMessage(e.target.value)}
                            value={text}
                            autoFocus
                        />
                    </div>

                    {/* Color Palette Selector */}
                    <div className="mt-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Background Theme
                        </label>
                        <ColorPicker setBgColor={setBgColor} selectedColor={bgcolor} />
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={handlePost}
                        disabled={loading || !text.trim()}
                        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center ${
                            loading || !text.trim()
                                ? 'bg-blue-300 text-white cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer'
                        }`}
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostBox;