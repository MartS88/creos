import React from 'react';
import {ThreeDots} from 'react-loader-spinner';

interface LoaderProps {
  height: string;
  width:string;
  color:string;
}
const Loader:React.FC<LoaderProps> = ({height,width,color}) => {
  return (
    <ThreeDots
      visible={true}
      height={height}
      width={width}
      color={color}
      radius="10"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default Loader;
