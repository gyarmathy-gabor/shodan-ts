import { Organization, OrganizationActionResponse } from '../../src/types/organization';

export const mockGetOrganizationResponse: Organization = {
  name: 'Shodan Organization',
  created: '2020-09-30T15:41:48.073000',
  admins: [
    {
      username: 'admin',
      email: 'admin@shodan.io',
    },
  ],
  members: [
    {
      username: 'member',
      email: 'member@shodan.io',
    },
  ],
  upgrade_type: 'stream-100',
  domains: ['shodan.io'],
  logo: false,
  id: 'p3cEAmoDapAPeP7w',
};

export const mockOrganizationActionResponse: OrganizationActionResponse = {
  success: true,
};
