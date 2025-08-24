import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FullScreenLoader from '../components/Preloader/Preloader'
const Protecteduser = ({ Component }) => {

const navigate = useNavigate()
    
 const [userdetail,userDetail] =  useState('')
 const [loading,setLoading] = useState(true)

useEffect(() => {


        const User = async () => {

            try {

                const user = await axios.get('/api/auth/userinfo')

                userDetail(user?.data._id)
               
            } catch (error) {
                
                if(error.name){

                    navigate('/')
                }
                
            
            }finally{

                    setLoading(false)
            }



           
        }

        User()

    }, [userdetail])

    if(loading) return <FullScreenLoader/>
    return (
        <>
            <Component/>
        </>
    )
}

export default Protecteduser