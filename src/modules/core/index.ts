import { SHODAN_CORE_URL } from '../../constants';
import { buildApiStatusMethods } from './apiStatus';
import { buildUtilityMethods } from './utilityMethods';
import { buildDnsMethods } from './dnsMethods';
import { buildAccountMethods } from './accountMethods';

export const buildCoreModule = (apiKey: string) => ({
  ...buildApiStatusMethods(SHODAN_CORE_URL, apiKey),
  ...buildUtilityMethods(SHODAN_CORE_URL, apiKey),
  ...buildDnsMethods(SHODAN_CORE_URL, apiKey),
  ...buildAccountMethods(SHODAN_CORE_URL, apiKey),
});
