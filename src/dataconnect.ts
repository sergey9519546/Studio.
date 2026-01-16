import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { app as _app } from './firebase';

// Ensure Firebase app is initialized before Data Connect
void _app;

// Initialize Firebase Data Connect
export const dataConnect = getDataConnect(connectorConfig);
