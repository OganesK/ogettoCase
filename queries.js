export const GET_CATS_QUERY = `
    query{
        categoryList{
            name
            children{
                name
                uid
                is_anchor
            }
        }
    }
`

export const GET_CHILDREN_CATEGORIES = `
    query childrenCats($id:String){
        categories(filters:{
        parent_category_uid:{
            eq:$id
        }
        }){
        items{
            name
            is_anchor
            uid
            }
        }
        }
`

export const GET_PRODUCTS_QUERY = `
    query getProducts($id:String){
        products(filter:{category_uid:{eq:$id}}){
        items{
            name
            sku
        }
        }
    }
`

export const GET_PRODUCT_QUERY = `
query Product($sku:String){
    products(filter: {
      
      sku: {
        eq: $sku
      }
    }) {
  
      items {
  ... on ConfigurableProduct {
          configurable_options {
            id
            attribute_id
            label
            position
            use_default
            attribute_code
            values {
              value_index
              label
              swatch_data{
                value
              }
            }
            product_id
          }
          variants {
            product {
              id
              name
              sku
              description{
                html
              }
              image{
                url
              }
              attribute_set_id
              ... on PhysicalProductInterface {
                weight
              }
              price_range{
                minimum_price{
                  regular_price{
                    value
                    currency
                  }
                }
              }
            }
            attributes {
              label
              code
              value_index
            }
          }
  }
        
      }
    }
  }
`

export const GET_PAYMENT_METHODS_QUERY = `
query GET_PAYMENT_METHODS($cart_id){
    cart(cart_id: $cart_id) {
        available_payment_methods {
            code
            title
        }
    }
}
`