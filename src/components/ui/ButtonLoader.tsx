import React from 'react';

const ButtonLoader = () => {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce"></div>
    </div>
  );
};

export default ButtonLoader;