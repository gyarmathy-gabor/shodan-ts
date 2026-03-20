import { SHODAN_CORE_URL } from '../../constants';
import { buildApiStatusMethods } from './apiStatus';
import { buildUtilityMethods } from './utilityMethods';
import { buildDnsMethods } from './dnsMethods';
import { buildAccountMethods } from './accountMethods';
import { buildOrganizationMethods } from './organizationMethods';
import { buildBulkDataMethods } from './bulkDataMethods';
import { buildScanningMethods } from './scanningMethods';
import { buildSearchMethods } from './searchMethods';
import { buildAlertMethods } from './alertMethods';
import { buildDirectoryMethods } from './directoryMethods';
import { ShodanClientOptions } from '../../types/options';

export const buildCoreModule = (apiKey: string, options: Required<ShodanClientOptions>) => ({
  ...buildApiStatusMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildUtilityMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildDnsMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildAccountMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildOrganizationMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildBulkDataMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildScanningMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildSearchMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildAlertMethods(SHODAN_CORE_URL, apiKey, options),
  ...buildDirectoryMethods(SHODAN_CORE_URL, apiKey, options),
});
