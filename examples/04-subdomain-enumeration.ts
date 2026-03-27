import { createShodanClient, ShodanApiError } from 'shodan-ts';

const apiKey = process.env.SHODAN_API_KEY;

if (!apiKey) {
  console.error('Error: Please set the SHODAN_API_KEY environment variable.');
  process.exit(1);
}

const client = createShodanClient(apiKey);

async function enumerateSubdomains(domain: string, amount = 5) {
  try {
    console.log(`\n--- Enumerating Subdomains for: ${domain} ---`);

    // Fetch subdomains
    const domainInfo = await client.dnsInfo(domain);
    const subdomains = domainInfo?.subdomains || [];

    if (subdomains.length === 0) {
      console.log(`No subdomains found for ${domain}.`);
      return;
    }

    console.log(
      `Found ${subdomains.length} total subdomains. Deep scanning up to ${amount === -1 ? 'all' : amount}:`,
    );

    // Determine how many to fetch, then format them as Full Qualified Domain Names
    const limit = amount === -1 ? subdomains.length : amount;

    const targetSubdomains = subdomains.slice(0, limit).map((sub) => `${sub}.${domain}`);

    // Bulk resolve the IPs for the collected subdomains
    const resolvedSubs = await client.dnsResolve(targetSubdomains, { timeout: 40000 }); // Add bigger timeout because of a bulkier request

    // Loop through the resolved subdomains and fetch their open ports
    console.log(`\nFetching open ports from Shodan...`);

    for (const [fqdn, ip] of Object.entries(resolvedSubs)) {
      if (!ip) {
        console.log(`- ${fqdn}: [DNS Resolution Failed]`);
        continue;
      }

      try {
        // Fetch host info (Free / 0 credits)
        const hostInfo = await client.getHostInformation(ip);
        const ports = hostInfo?.ports || [];

        console.log(
          `- ${fqdn} (${ip}): ${ports.length > 0 ? `Ports [${ports.join(', ')}]` : 'No open ports'}`,
        );
      } catch (innerError) {
        if (innerError instanceof ShodanApiError && innerError.status === 404) {
          console.log(`- ${fqdn} (${ip}): [Not found in Shodan database]`);
        } else {
          console.log(`- ${fqdn} (${ip}): [Error fetching data]`);
        }
      }
    }
  } catch (error) {
    if (error instanceof ShodanApiError) {
      console.error(`\nShodan API Error (${error.status}): ${error.message}`);
    } else {
      console.error('\nAn unexpected error occurred:', error);
    }
  }
}

enumerateSubdomains('shodan.io', 5).catch(console.error); //Replace 'shodan.io' with your target domain and adjust the number of subdomains to fetch(-1 for all)
