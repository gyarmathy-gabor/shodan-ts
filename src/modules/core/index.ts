import { SHODAN_CORE_URL } from '../../constants';
import { buildApiStatusMethods } from './apiStatus';
import { buildUtilityMethods } from './utilityMethods';
import { buildDnsMethods } from './dnsMethods';
import { buildAccountMethods } from './accountMethods';
import { buildOrganizationMethods } from './organizationMethods';
import { buildBulkDataMethods } from './bulkDataMethods';
import { buildScanningMethods } from './scanningMethods';

export const buildCoreModule = (apiKey: string) => ({
  ...buildApiStatusMethods(SHODAN_CORE_URL, apiKey),
  ...buildUtilityMethods(SHODAN_CORE_URL, apiKey),
  ...buildDnsMethods(SHODAN_CORE_URL, apiKey),
  ...buildAccountMethods(SHODAN_CORE_URL, apiKey),
  ...buildOrganizationMethods(SHODAN_CORE_URL, apiKey),
  ...buildBulkDataMethods(SHODAN_CORE_URL, apiKey),
  ...buildScanningMethods(SHODAN_CORE_URL, apiKey),
});
