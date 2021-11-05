import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { useCartContext } from "@magento/peregrine/lib/context/cart";
import { customAmountValidation } from "../validation/validation";
import {
    APPLY_DONATION_MUTATION,
    REMOVE_DONATION_MUTATION,
    GET_APPLIED_DONATION,
    GET_DONATIONS_INFORMATION
} from "./queries/donation.gql";
import getFormattedPrice from "../getFormattedPrice/getFormattedPrice";
import roundUpOption from "./roundUpOption";

const actions = {
    APPLY: 'apply',
    REMOVE: 'remove'
};

const useDonations = (props) => {
    const {
        setIsCartUpdating
    } = props;

    const [mostRecentAction, setMostRecentAction] = useState(null);

    const { locale } = useIntl();
    const [{ cartId }] = useCartContext();

    const {
        error: donationInfoError,
        loading: getDonationInfoLoading,
        data: donationInfo
    } = useQuery(GET_DONATIONS_INFORMATION, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { cartId },
        skip: !cartId,
    });

    const {
        error: appliedDonateInfoError,
        loading: getAppliedDonationInfoLoading,
        data: appliedDonateInfo
    } = useQuery(GET_APPLIED_DONATION, {
        fetchPolicy: 'cache-and-network',
        variables: { cartId },
        skip: !cartId,
    });

    const [applyDonationQuery, applyDonationResult] = useMutation(APPLY_DONATION_MUTATION);
    const [removeDonationQuery, removeDonationResult] = useMutation(REMOVE_DONATION_MUTATION);

    useEffect(() => {
        if(getDonationInfoLoading) setIsCartUpdating(getDonationInfoLoading);
    }, [
        setIsCartUpdating,
        getDonationInfoLoading,
    ]);

    const applyDonation = useCallback(async (values) => {
        setMostRecentAction(actions.APPLY);

        const {
            donationsType,
            donationsCustom,
            donationsSelect,
            confirmTaxpayer,
            ukAddress,
        } = values;

        let amount = (donationsSelect === "custom")
            ? donationsCustom
            : donationsSelect
        const round_up = (amount === "rounded");
        if (round_up) amount = 0;

        try {
            await applyDonationQuery({
                variables: {
                    cartId,
                    charityId: donationsType,
                    amount,
                    round_up,
                    ukConfirm: confirmTaxpayer ? confirmTaxpayer : false,
                    giftAidAddress: ukAddress ? ukAddress : ""
                }
            });
        } catch {
            return;
        }
    }, [cartId, applyDonationQuery]);

    const removeDonation = useCallback(async (values) => {
        setMostRecentAction(actions.REMOVE);

        try {
            await removeDonationQuery({
                variables: {
                    cartId,
                    charityId: appliedDonateInfo.cart.added_mw_donation.charity_id,
                }
            });
        } catch {
            return;
        }
    }, [cartId, appliedDonateInfo, removeDonationQuery]);

    const {
        called: applyDonationCalled,
        loading: applyDonationLoading,
        error: applyDonationError
    } = applyDonationResult;

    const {
        called: removeDonationCalled,
        loading: removeDonationLoading,
        error: removeDonationError
    } = removeDonationResult;

    const addedDonationInfo = appliedDonateInfo && appliedDonateInfo.cart.added_mw_donation;

    const isEnableRoundUpByDefault = donationInfo && donationInfo.mwDonationsInfo.enable_round_up_by_default;
    const amountPlaceholder = donationInfo && donationInfo.mwDonationsInfo.amount_placeholder;
    const defaultDescription = donationInfo && donationInfo.mwDonationsInfo.default_description;
    const isGiftAidAllowed = donationInfo && donationInfo.mwDonationsInfo.is_gift_aid_allowed;
    const giftAidMessage = donationInfo && donationInfo.mwDonationsInfo.gift_aid_message;
    const isCustomAmountEnabled = donationInfo && donationInfo.mwDonationsInfo.is_donation_custom_amount_allowed;
    const min_value = donationInfo && donationInfo.mwDonationsInfo.min_value;

    // function with lexical scoping
    const customAmountsRangeValidate = min_value
        && customAmountValidation(min_value.value, getFormattedPrice(min_value.value, min_value.currency_code, locale));

    // create array of objects for <select>
    let amountItems = donationInfo && donationInfo.mwDonationsInfo.predefined_values.map((elem) => {
        const amountLabel = getFormattedPrice(elem.value, elem.currency_code, locale);
        return { label: amountLabel, value: elem.value };
    });
    // delete elements that less min_value
    amountItems = amountItems && amountItems.filter((elem) => {
        return elem.value >= min_value.value;
    })

    const roundUpOptionValue = "rounded";
    const cartGrandTotal = donationInfo && donationInfo.cart.prices.grand_total;
    const roundUpDonationOption = donationInfo
        && donationInfo.mwDonationsInfo.allow_round_up
        && roundUpOption(cartGrandTotal.value, cartGrandTotal.currency, locale, roundUpOptionValue);
    // add element for round value
    if (roundUpDonationOption) {
        amountItems.push(roundUpDonationOption);
    }

    // add element for custom amount
    if (isCustomAmountEnabled) {
        amountItems.push({label: "Custom amount", value: "custom"});
    }

    // create array of objects for <select>
    const charitiesItems = donationInfo && donationInfo.mwDonationsInfo.charities.map((elem) => {
        return { label: elem.name, value: elem.id };
    });
    const initialCharityItem = donationInfo && donationInfo.mwDonationsInfo.default_charity_id;

    const shouldDisplayDonationError =
        (mostRecentAction === actions.APPLY && applyDonationError) ||
        (mostRecentAction === actions.REMOVE && removeDonationError) ||
        donationInfoError ||
        appliedDonateInfoError

    useEffect(() => {
        if (applyDonationCalled || removeDonationCalled) {
            setIsCartUpdating(applyDonationLoading || removeDonationLoading);
        }
    }, [
        applyDonationCalled,
        applyDonationLoading,
        removeDonationCalled,
        removeDonationLoading,
        setIsCartUpdating
    ]);

    return {
        removeDonation,
        isDonationAdded: !!addedDonationInfo,
        addedDonationInfo,
        isLoadingDonations: getDonationInfoLoading || getAppliedDonationInfoLoading,
        isApplyingDonations: applyDonationLoading,
        isRemovingDonations: removeDonationLoading,
        isGiftAidAllowed,
        isEnableRoundUpByDefault,
        roundUpOptionValue,
        amountItems,
        charitiesItems,
        initialCharityItem,
        defaultDescription,
        amountPlaceholder,
        giftAidMessage,
        customAmountsRangeValidate,
        applyDonation,
        shouldDisplayDonationError
    };
};

export default useDonations;
