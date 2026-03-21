import { GetQueriesResponse, SearchQueriesResponse, GetTagsResponse } from '../../src';

export const mockGetQueriesResponse: GetQueriesResponse = {
  matches: [
    {
      votes: 1,
      description: 'Danieverton',
      tags: [''],
      timestamp: '2021-01-26T19:41:50.961000',
      title: 'ip camera',
      query: 'ip camera BR',
    },
    {
      votes: 3,
      description:
        'This is Moxa Nport Devices ICS system with Authentication disabled Author: A1C3VENOM',
      tags: ['ics', 'iot', 'moxa'],
      timestamp: '2021-01-24T07:44:08.889000',
      title: 'Moxa Nport Devices with Authentication disabled',
      query: '"Moxa Nport Device" Status: Authentication disabled port:"4800"',
    },
  ],
  total: 6746,
};

export const mockSearchQueriesResponse: SearchQueriesResponse = {
  matches: [
    {
      votes: 2,
      description: '',
      title: 'Webcam',
      timestamp: '2019-07-07T02:54:45.194000',
      tags: [''],
      query:
        'IP Webcam has_screenshot: -port:3269 -port:3288 -port:7000 -port:7001 -port:8000 country:"KR"',
    },
  ],
  total: 309,
};

export const mockGetTagsResponse: GetTagsResponse = {
  matches: [
    { count: 209, value: 'webcam' },
    { count: 172, value: 'cam' },
    { count: 159, value: 'camera' },
  ],
  total: 7580,
};
