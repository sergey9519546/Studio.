import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { app } from './firebase';

// Initialize Firebase Data Connect
export const dataConnect = getDataConnect(connectorConfig);
