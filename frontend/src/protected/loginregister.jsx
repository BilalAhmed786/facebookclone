import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FullScreenLoader from '../components/Preloader/Preloader'
import { backendurl } from '../baseurls/baseurls'
const loginregister = ({ Component }) => {

   const navigate = useNavigate()
    
 const [userdetail,userDetail] =  useState('')
 const [loading,setLoading] = useState(true)
 
if(userdetail){

    navigate('/home')
}


useEffect(() => {


        const User = async () => {

            try {

                const user = await axios.get(`${backendurl}/api/auth/userinfo`,{withCredentials:true})

                userDetail(user?.data.name)
               
            } catch (error) {
                
                console.log(error)
            
            }finally{

                    setLoading(false)
            }



           
        }

        User()

    }, [userdetail])

    if(loading) return <FullScreenLoader/>

    return (
        <>
            <Component />
        </>
    )
}

export default loginregister