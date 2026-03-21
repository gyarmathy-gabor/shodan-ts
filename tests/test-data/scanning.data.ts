import {
  ActiveScansResponse,
  InternetScanResponse,
  ListPortsResponse,
  ListProtocolsResponse,
  RequestScanResponse,
  ScanStatusResponse,
} from '../../src';

export const mockListPortsResponse: ListPortsResponse = [7, 11, 13, 15, 21, 22, 23, 80, 443];

export const mockListProtocolsResponse: ListProtocolsResponse = {
  afp: 'AFP server information grabbing module',
  ajp: 'Check whether the Tomcat server running AJP protocol',
  amqp: 'Grab information from an AMQP service',
};

export const mockRequestScanResponse: RequestScanResponse = {
  count: 1,
  id: 'z1ojEJbI0gy4AqSx',
  credits_left: 100000,
};

export const mockInternetScanResponse: InternetScanResponse = {
  id: 'TcjcsMfPcw4o7O84',
};

export const mockActiveScansResponse: ActiveScansResponse = {
  matches: [
    {
      status: 'PROCESSING',
      created: '2021-01-26T08:17:43.794000',
      status_check: '2021-01-26T08:17:43.900000',
      credits_left: 100000,
      api_key: 'toH56DpDulOnvyxLhOSIxaUgZQeg1gFX',
      id: 'Mo8W7itcWumiy9Ay',
      size: 1,
    },
    {
      status: 'DONE',
      created: '2021-01-26T08:08:26.296000',
      status_check: '2021-01-26T08:09:39.636000',
      credits_left: 100000,
      api_key: 'toH56DpDulOnvyxLhOSIxaUgZQeg1gFX',
      id: '04GjMnUkQx9HsFhA',
      size: 1,
    },
  ],
  total: 19,
};

export const mockScanStatusResponse: ScanStatusResponse = {
  count: 1,
  status: 'DONE',
  id: 'Mo8W7itcWumiy9Ay',
  created: '2021-01-26T08:17:43.794000',
};
