// Register.jsx
import React, { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendurl } from '../baseurls/baseurls';

const Register = () => {

  
  const [name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypepassword, setRetypepassword] = useState('');
  const navigate = useNavigate()
  
  const handleSubmit = async(e) => {
     e.preventDefault();
   
    await axios.post(`${backendurl}/api/auth/register`,{name,email,password,retypepassword},{withCredentials:true})
    .then((res)=>{
      toast.success(res.data)

      navigate('/home')

    })
    .catch((error)=>{
      
      toast.error(error.response.data)
    
      })

     
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create a new account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="fullName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Full name"
              value={name}
              onChange={(e) => setFullName(e.target.value)}
              
            />
          </div>
      
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email"
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
          <div className="mb-6">
            <input
              type="password"
              id="retypepassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="retype Password"
              value={retypepassword}
              onChange={(e) => setRetypepassword(e.target.value)}
              
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign Up
            </button>
          </div>
          <div>

            Already have account ? <a className='text-blue-600' href='/'>Login</a>

          </div>
        </form>
      </div>  
    </div>
  );
};

export default Register;
