import React, { useState } from 'react';

const PostBox = ({ setIsVisible, isVisible }) => {

    const [bgColor, setBgColor] = useState('');

    const handlePost = () => {

        console.log('Post submitted!');
    };

    const handleClose = () => {

        setIsVisible(false)

    };

    if (!isVisible) return null;

    return (

        <div className="w-full p-4 bg-white rounded-md shadow-md absolute -top-3">
            <button
                onClick={handleClose}
                className="absolute top-2 right-1 text-gray-500 hover:text-gray-700"
            >
                &times;
            </button>
            <div
                className={`p-4 ${bgColor ? bgColor : 'bg-gray-200'} rounded-md`}
            >
                <textarea
                    placeholder="What's on your mind?"
                    className="w-full h-60 bg-transparent outline-none text-lg p-2 rounded-md"
                />
            </div>
            <ColorPicker setBgColor={setBgColor} />
            <button
                onClick={handlePost}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
                Post
            </button>
        </div>
    );
};

const ColorPicker = ({ setBgColor }) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];

    return (
        <div className="flex space-x-2 mt-4">
            {colors.map((color, index) => (
                <div
                    key={index}
                    className={`w-8 h-8 rounded-full cursor-pointer ${color}`}
                    onClick={() => setBgColor(color)}
                />
            ))}
        </div>
    );
};

export default PostBox;
