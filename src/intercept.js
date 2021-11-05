module.exports = targets => {
    const { Targetables } = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);
    targetables.setSpecialFeatures('esModules','cssModules');

    const peregrineTargets = targets.of("@magento/peregrine");
    const talonsTarget = peregrineTargets.talons;

    // cart
    talonsTarget.tap((talonWrapperConfig) => {
        talonWrapperConfig.CartPage.PriceSummary.usePriceSummary.wrapWith(
            "@mageworx/donations-veniapwa/src/features/modify/targets/wrapUsePriceSummary"
        );
    });
};
