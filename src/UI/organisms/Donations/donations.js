import React from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { Form, useFormState } from 'informed';
import { useStyle } from "@magento/venia-ui/lib/classify";
import Select from "@magento/venia-ui/lib/components/Select";
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import Field from "@magento/venia-ui/lib/components/Field";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import Button from "@magento/venia-ui/lib/components/Button";
import Checkbox from "@magento/venia-ui/lib/components/Checkbox";
import { isRequired } from "@magento/venia-ui/lib/util/formValidators";
import useDonations from "../../../features/useDonations/useDonations";
import getFormattedPrice from "../../../features/getFormattedPrice/getFormattedPrice";
import defaultClasses from './donations.module.css';


const Donations = props => {
    const {
        removeDonation,
        isDonationAdded,
        addedDonationInfo,
        isLoadingDonations,
        isApplyingDonations,
        isRemovingDonations,
        isGiftAidAllowed,
        isEnableRoundUpByDefault,
        roundUpOptionValue,
        amountItems,
        charitiesItems,
        defaultDescription,
        amountPlaceholder,
        giftAidMessage,
        initialCharityItem,
        customAmountsRangeValidate,
        shouldDisplayDonationError
    } = props.talonProps;

    const { locale, formatMessage } = useIntl();
    const formState = useFormState();
    const classes = useStyle(defaultClasses, props.classes);

    const isCustomAmountEnabled = formState.values.donationsSelect === "custom";
    const isConfirmUKEnabled = formState.values.giftAid;
    const isUKAddressEnabled = formState.values.confirmTaxpayer;

    if (isLoadingDonations) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'mageworx.donations.loading'}
                    defaultMessage={'Loading Donations...'}
                />
            </LoadingIndicator>
        );
    }

    const error = shouldDisplayDonationError
        ?
        <div className={classes.errorContainer}>
            <FormattedMessage
                id={'mageworx.donations.errorContainer'}
                defaultMessage={
                    'Something went wrong. Please refresh and try again.'
                }
            />
        </div>
        : null;

    const donationDescription = defaultDescription ? (
        <div className={classes.descriptionContainer}>
            <FormattedMessage
                id={'mageworx.donations.description'}
                defaultMessage={defaultDescription}
            />
        </div>
    ) : null;

    const charitySelections = (
        <Field label={formatMessage({
                id: 'mageworx.donations.donationFor',
                defaultMessage: 'Donation for'
            })}
        >
            <Select
                field="donationsType"
                initialValue={initialCharityItem}
                items={charitiesItems}
            />
        </Field>
    );

    const amountSelection = amountItems.length > 0 ? (
        <Field label={formatMessage({
                id: 'mageworx.donations.chooseAmount',
                defaultMessage: amountPlaceholder ? amountPlaceholder : 'Choose amount'
            })}
        >
            <Select
                field="donationsSelect"
                initialValue={isEnableRoundUpByDefault ? roundUpOptionValue : amountItems[0].value}
                items={amountItems}
            />
        </Field>
    ) : null;

    const customAmount = isCustomAmountEnabled ? (
        <Field label={formatMessage({
                id: 'mageworx.donations.customAmount',
                defaultMessage: amountPlaceholder ? amountPlaceholder : 'Enter custom amount'
            })}
        >
            <TextInput
                validate={customAmountsRangeValidate}
                validateOnChange={true}
                mask={value => value && value.trim()}
                maskOnBlur={true}
                field="donationsCustom"
            />
        </Field>
    ) : null;

    const giftAidCheckbox = isGiftAidAllowed ? (
        <div className={classes.option}>
            <Checkbox
                field="giftAid"
                initialValue={false}
                label={formatMessage({
                    id: 'mageworx.donations.giftAid',
                    defaultMessage: 'Gift aid my donation?'
                })}
            />
        </div>
    ) : null;

    const confirmUKCheckbox = isConfirmUKEnabled ? (
        <div className={classes.option}>
            <Checkbox
                field="confirmTaxpayer"
                initialValue={false}
                label={formatMessage({
                    id: 'mageworx.donations.confirmUKTaxpayer',
                    defaultMessage: giftAidMessage
                })}
            />
        </div>
    ) : null;

    const UKAddressInput = isUKAddressEnabled ? (
        <Field label={formatMessage({
                id: 'mageworx.donations.ukAddress',
                defaultMessage: 'Your UK address'
            })}
        >
            <TextInput
                validate={isRequired}
                validateOnChange={true}
                field="ukAddress"
            />
        </Field>
    ) : null;

    if (isDonationAdded) {
        const formattedDonationAmount = getFormattedPrice(addedDonationInfo.global_amount.value, addedDonationInfo.global_amount.currency_code, locale)

        const addedDonationMessage = (
            <div className={classes.addedDonation}>
                <FormattedMessage
                    id={'mageworx.donations.lessMinAmount'}
                    defaultMessage={"Donation {minAmount} was added to your order total. ({charityName})"}
                    values={{ minAmount: formattedDonationAmount, charityName: addedDonationInfo.charity_name }}
                />
            </div>
        )

        const giftAidAddress = addedDonationInfo.gift_aid_address ? (
            <div className={classes.textContainer}>
                {formatMessage({
                    id: 'mageworx.donations.youAreUKTaxpayer',
                    defaultMessage: 'Confirmed that you\'re UK taxpayer. '
                })}
                {formatMessage({
                    id: 'mageworx.donations.addedUkAddress',
                    defaultMessage: 'Your UK address: '
                })}
                {addedDonationInfo.gift_aid_address}
            </div>
        ) : null;
        return (
            <>
                { addedDonationMessage }
                { giftAidAddress }
                <Field>
                    <Button
                        onClick={removeDonation}
                        disabled={isRemovingDonations}
                        priority={'normal'}
                        type={'submit'}
                    >
                        <FormattedMessage
                            id={'mageworx.donations.remove'}
                            defaultMessage={'Remove'}
                        />
                    </Button>
                </Field>
            </>
        )
    }

    return (
        <>
            {donationDescription}
            {charitySelections}
            {amountSelection}
            {customAmount}
            {giftAidCheckbox}
            {confirmUKCheckbox}
            {UKAddressInput}
            <Field>
                <Button
                    disabled={isApplyingDonations}
                    priority={'normal'}
                    type={'submit'}
                >
                    <FormattedMessage
                        id={'mageworx.donations.apply'}
                        defaultMessage={'Apply'}
                    />
                </Button>
            </Field>
            {error}
        </>
    );
};

export default props => {
    const talonProps = useDonations({
        setIsCartUpdating: props.setIsCartUpdating
    });
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Form onSubmit={talonProps.applyDonation} className={classes.donationForm}>
            <Donations {...props} talonProps={talonProps} />
        </Form>
    );
};
