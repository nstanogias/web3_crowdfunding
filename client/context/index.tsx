import { createContext, FC, ReactNode, useContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite, useDisconnect } from '@thirdweb-dev/react';
import { BaseContract, ethers } from 'ethers';
import { SmartContract } from '@thirdweb-dev/sdk';
import { ICampaign } from '../types';

export type apiContextType = {
  address: string | undefined;
  contract: SmartContract<BaseContract> | undefined;
  connect: () => void;
  disconnect: () => void;
  createCampaign: (form: any) => Promise<void>;
  getCampaigns: () => Promise<ICampaign[]>;
  getUserCampaigns: () => Promise<ICampaign[]>;
  donate: (pId: any, amount: any) => Promise<any>;
  getDonations: (pId: any) => Promise<
    {
      donator: any;
      donation: string;
    }[]
  >;
};

const apiContextDefaultValues: apiContextType = {
  address: '',
  contract: undefined,
  connect: () => {},
  disconnect: () => {},
  createCampaign: (form: any) => Promise.resolve(),
  getCampaigns: () => Promise.resolve([]),
  getUserCampaigns: () => Promise.resolve([]),
  donate: (pId: any, amount: any) => Promise.resolve(),
  getDonations: (pId: any) => Promise.resolve([]),
};

const ApiContext = createContext<apiContextType>(apiContextDefaultValues);

type Props = {
  children: ReactNode;
};

export const ApiProvider: FC<Props> = ({ children }) => {
  const { contract } = useContract('0x9060b410fFef418c05703F6e50f861AE2F5d9a31');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image,
      ]);

      console.log('contract call success', data);
    } catch (error) {
      console.log('contract call failure', error);
    }
  };

  const getCampaigns = async (): Promise<ICampaign[]> => {
    const campaigns = await contract?.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async (): Promise<ICampaign[]> => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract?.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount) });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract?.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations: { donator: any; donation: string }[] = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <ApiContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => useContext(ApiContext);
