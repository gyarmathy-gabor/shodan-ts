import { createShodanClient, ShodanApiError } from 'shodan-ts';

const apiKey = process.env.SHODAN_API_KEY;

if (!apiKey) {
  console.error('Error: Please set the SHODAN_API_KEY environment variable.');
  process.exit(1);
}

const client = createShodanClient(apiKey);

async function run() {
  try {
    console.log('Searching Shodan for Nginx servers...');

    // Perform a basic search (consumes 1 query credit)
    const result = await client.searchHosts('product:nginx', { minify: true });
    console.log(result);

    console.log(`Total Nginx servers found: ${result.total.toLocaleString()}`);
    console.log('First 5 matches:');

    result.matches.slice(0, 5).forEach((host) => {
      console.log(`- ${host.ip_str}:${host.port} (Org: ${host.org || 'Unknown'})`);
    });
  } catch (error) {
    if (error instanceof ShodanApiError) {
      console.error(`Shodan API Error (${error.status}): ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

run().catch(console.error);
