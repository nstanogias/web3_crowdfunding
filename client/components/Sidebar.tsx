import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { navlinks } from '../constants';
import Link from 'next/link';
import { useApiContext } from '../context';

interface IconProps {
  styles?: string;
  name?: string;
  imgUrl?: any;
  isActive?: string;
  disabled?: boolean;
  handleClick?: () => void;
}
const Icon: FC<IconProps> = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && 'bg-[#2c2f32]'
    } flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt='fund_logo' className='w-1/2 h-1/2' />
    ) : (
      <img src={imgUrl} alt='fund_logo' className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
);

const Sidebar = () => {
  const { disconnect } = useApiContext();
  const router = useRouter();
  const [isActive, setIsActive] = useState('dashboard');

  return (
    <div className='flex justify-between items-center flex-col sticky top-5 h-[93vh]'>
      <Link href={'/to'}>
        <Icon styles='w-[52px] h-[52px] bg-[#2c2f32]' imgUrl='/assets/logo.svg' />
      </Link>

      <div className='flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12'>
        <div className='flex flex-col items-center justify-center gap-3'>
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (link.name === 'logout') {
                  disconnect();
                } else {
                  setIsActive(link.name);
                  router.push(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon styles='bg-[#1c1c24] shadow-secondary' imgUrl='/assets/sun.svg' />
      </div>
    </div>
  );
};

export default Sidebar;
