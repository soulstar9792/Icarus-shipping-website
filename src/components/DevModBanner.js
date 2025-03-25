import React from 'react';

const DevModeBanner = () => {
    if (process.env.REACT_APP_IS_DEVELOPMENT === '1') {
        return (
            <div className="fixed bottom-0 left-0 right-0 text-yellow-300 font-bold p-4 text-left bg-opacity-30 z-50">
                Development Mode
            </div>
        );
    }
    return null;
};

export default DevModeBanner;