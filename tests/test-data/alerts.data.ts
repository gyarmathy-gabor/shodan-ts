import { AlertActionResponse, NetworkAlert, ShodanTrigger } from '../../src';

export const mockNetworkAlert: NetworkAlert = {
  name: 'DNS Alert',
  created: '2021-01-27T03:44:22.989575',
  triggers: {},
  has_triggers: false,
  expires: 0,
  expiration: null,
  filters: {
    ip: ['8.8.8.8', '1.1.1.1'],
  },
  id: 'OYPRB8IR9Z35AZPR',
  size: 2,
};

export const mockNetworkAlerts: NetworkAlert[] = [
  mockNetworkAlert,
  {
    name: 'Google DNS Alert',
    created: '2021-01-27T03:42:50.908000',
    triggers: {},
    has_triggers: false,
    expires: 0,
    expiration: null,
    filters: {
      ip: ['8.8.8.8'],
    },
    id: 'RIO8WNQZMI4ZQXW6',
    size: 1,
  },
];

export const mockTriggers: ShodanTrigger[] = [
  {
    name: 'any',
    rule: '*',
    description: 'Match any service that is discovered',
  },
  {
    name: 'malware',
    rule: 'tag:compromised,malware',
    description: 'Compromised or malware-related services',
  },
];

export const mockAlertActionResponse: AlertActionResponse = {
  success: true,
};
