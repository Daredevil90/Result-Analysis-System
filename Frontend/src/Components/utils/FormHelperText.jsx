import React from 'react';
import { Link } from 'react-router-dom';

function FormHelperText({ isRegistered,helperText,routepathText }) {
  return (
    <div>
      {isRegistered ? (
        <p></p>
      ) : (
        <p className='border text-center text-lg'>{helperText}<Link className=" text-blue-500 mx-1" to="/login">{routepathText}</Link></p>
      )}
    </div>
  );
}

export default FormHelperText;
