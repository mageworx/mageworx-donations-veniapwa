 export function customAmountValidation (amountFrom, amountFromFormatted) {
    return function validateWithAmountValues (value) {
        const lessThanMinimal = {
            id: 'mageworx.validation.lessThanMinimal',
            defaultMessage: `Minimal amount is ${amountFromFormatted}.`,
            value: amountFromFormatted
        };
        const notAmount = {
            id: 'mageworx.validation.notAmount',
            defaultMessage: `It's not amount.`
        };

        if (!isNaN(value) && value<amountFrom) {
            return lessThanMinimal;
        }
        if (isNaN(value)) {
            return notAmount;
        }
        return undefined;
    }
}

export function isEmpty (value) {
    const empty = {
        id: 'mageworx.validation.required',
        defaultMessage: `Required field.`
    };
    if (value === "") return empty;
    return undefined;
}
