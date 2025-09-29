# Migrating receipts to RevenueCat via bulk import

For large datasets that aren't practical to import through the REST API, you can send us a `.csv` file to import manually. This repository contains sample `csv` files that we can import. [Email us](mailto:support@revenuecat.com) with the below information and we'll be in touch.

> 💡 Don't have a lot of data to import? Try the [self-service script](https://github.com/RevenueCat-Samples/import-csv-samples/tree/dcb99c71e9487de6b46fbfa1fb11766fd99322c5/Self%20service%20receipt%20import%20script)!

> NOTE: Bulk imports DO NOT trigger webhooks or integrations. Bulk imports done by RevenueCat will not trigger any webhook or integration events. If this is a requirement, then you'll need to perform an import using the REST API as mentioned in the [RevenueCat Migration Docs](https://docs.revenuecat.com/docs/migrating-existing-subscriptions#using-the-rest-api). 

## Receipt Import CSV File Format

To do a receipt import we'll need 3 csv files for iOS, Android and Stripe with the following fields (✅ = required for that platform/store):

| Column Name                   | iOS | Android | Stripe |
|-------------------------------|-----|---------|--------|
| `app_user_id`                 | ✅   | ✅       | ✅      |
| `receipt`/`token`             | ✅   | ✅       | ✅      |
| `product_id`                  |      | ✅       |         |

### iOS

> 💡 Check out the [sample file](iOS/ios_receipt_import_sample.csv) for a complete example of a receipt import CSV file for iOS.

`app_user_id` The user identifier to associate with the receipt.

`receipt` The raw receipt file from the device, the receipt from S2S notifications.

> 💡 If you have only transaction identifiers, please contact support@revenuecat.com for help importing them into RevenueCat.

### Android

> 💡 Check out the [sample file](Android/android_receipt_import_sample.csv) for a complete example of a receipt import CSV file for Android.

`app_user_id` The user identifier to associate with the token.

`product_id` The product ID associated with the token.

`token` The purchase token from the device.*

***Note that [Android receipts that expired more than 60 days ago can't be imported](https://developer.android.com/google/play/billing/subscriptions#lifecycle).** Additionally, only the current status can be retrieved from each Android token. We are able to import history using Google's financial reports up to July 2023. Please follow [this guide](https://www.revenuecat.com/docs/migrating-to-revenuecat/migrating-existing-subscriptions/google-historical-import) to set this up and notify support@revenuecat.com or your account manager that you would like us to import historical data.

### Stripe

> 💡 Check out the [sample file](Stripe/stripe_receipt_import_sample.csv) for a complete example of a receipt import CSV file for Stripe.

`app_user_id` The user identifier to associate with the subscription.

`subscription_token` (e.g. `sub_xxxxxx`) The subscription token.*

***Note that Stripe subscription objects contain only the current status of the subscription.** This means that Stripe charts for historical data won't be accurate.

## Adding subscriber attributes to receipt import files

You can include metadata with each receipt that you want to be attached to the customer as [subscriber attributes](https://www.revenuecat.com/docs/subscriber-attributes). Include each attribute as a column in the file and let RevenueCat know that they should be imported. For example, if you wanted to set the IDFA and email address along with the receipt, you can create a file that looks like this:

```
app_user_id,product_id,price,currency,introductory_price,receipt,$email,$idfa,tShirtSize
user_wk3E8aoK6a,premium_weekly,4.99,USD,0.99,MIIUJgYJ...,email1@example.com,ABCD-EFGH...,small
user_mBV1R0eQFP,premium_weekly,8.99,CAD,1.99,MIIUKgYJ...,email2@example.com,ABCD-EFGH...,medium
user_OM0duSAUaZ,premium_weekly,4.99,USD,0.99,MIIUNwYJ...,email3@example.com,ABCD-EFGH...,large
user_Z9LhfKTSil,premium_weekly,4.99,GBP,0.99,MIIUBQYJ...,email4@example.com,ABCD-EFGH...,small
user_DySxlIA0tQ,premium_weekly,4.99,USD,0.99,MIIUHAYJ...,email5@example.com,ABCD-EFGH...,medium
```

Note that there are some reserved attributes that you can take advantage of by using the `$`, e.g. email, name, etc. You can read more about these [here](https://www.revenuecat.com/docs/subscriber-attributes#reserved-attributes).

## Receipt imports for apps without user authentication systems

A bulk receipt import requires an app user ID to be provided for every receipt. If you don't have app user IDs because you don't use an authentication system, you have need to do the following to migrate to RevenueCat:

1. Do a [client-side migration](https://docs.revenuecat.com/docs/migrating-existing-subscriptions#client-side-migration) instead of a bulk import. This consists of an app update where the SDK syncs the user's purchases the first time they launch the updated version of your app with the RevenueCat SDK. This allows the SDK to create an anonymous user ID in our system and immediately connect purchases to it.
2. You can **optionally** do a bulk import **alongside** the [client-side migration](https://docs.revenuecat.com/docs/migrating-existing-subscriptions#client-side-migration). RevenueCat will generate an [anonymous app user IDs](https://docs.revenuecat.com/docs/user-ids#anonymous-app-user-ids) for each row in the receipt CSV file. Doing an import with anonymous app user IDs will not automatically unlock the subscription for those customers when they update to the RevenueCat version of your app, so **you still need to do a [client-side migration](https://docs.revenuecat.com/docs/migrating-existing-subscriptions#client-side-migration)**. Your historical data will be more accurate but RevenueCat will immediately begin billing for tracked revenue, so we recommend doing the bulk import only after you have done the client-side migration.
