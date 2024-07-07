import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const Header = ({ scrollToDashboard }) => {
  return (
    <div className='w-full h-screen bg-gray-700 flex flex-col justify-center items-center text-white font-bubbler'>
      <div className='header flex flex-col md:flex-row items-center'>
        <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold hover:text-blue-200'>
          Admin Dashboard
        </h1>
        <button
          className='mt-4 md:mt-0 md:ml-4 font-light text-3xl md:text-4xl lg:text-5xl border border-blue-300 p-3 md:p-5 rounded-full hover:text-blue-500 hover:bg-white hover:rotate-90 duration-300'
          onClick={scrollToDashboard}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Header;
