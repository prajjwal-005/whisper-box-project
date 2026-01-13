import React from 'react';

const PageLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-950 z-50">
      {/* The 3D Cube Animation */}
      <div className="relative w-12 h-12">
        <div className="absolute w-full h-full border-4 border-cyan-500 rounded-sm animate-spin [animation-duration:3s]"></div>
        <div className="absolute w-full h-full border-4 border-blue-600 rounded-sm animate-spin [animation-duration:2s] opacity-70 rotate-45"></div>
        <div className="absolute inset-0 m-auto w-4 h-4 bg-white rounded-sm animate-pulse"></div>
      </div>
    
      <p className="mt-8 text-gray-400 font-medium tracking-widest text-sm uppercase animate-pulse">
        Loading your secret box...
      </p>
    </div>
  );
};

export default PageLoader;