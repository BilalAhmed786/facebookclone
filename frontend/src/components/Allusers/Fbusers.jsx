import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Profilehoto from '../../images/profilepic.webp'
import axios from 'axios';
import {Link} from 'react-router-dom'

const Fbusers = () => {

 const [allusers,setAllusers] = useState([])


useEffect(()=>{

const fbuserget =async()=>{

try{

const result  =   await axios.get('/api/users/allusers')

if(!result){


    console.log('user not found')

}

    setAllusers(result.data)


}catch(error){

  console.log(error)
}



 }

  fbuserget()

},[])


  const settings = {
    dots: true,
    infinite: true,
    speed: 250,
    autoplay: true, // Enable auto-sliding
    slidesToShow: 3, // Adjust based on how many cards you want to show at once
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow:1,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        }
    ]
};


  return (
   <div className="w-full flex-[1]  p-4">
    <h2 className="text-2xl font-semibold mb-4">People You May Know</h2>
    <Slider {...settings}>
        {allusers.map((person, index) => (
            <div key={index} className="px-2">
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                    <img src={person.profilepicture ?`http://localhost:4000/uploads/${person.profilepicture}`:Profilehoto} alt={`${person.name}'s profile`} className="w-24 h-24 rounded-full mb-3" />
                    <h3 className="text-lg font-medium">{person.name}</h3>
                    <Link to={`http://localhost:5173/profile/${person._id}`}><button className="mt-3 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                    >Add Friend</button>
                    </Link>
                </div>
            </div>
        ))}
    </Slider>
</div>

  )
}

export default Fbusers 