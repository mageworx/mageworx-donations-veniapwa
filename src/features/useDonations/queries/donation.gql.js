import gql from "graphql-tag";

export const GET_DONATIONS_INFORMATION = gql`
  query getDonationsInformation($cartId: String!) {
    mwDonationsInfo {
        is_donation_custom_amount_allowed
        min_value {
            value
            currency_code
            label
        }
        default_description
        amount_placeholder
        default_charity_id
        predefined_values {
            value
            currency_code
            label
        }
        allow_round_up
        enable_round_up_by_default
        is_gift_aid_allowed
        gift_aid_message
        charities {
            id
            name
            description
            sort_order
        }
    }
    cart(cart_id: $cartId) {
      prices {
         grand_total {
           currency
           value
         }
      }
    }
  }
`;

export const GET_APPLIED_DONATION = gql`
    query getAppliedDonationsInformation($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            added_mw_donation {
                charity_id
                charity_name
                global_amount {
                    value
                    currency_code
                    label
                }
                amount {
                    value
                    currency_code
                    label
                }
                round_up
                gift_aid_address
            }
            prices {
               grand_total {
                  currency
                  value
               }
            }
        }
    }
`;

export const APPLY_DONATION_MUTATION = gql`
    mutation applyDonation($cartId: String!, $charityId: Int!, $amount: Float!, $round_up: Boolean!, $ukConfirm: Boolean!, $giftAidAddress: String!) {
      addMwDonationToCart (
        input: {
          cart_id: $cartId
          charity_id: $charityId
          amount: $amount
          round_up: $round_up
          uk_confirm: $ukConfirm
          gift_aid_address: $giftAidAddress
        }
      ) {
        cart {
          added_mw_donation {
                charity_id
                charity_name
                global_amount {
                    value
                    currency_code
                    label
                }
                amount {
                    value
                    currency_code
                    label
                }
                round_up
                gift_aid_address
          }
          prices {
            grand_total {
              currency
              value
            }
          }
        }
      }
    }
`;

export const REMOVE_DONATION_MUTATION = gql`
    mutation removeDonation($cartId: String!, $charityId: Int!) {
      addMwDonationToCart (
        input: {
          cart_id: $cartId
          charity_id: $charityId
          amount: 0
          round_up: false
        }
      ) {
        cart {
          added_mw_donation {
                charity_id
                charity_name
                global_amount {
                    value
                    currency_code
                    label
                }
                amount  {
                    value
                    currency_code
                    label
                }
                round_up
                gift_aid_address
          }
          prices {
            grand_total {
              currency
              value
            }
          }
        }
      }
    }
`;
