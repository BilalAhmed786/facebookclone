import React from 'react'

const togglewall = ({settogglerightsb,togglerightsb}) => {
  return (
    <div className='fixed lg:hidden top-28 right-0 text-sm rotate-90 bg-blue-700 text-white px-2 py-1'>
        <button
        onClick={()=>settogglerightsb((prev)=>!prev)}
        >
           {!togglerightsb? 'show user':'show wall'}
        </button>

    </div>
  )
}

export default togglewall