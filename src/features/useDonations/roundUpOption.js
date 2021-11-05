import getFormattedPrice from "../getFormattedPrice/getFormattedPrice";
import {useIntl} from "react-intl";

const roundUpOption = (value, currency, locale, roundUpOptionValue) => {
    const { formatMessage } = useIntl();

    const roundValue = Math.ceil(value);
    let resultValue = roundValue - value;
    if (resultValue === 0) resultValue = 1;

    const roundUpText = formatMessage({
        id: 'mageworx.donations.roundUpText',
        defaultMessage: '(round up)'
    })
    const label = getFormattedPrice(resultValue, currency, locale) + " " + roundUpText;
    return { label: label, value: roundUpOptionValue };
}

export default roundUpOption;
