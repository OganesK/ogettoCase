export const CREATE_EMPTY_CART_MUTATION = `
    mutation {
        createEmptyCart 
    }
`

export const SET_SHIPPING_ADRESS_TO_CART_MUTATION = `
mutation SHIPPING_ADRESS(
    $cart_id:String, $fName:String, $lName:String, $street:Array<String>, $company:String, $city:String, $region:String, $region_id:Int, $postcode:String,
    $country_code:String, $phone:String,
    ){
    setShippingAddressesOnCart(
        input: {
            cart_id: $cart_id
            shipping_addresses: [
                {
                    address: {
                        firstname: $fName
                        lastname: $lName
                        company: $company
                        street: $street
                        city: $city
                        region: $region
                        region_id: $region_id
                        postcode: $postcode
                        country_code: $country_code
                        telephone: $phone
                        save_in_address_book: false
                    }
                }
            ]
        }
    ) {
        cart {
            shipping_addresses {
                firstname
                lastname
                company
                street
                city
                region {
                    code
                    label
                }
                postcode
                telephone
                country {
                    code
                    label
                }
                available_shipping_methods {
                    carrier_code
                    carrier_title
                    method_code

                    method_title
                }
            }
        }
    }
}
`

export const SET_BILLING_ADRESS_TO_CART_MUTATION = `
mutation SET_BILLING_ADRESS(
    $cart_id:String, $fName:String, $lName:String, $street:Array<String>, $company:String, $city:String, $region:String, $region_id:Int, $postcode:String,
    $country_code:String, $phone:String,
    ){
    setBillingAddressOnCart(
        input: {
            cart_id: $cart_id
            billing_address: {
                address: {
                    firstname: $fName
                    lastname: $lName
                    company: $company
                    street: $street
                    city: $city
                    region: $region
                    region_id: $region_id
                    postcode: $postcode
                    country_code: $country_code
                    telephone: $phone
                    save_in_address_book: false
                }
            }
        }
    ) {
        cart {
            billing_address {
                firstname
                lastname
                company
                street
                city
                region {
                    code
                    label
                }
                postcode
                telephone
                country {
                    code
                    label
                }
            }
        }
    }
}
`

export const SET_SHIPPING_METHOD_ON_CART_MUTATION = `
mutation SET_SHIPPING_METHOD($cart_id:String, $shipping_methods){
    setShippingMethodsOnCart(
        input: {
            cart_id: $cart_id
            shipping_methods: $shipping_methods
        }
    ) {
        cart {
            shipping_addresses {
                selected_shipping_method {
                    carrier_code
                    method_code
                    carrier_title
                    method_title
                }
            }
        }
    }

}
`

export const SET_GUEST_EMAIL_ON_CART_MUTATION = `
mutation SET_GUEST_EMAIL_ON_CART($cart_id:String, $emai:String){
    setGuestEmailOnCart(input: {
      cart_id: $cart_id
      email: $email
    }) {
      cart {
        email
      }
    }
  }
`

export const SET_PAYMENT_METHOD_ON_CART_MUTATION = `
mutation SET_PAYMENT_METHOD_ON_CART($cart_id:String, $payment_method:){
    setPaymentMethodOnCart(
        input: {
            cart_id: $cart_id
            payment_method: $payment_method
        }
    ) {
        cart {
            selected_payment_method {
                code
            }
        }
    }
}
`

export const PLACE_ORDER_MUTATION = `
mutation PLACE_ORDER($cart_id:String){
    placeOrder(input: { cart_id: $cart_id }) {
        order {
            order_number
        }
    }
}
`