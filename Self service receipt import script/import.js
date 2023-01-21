// A Node script that parses a CSV file of fetch tokens and imports them into RevenueCat using the REST API.
// License: MIT

// Usage:
//   (1) IMPORTANT: Read the guide to learn more about creating CSV files that can be processed by this script: https://github.com/RevenueCat-Samples/import-csv-samples#readme
//   (2) Download this file.
//   (3) Fill out the constants below with the required information.
//   (4) Run `npm install csv axios`.
//   (5) Run `node ./import.js`.
// Contact support@revenuecat.com or leave a comment below if you have any questions or feedback.

// Constants - fill these out before running
const csvFilePath = 'receipts.csv'; // The relative path to your CSV file
const apiKey = 'PUBLIC_API_KEY';          // Your public RevenueCat API key. More info: https://docs.revenuecat.com/docs/authentication#obtaining-api-keys
const platform = 'platform';                   // Can be `ios`, `android`, or `stripe`. Contact support@revenuecat.com to import Mac or Amazon tokens.
///////////////////////////////////////////////////////////////////////////////

if (apiKey === 'PUBLIC_API_KEY') throw new Error(
  "ERROR: Enter your public API key on line 14. Find your API key here: https://www.revenuecat.com/docs/authentication"
)

if (platform === 'platform') throw new Error(
  "ERROR: Enter the platform on line 15. It can be `ios`, `android`, or `stripe`."
)

const csvParser = require('csv-parse');
const fs = require('fs');
const axios = require('axios').default;

function sleep(ms) {
  // A convenient function to sleep for a certain amount of time.
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(csvParser.parse({
      skipEmptyLines: true,
      trim: true,
      columns: true,
    }));

  let lineNumber = 0;
  for await (const record of parser) {

    lineNumber++;

    let data = {
      'app_user_id': record.app_user_id,
      'fetch_token': record.token,
      'product_id': record.product_id, // Required on Android and iOS only
      'price': record.price, // Required on iOS only
      'currency': record.currency, // Required on iOS only
      'introductory_price': record.introductory_price, // Required on iOS only if not a free trial
      'intro_duration': record.introductory_price_duration // Required on iOS only if not a free trial
    }

    const axiosConfig = {
      method: 'POST',
      url: 'https://api.revenuecat.com/v1/receipts',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${apiKey}`,
        'X-Platform': `${platform}`,
      },
      data: JSON.stringify(data)
    };

    try {
      console.log(`Running request for line ${lineNumber}: ${JSON.stringify(axiosConfig, null, '  ')}`);
      const response = await axios(axiosConfig);
    } catch (error) {
      const status = error.response.status;
      const data = error.response.data;
      console.error(`Error importing line ${lineNumber} with status ${status}: ${JSON.stringify(data)}`);
    }

    await sleep(1000);
  }

  console.log('\nImport complete!');

}

(async () => {
  await main();
})();