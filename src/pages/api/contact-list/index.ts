import { baseUrl } from '@constants/api';

type Monitor = {
  ipOrUrl: string;
  portNumber: string;
  webhookUrl: string;
};

type MonitorResponse = {
  monitors: Monitor;
};

export const getContacts = async (): Promise<MonitorResponse> => {
  try {
    const response = await fetch(`${baseUrl}/monitors`, {
      method: 'GET',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error('Error fetching contacts');
  }
};
