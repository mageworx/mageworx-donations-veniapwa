# MageWorx Donations extension for Magento Venia PWA
This add-on integrates [Donations Suite extension for Magento 2](https://www.mageworx.com/magento-2-donations-suite.html) using [MageWorx Donations GraphQl extension](https://github.com/mageworx/MageWorx_DonationsGraphQl) with [Magento 2 Venia PWA storefront](https://magento.github.io/pwa-studio/venia-pwa-concept/).

## Features
- Donations on the shopping cart page and checkout page
- Supports flexible customization in admin panel
- Micro donations to raise small round-up contributions
- Gift Aid support to benefit from the UK tax relief
- Filtering all predictions by min value
- Localization using react-intl

## Upload the extension
1. Run `yarn add @mageworx/donations-veniapwa` or `npm i @mageworx/giftcards-veniapwa` in the root of your project
2. Open `local-intercept.js` in the root of your project and put this code into `function localIntercept`. Pay attention, `function localIntercept` must have `targets` as parameter (you can see example of `local-intercept.js` in `@mageworx/donations-veniapwa/documentation`).
```
/* MageWorx donations-veniapwa start */
const donationsTargetables = Targetables.using(targets);

const PriceAdjustmentsCart_donations = donationsTargetables.reactComponent(
    '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.js'
);
const DonationsSectionCart = PriceAdjustmentsCart_donations.addImport("{DonationsSection} from '../../../../../../../@mageworx/donations-veniapwa/src/UI/templates/Donations'");
PriceAdjustmentsCart_donations.insertAfterJSX(
    '<Section>',
    `<${DonationsSectionCart} setIsCartUpdating={setIsCartUpdating} />`
);

const PriceSummary_donations = donationsTargetables.reactComponent(
    '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js'
);
const DonationsSummary = PriceSummary_donations.addImport("{DonationsSummary} from '../../../../../../../@mageworx/donations-veniapwa/src/UI/molecules/DonationsSummary'");
PriceSummary_donations.insertAfterJSX(
    '<DiscountSummary>',
    `<${DonationsSummary} classes={{lineItemLabel: classes.lineItemLabel, price: priceClass}} data={flatData.donations} />`
);

const PriceAdjustmentsCheckout_donations = donationsTargetables.reactComponent(
    '@magento/venia-ui/lib/components/CheckoutPage/PriceAdjustments/priceAdjustments.js'
);
const DonationsSectionCheckout = PriceAdjustmentsCheckout_donations.addImport("{DonationsSection} from '@mageworx/donations-veniapwa/src/UI/templates/Donations'");
PriceAdjustmentsCheckout_donations.insertAfterJSX(
    '<Section>',
    `<${DonationsSectionCheckout} setIsCartUpdating={setPageIsUpdating} />`
);
/* MageWorx donations-veniapwa end */
```
3. Check that your `local-intercept` has this code before `module.exports`, if don't have you should add them (you can see example of `local-intercept.js` in `@mageworx/donations-veniapwa/documentation`)
```
const { Targetables } = require('@magento/pwa-buildpack');
```
4. Let's run your project
```
yarn watch
```
