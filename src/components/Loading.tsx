import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-12 w-12">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <div className="relative inline-flex rounded-full h-12 w-12 bg-blue-500" />
        </div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
