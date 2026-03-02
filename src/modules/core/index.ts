import { SHODAN_CORE_URL } from '../../constants';
import { buildApiStatusMethods } from './apiStatus';
import { buildUtilityMethods } from './utilityMethods';
import { buildDnsMethods } from './dnsMethods';

export const buildCoreModule = (apiKey: string) => ({
  ...buildApiStatusMethods(SHODAN_CORE_URL, apiKey),
  ...buildUtilityMethods(SHODAN_CORE_URL, apiKey),
  ...buildDnsMethods(SHODAN_CORE_URL, apiKey),
});
