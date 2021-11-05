import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';

const DonationsSummary = props => {
    const classes = useStyle({}, props.classes);

    if (!props.data) return null;
    const {value, currency_code} = props.data;

    return value > 0 ? (
        <Fragment>
            <span className={classes.lineItemLabel}>
                <FormattedMessage
                    id={'mageworx.donation.summary'}
                    defaultMessage={'Donation applied'}
                />
            </span>
            <span className={classes.price}>
                <Price
                    value={value}
                    currencyCode={currency_code}
                />
            </span>
        </Fragment>
    ) : null;
};

export default DonationsSummary;
