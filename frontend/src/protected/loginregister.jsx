import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const loginregister = ({ Component }) => {

   const navigate = useNavigate()
    
 const [userdetail,userDetail] =  useState('')

 
if(userdetail){

    navigate('/home')
}


useEffect(() => {


        const User = async () => {

            try {

                const user = await axios.get('/api/auth/userinfo')

                userDetail(user?.data.name)
               
            } catch (error) {
                
                console.log(error)
            
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

export default loginregister