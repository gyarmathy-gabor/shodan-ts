import { createShodanClient, ShodanApiError } from 'shodan-ts';

const apiKey = process.env.SHODAN_API_KEY;

if (!apiKey) {
  console.error('Error: Please set the SHODAN_API_KEY environment variable.');
  process.exit(1);
}

const client = createShodanClient(apiKey);

async function dnsRecon(domain: string) {
  try {
    console.log(`\n--- Starting DNS Recon for: ${domain} ---`);

    // Resolve the domain to its current IP address
    const resolved = await client.dnsResolve(domain);
    console.log(resolved);
    const targetIp = resolved[domain];

    if (!targetIp) {
      console.log(`\nCould not resolve a current IP for ${domain}.`);
      return;
    }
    console.log(`\nResolved ${domain} to IP: ${targetIp}`);
    console.log(`Querying Shodan for exposed services on ${targetIp}...`);

    // Query the resolved IP for open ports and organization information
    const hostInfo = await client.getHostInformation(targetIp);
    const ports = hostInfo?.ports || [];

    if (ports.length === 0) {
      console.log(`No open ports found on Shodan for ${targetIp}.`);
    } else {
      console.log(`Open Ports Found:`);
      console.table(ports);
      console.log(`Organization: ${hostInfo?.org || 'Unknown'}`);
    }
  } catch (error) {
    if (error instanceof ShodanApiError) {
      console.error(`Shodan API Error (${error.status}): ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

dnsRecon('shodan.io').catch(console.error); //Replace 'shodan.io' with your target domain
