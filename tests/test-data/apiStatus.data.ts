import { ApiInfo } from '../../src/types/apiStatus';

export const mockApiInfoResponse: ApiInfo = {
  scan_credits: 96,
  usage_limits: {
    scan_credits: 100,
    query_credits: 100,
    monitored_ips: 16,
  },
  plan: 'dev',
  https: false,
  unlocked: true,
  query_credits: 82,
  monitored_ips: 2,
  unlocked_left: 82,
  telnet: false,
};
