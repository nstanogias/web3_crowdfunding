import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import DisplayCampaigns from '../components/DisplayCampaigns';
import { useApiContext } from '../context';
import { ICampaign } from '../types';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);

  const { address, contract, getCampaigns } = useApiContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <DisplayCampaigns title='All Campaigns' isLoading={isLoading} campaigns={campaigns} />
    </div>
  );
};

export default Home;
