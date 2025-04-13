// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  
  const handleSubmit = async(e) => {

    e.preventDefault();
  
      try{
        
        
        const res = await axios.post('/api/auth/login',{email,password})
    

        if(res.data){
          
            navigate('/home')

        }

        }catch(error){
      
            toast.error(error.response.data)
    
    
          }



  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-6 md:p-8 w-full max-w-4xl">
        <div className="md:w-1/2 flex flex-col justify-center p-4 md:p-8">
          <h1 className="text-blue-600 text-4xl font-bold mb-4">Facebook</h1>
          <p className="text-gray-700 text-lg">
            Connect with friends and the world around you on Facebook.
          </p>
        </div>
        <div className="md:w-1/2 bg-white p-6 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Log In
              </button>
              <a
                href="/register"
                className="text-blue-500 hover:underline text-sm"
              >
                Create new account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
