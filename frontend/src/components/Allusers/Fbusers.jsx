import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Profilehoto from '../../images/profilepic.webp';
import axios from 'axios';
import { backendurl } from '../../baseurls/baseurls';
import { Link } from 'react-router-dom';

const Fbusers = () => {
    const [allusers, setAllusers] = useState([]);

    useEffect(() => {
        const fbuserget = async () => {
            try {
                const result = await axios.get(`${backendurl}/api/users/allusers`,{withCredentials:true});
                if (result && result.data) {
                    setAllusers(result.data);
                } else {
                    console.log('No users found');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fbuserget();
    }, []);

    const settings = {
        dots: true,
        infinite: allusers.length > 3, // Make infinite only if more than 3 users
        speed: 250,
        autoplay: true, // Enable auto-sliding
        slidesToShow: Math.min(allusers.length, 3), // Show based on available users (max 3)
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(allusers.length, 3), // Handle responsive behavior
                    slidesToScroll: 1,
                    infinite: allusers.length > 3, // Infinite scroll only for more than 3 users
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(allusers.length, 2), // Adjust for 768px width
                    slidesToScroll: 1,
                    infinite: allusers.length > 2, // Infinite scroll only for more than 2 users
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: allusers.length > 1, // Infinite scroll for more than 1 user
                    dots: true
                }
            }
        ]
    };

    return (
        <div className="w-full flex-[1] p-4">
            <h2 className="text-2xl font-semibold mb-4">People You May Know</h2>
            {allusers.length > 0 ? (
                <Slider {...settings}>
                    {allusers.map((person, index) => (
                        <div key={index} className="px-2">
                            <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                                <img src={person.profilepicture ? `${backendurl}/uploads/${person.profilepicture}` : Profilehoto} alt={`${person.name}'s profile`} className="w-24 h-24 rounded-full mb-3" />
                                <h3 className="text-lg font-medium">{person.name}</h3>
                                <Link to={`/profile/${person._id}`}>
                                    <button className="mt-3 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600">Add Friend</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default Fbusers;
