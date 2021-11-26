import { useCartContext } from "@magento/peregrine/lib/context/cart";
import { useQuery } from "@apollo/client";
import { GET_APPLIED_DONATION } from '../../useDonations/queries/donation.gql';

const wrapUsePriceSummary = (original) => {
    return function usePriceSummary (props, ...restArgs) {
        const { ...defaultReturnData } = original(
            props,
            ...restArgs
        );

        const [{ cartId }] = useCartContext();

        const { error, loading, data } = useQuery(GET_APPLIED_DONATION, {
            fetchPolicy: 'cache-and-network',
            skip: !cartId,
            variables: {
                cartId
            }
        });

        const donations = data && data.cart.added_mw_donation && data.cart.added_mw_donation.global_amount;

        return {
            ...defaultReturnData,
            hasError: defaultReturnData.hasError || !!error,
            isLoading: defaultReturnData.isLoading || !!loading,
            flatData: {...defaultReturnData.flatData, donations}
        };
    };
};

export default wrapUsePriceSummary;
