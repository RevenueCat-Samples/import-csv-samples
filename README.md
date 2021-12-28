# Migrating receipts to RevenueCat via bulk import

For large datasets that aren't practical to import through the REST API, you can send us a `.csv` file to import manually. This repository contains sample `csv` files that we can import. [Email us](mailto:support@revenuecat.com) with the below information and we'll be in touch.

> NOTE: Bulk imports DO NOT trigger webhooks or integrations. Bulk imports done by RevenueCat will not trigger any webhook or integration events. If this is a requirement, then you'll need to perform an import using the REST API as mentioned in the [RevenueCat Migration Docs](https://docs.revenuecat.com/docs/migrating-existing-subscriptions#using-the-rest-api). 

## Receipt Import CSV File Format

To do a receipt import we'll need 3 csv files for iOS, Android and Stripe with the following fields (✅ = required for that platform/store):

| Column Name                   | iOS | Android | Stripe |
|-------------------------------|-----|---------|--------|
| `app_user_id`                 | ✅   | ✅       | ✅      |
| `receipt`/`token`             | ✅   | ✅       | ✅      |
| `product_id`                  | 🚧 [Product price map file](https://github.com/RevenueCat-Samples/import-csv-samples/edit/sharif/add-introductory-price-duration/README.md#product-price-map-ios-only) required if product isn't included.   | ✅       |        |
| `price`                       | 🚧 [Product price map file](https://github.com/RevenueCat-Samples/import-csv-samples/edit/sharif/add-introductory-price-duration/README.md#product-price-map-ios-only) file required if price isn't included.   |         |        |
| `currency`                    | 🚧 [Product price map file](https://github.com/RevenueCat-Samples/import-csv-samples/edit/sharif/add-introductory-price-duration/README.md#product-price-map-ios-only) required if currency isn't included.   |         |        |
| `introductory_price`          | 🚧 Required if not a free trial.   |         |        |
| `introductory_price_duration` | 🚧 Required if not a free trial.   |         |        |

### iOS

> 💡 Check out the [sample file](iOS/ios_receipt_import_sample.csv) for a complete example of a receipt import CSV file for iOS.

`app_user_id` The user identifier to associate with the receipt.

`receipt` The raw receipt file from the device.*

`product_id` The last purchased product ID contained in the receipt. This is for pricing calculations - if you don't have the product ID, you need to provide a [product price map file](https://github.com/RevenueCat-Samples/import-csv-samples/edit/sharif/add-introductory-price-duration/README.md#product-price-map-ios-only).

`price` The price of the product. If you don't have prices for each receipt, you need to provide a [product price map file](https://github.com/RevenueCat-Samples/import-csv-samples/edit/sharif/add-introductory-price-duration/README.md#product-price-map-ios-only).

`introductory_price` The introductory offer price. This column is required if you offer an introductory period that is not a free trial.

`currency` The currency of the price. If you don't have both prices and currencies, you need to provide a [product price map file](https://github.com/RevenueCat-Samples/import-csv-samples/edit/sharif/add-introductory-price-duration/README.md#product-price-map-ios-only).

> 🚧 If you don't have product IDs, prices or currencies with the receipts we can take a [separate file](#product-price-map-ios-only) with a mapping of product_id, price, currency as well. If there were any known price changes, those should also be included here.

***Note: The latest_receipt_info is not supported as it's only a subset of the entire receipt.** The entire iOS receipt file must be used for imports.

#### Product Price Map (iOS Only)

> 💡 Check out the [sample file](iOS/ios_product_price_map_sample.csv) for a complete example of a product price map CSV file for iOS.

##### When should you provide a product price map?

You need to include a product price map CSV with your iOS receipt CSV if one of the following is true:

- You don't have product IDs, introductory offer information, price or currency information for your receipts.
- You changed the price of a product in the past.

##### Product Price Map File Format

A product price map CSV has the following fields:

`product_id` The product ID of the product.

`price` The price of the product.

`currency` The currency of the price.

`introductory_price` The introductory price of the product (required only if you offer an introductory price that is not a free trial.)

`date` The date that the price was effective. The format is `YYYY-MM-DD`.

`duration` The duration of the product The format is [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations). (Enter `lifetime` for non-consumable and consumable products.)

`introductory_price_duration` The duration of the introductory price (required only if you offer an introductory price that is not a free trial.) The format is [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations).

##### Price Changes (iOS Only)

The `date` field is the date that the price was effective on that product. For example, if a product, called `premium_upgrade`, was created on October 19, 2021 and the price was raised from 3.99 USD to 6.99 USD on December 13, 2021, the product price map would have two rows for the product:

```
product_id,price,currency,introductory_price,date,duration,introductory_price_duration
premium_upgrade,3.99,USD,0.00,2021-10-19,P6M,P1M
premium_upgrade,6.99,USD,0.00,2021-12-13,P6M,P1M
...
```

> 💡 At least one row for USD is required. If you don't provide a price for a specific currency, RevenueCat will always default to USD for purchases made in that currency.

### Android

> 💡 Check out the [sample file](Android/android_receipt_import_sample.csv) for a complete example of a receipt import CSV file for Android.

> ⚠️ We need to know your [Google Play API quota](https://developers.google.com/android-publisher/quotas) and approximately how many remaining requests per day you have so we don't exceed your quota.

`app_user_id` The user identifier to associate with the token.

`product_id` The product ID associated with the token.

`token` The purchase token from the device.*

***Note that Android receipts that expired more than 90 days ago can't be imported.** Additionally, only the current status can be retrieved from each Android token. This means that Android charts for historical data won't be accurate.

### Stripe

> 💡 Check out the [sample file](Stripe/stripe_receipt_import_sample.csv) for a complete example of a receipt import CSV file for Stripe.

`app_user_id` The user identifier to associate with the subscription.

`subscription_token` (e.g. `sub_xxxxxx`) The subscription token.*

***Note that Stripe subscription objects contain only the current status of the subscription.** This means that Stripe charts for historical data won't be accurate.

## Receipt imports for apps without user authentication systems

A bulk receipt import requires an app user ID to be provided for every receipt. If you don't have app user IDs because you don't use an authentication system, you have two options to migrate to RevenueCat:

1. Do a [client-side migration](https://docs.revenuecat.com/docs/migrating-existing-subscriptions#client-side-migration) instead of a bulk import.
2. Generate [anonymous app user IDs](https://docs.revenuecat.com/docs/user-ids#anonymous-app-user-ids) for each row in the receipt CSV file. An anonymous user identifier in RevenueCat is in the form `$RCAnonymousID:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, where each `x` is either a digit from 1-9 or a letter from A-F. Any app user ID in this format will be recognized by RevenueCat as an [anonymous user](https://docs.revenuecat.com/docs/user-ids#anonymous-app-user-ids).
