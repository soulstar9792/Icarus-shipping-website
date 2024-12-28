// src/components/Loading.js
import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-[600px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-custom-border"></div>
        </div>
    );
};

export default Loading;