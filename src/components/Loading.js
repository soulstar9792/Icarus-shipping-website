// src/components/Loading.js
import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-[600px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4  border-blue-600"></div>
        </div>
    );
};

export default Loading;