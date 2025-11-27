import { MOCK_USER } from './constants';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (email) => {
    await delay(500);
    // Accept any email for demo purposes
    return {
      ...MOCK_USER,
      email
    };
  }
};