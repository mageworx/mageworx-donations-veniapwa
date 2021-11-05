const { Targetables } = require('@magento/pwa-buildpack');

function localIntercept(targets) {
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
}

module.exports = localIntercept;
