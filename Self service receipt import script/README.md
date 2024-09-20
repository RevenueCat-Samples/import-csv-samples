# A Node script that parses a CSV file of fetch tokens and imports them into [RevenueCat](https://www.revenuecat.com) using the REST API.
**License: MIT**

If you have at least 100k in monthly revenue, you can [reach out](https://www.revenuecat.com/demo/) to perform an assisted bulk receipt import.

Not sure if this self-service script is right for you? [Get in touch](https://app.revenuecat.com/settings/support)!

## ⚠️ Warning!
This script is automated and performs changes to the data in RevenueCat that may be difficult to reverse. If you're not a developer, have one help you. If you are a developer, test the script on a small subset of the CSV file and check how it looks in RevenueCat before running it on the full file.

## Usage:
  1. **IMPORTANT: Read the guide to learn more about creating CSV files that can be processed by this script: https://github.com/RevenueCat-Samples/import-csv-samples#readme**
  2. Download the `import.js` file.
  3. Fill out the constants at the top of the file with the required information.
  4. Run `npm install csv axios`.
  5. Run `node ./import.js`.

Contact support@revenuecat.com if you have any questions or feedback.

## Learn More
  1. [RevenueCat API Reference](https://docs.revenuecat.com/reference/basic)
  2. [Migrating to RevenueCat Using Bulk Imports](https://github.com/RevenueCat-Samples/import-csv-samples#readme)
