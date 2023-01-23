import React, { FC } from 'react';

import FundCard from './FundCard';
import { useRouter } from 'next/router';
import { ICampaign } from '../types';

interface IProps {
  title: string;
  isLoading: boolean;
  campaigns: ICampaign[];
}

const DisplayCampaigns: FC<IProps> = ({ title, isLoading, campaigns }) => {
  const router = useRouter();

  const handleNavigate = (campaign) => {
    router.push({ pathname: `/campaign-details/${campaign.title}`, query: campaign });
  };

  return (
    <div>
      <h1 className='font-epilogue font-semibold text-[18px] text-white text-left'>
        {title} ({campaigns.length})
      </h1>

      <div className='flex flex-wrap mt-[20px] gap-[26px]'>
        {isLoading && <img src='/assets/loader.svg' alt='loader' className='w-[100px] h-[100px] object-contain' />}

        {!isLoading && campaigns.length === 0 && (
          <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>
            You have not created any campigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard key={campaign.pId} {...campaign} handleClick={() => handleNavigate(campaign)} />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
