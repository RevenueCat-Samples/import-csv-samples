For large datasets that aren't practical to import through the REST API, you can send us a `.csv` file to import manually. This repository contains sample `csv` files that we can import. [Email us](mailto:support@revenuecat.com) with the below information and we'll be in touch.

> NOTE: Bulk imports DO NOT trigger webhooks or integrations. Bulk imports done by RevenueCat will not trigger any webhook or integration events. If this is a requirement, then you'll need to perform an import using the REST API as mentioned in the [RevenueCat Migration Docs](https://docs.revenuecat.com/docs/migrating-existing-subscriptions#using-the-rest-api). 

To do a receipt import we'll need 3 csv files for iOS, Android and Stripe with the following fields:

## iOS

`app_user_id` 

`receipt` (the raw receipt file)

`product_id`

`price`

`introductory_price` (if not a free trial)

`currency`

*If you don't have prices and currency with the transactions we can take a separate file with a mapping of product_id, price, currency as well. If there were any known price changes, those should also be included here.

> Note: The entire iOS receipt file must be used for imports. The latest_receipt_info is not supported as it's only a subset of the entire receipt.

## Android:

`app_user_id`

`product_id`

`token`

Important: We need to know your API quota with Google and approximately how many remaining requests per day you have so we don't exceed your quota.

*Note that Android receipts that expired more than 90 days ago can't be imported, and only the current status can be retrieved from each Android receipt. This means that Android charts for historical data won't be accurate.

## Stripe:

`app_user_id`

`subscription_token` (e.g. `sub_xxxxxx`)
