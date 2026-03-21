import {
  ActionSuccessResponse,
  GetNotificationProviderResponse,
  GetNotifiersResponse,
  SaveNotifierResponse,
} from '../../src/types/notifiers';

export const mockGetNotifiersResponse: GetNotifiersResponse = {
  total: 2,
  matches: [
    {
      id: 'default',
      provider: 'email',
      description: null,
      args: {
        to: 'testmail1@email.com',
      },
    },
    {
      id: 'BCAp3Yk1NrLTDxgR',
      provider: 'email',
      description: 'test',
      args: {
        to: 'testmail2@email.com',
      },
    },
  ],
};

export const mockGetNotificationProviderResponse: GetNotificationProviderResponse = {
  pagerduty: {
    required: ['routing_key'],
  },
  slack: {
    required: ['webhook_url'],
  },
  telegram: {
    required: ['chat_id', 'token'],
  },
  webhook: {
    required: ['url'],
  },
  phone: {
    required: ['to'],
  },
  email: {
    required: ['to'],
  },
  gitter: {
    required: ['room_id', 'token'],
  },
};

export const mockSaveNotifierResponse: SaveNotifierResponse = {
  id: 'BCAp3Yk1NrLTDxgR',
  success: true,
};

export const mockActionSuccessResponse: ActionSuccessResponse = {
  success: true,
};
