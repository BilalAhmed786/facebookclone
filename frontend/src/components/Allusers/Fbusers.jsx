import React, { useEffect, useState, useMemo } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Profilephoto from '../../images/profilepic.webp';
import axios from 'axios';
import { backendurl } from '../../baseurls/baseurls';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Custom Arrow Components for Slick Carousel
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Next slide"
    className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
  >
    <FaChevronRight className="text-xs" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Previous slide"
    className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
  >
    <FaChevronLeft className="text-xs" />
  </button>
);

const Fbusers = () => {
  const [allusers, setAllusers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fbuserget = async () => {
      try {
        const result = await axios.get(`${backendurl}/api/users/allusers`, {
          withCredentials: true,
        });
        if (result && result.data) {
          setAllusers(result.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fbuserget();
  }, []);

  // Memoize settings based on user count to prevent unnecessary slider re-renders
  const settings = useMemo(() => {
    const userCount = allusers.length;
    return {
      dots: false,
      infinite: userCount > 3,
      speed: 300,
      autoplay: userCount > 3,
      autoplaySpeed: 4000,
      slidesToShow: Math.min(userCount, 3),
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(userCount, 3),
            slidesToScroll: 1,
            infinite: userCount > 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(userCount, 2),
            slidesToScroll: 1,
            infinite: userCount > 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: userCount > 1,
          },
        },
      ],
    };
  }, [allusers.length]);

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm my-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
          People You May Know
        </h2>
        {allusers.length > 0 && (
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {allusers.length} suggestions
          </span>
        )}
      </div>

      {/* Content Rendering */}
      {loading ? (
        /* Loading Skeleton State */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center animate-pulse"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-3" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-28 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      ) : allusers.length > 0 ? (
        /* Carousel Slider */
        <div className="relative px-1">
          <Slider {...settings}>
            {allusers.map((person) => (
              <div key={person._id || person.name} className="px-2 py-1">
                <div className="bg-gray-50/60 hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 rounded-xl p-4 flex flex-col items-center group">
                  {/* User Profile Picture */}
                  <div className="relative mb-3">
                    <img
                      src={person?.profilepicture?.url || Profilephoto
                      }
                      alt={`${person.name}'s profile`}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* User Name */}
                  <h3 className="text-sm font-semibold text-gray-800 truncate w-full text-center mb-3">
                    {person.name}
                  </h3>

                  {/* Add Friend Button */}
                  <Link
                    to={`/profile/${person._id}`}
                    className="w-full"
                  >
                    <button className="w-full flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors duration-150">
                      <FaUserPlus className="text-xs" />
                      <span>Add Friend</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-xs font-medium text-gray-400">No suggestions available right now</p>
        </div>
      )}
    </div>
  );
};

export default Fbusers;