// LoadingSpinner.jsx
import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
    <Oval
      height={80}
      width={80}
      color="#5521B5"
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="#FACA15"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  </div>
);

export default LoadingSpinner;
