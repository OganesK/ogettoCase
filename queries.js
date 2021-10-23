
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
        }
        }
    }
`