import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Protecteduser = ({ Component }) => {

   const navigate = useNavigate()
    
 const [userdetail,userDetail] =  useState('')

 


useEffect(() => {


        const User = async () => {

            try {

                const user = await axios.get('/api/auth/userinfo')

                userDetail(user?.data.name)
               
            } catch (error) {
                
                if(error.name){

                    navigate('/login')
                }
                
            
            }



           
        }

        User()

    }, [userdetail])

    return (
        <>
            <Component />
        </>
    )
}

export default Protecteduser