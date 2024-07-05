import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const Header = ({ scrollToDashboard }) => {
  return (
    <div className='w-[100%] h-screen bg-gray-700 flex justify-center items-center text-white font-bubbler '>
      <div className='header flex flex-row '>
        <h1 className='text-[70px] font-bold hover:text-blue-200'>Admin Dashboard</h1>
        <button
          className='m-2 font-light text-[50px] border border-blue-300 p-5 rounded-full hover:text-blue-500 hover:bg-white hover:rotate-90 duration-300'
          onClick={scrollToDashboard}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Header;
