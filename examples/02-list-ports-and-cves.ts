import { createShodanClient, ShodanApiError } from 'shodan-ts';

const apiKey = process.env.SHODAN_API_KEY;

if (!apiKey) {
  console.error('Error: Please set the SHODAN_API_KEY environment variable.');
  process.exit(1);
}

const client = createShodanClient(apiKey);

async function listPortsAndCves(targetIp: string) {
  try {
    console.log(`Searching for ${targetIp} on Shodan...`);
    const hostInfo = await client.getHostInformation(targetIp);

    const vulns = hostInfo?.vulns || [];
    const ports = hostInfo?.ports || [];

    if (vulns.length === 0) {
      console.log(`No CVEs found for ${targetIp}`);
    } else {
      console.log(`Total CVEs found:`);
      console.table(vulns);
    }
    if (ports.length === 0) {
      console.log(`No ports found for ${targetIp}`);
    } else {
      console.log(`Total ports found:`);
      console.table(ports);
    }
  } catch (error) {
    if (error instanceof ShodanApiError) {
      console.error(`Shodan API Error (${error.status}): ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

listPortsAndCves('1.1.1.1').catch(console.error); //Change this to try it out
