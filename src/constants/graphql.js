// 1
import gql from "graphql-tag";
import {
  PRODUCT_FIELDS,
  CATALOG_FIELDS,
  PUBLIC_PAGE_FIELDS,
} from "./fragments";
// 2
export const INITIAL_DATA_QUERY = gql`
  ${PRODUCT_FIELDS}
  ${CATALOG_FIELDS}
  ${PUBLIC_PAGE_FIELDS}
  query initialData {
    stats: usersAlreadyBought {
      users
      money
    }
    categories: publicCatalogs {
      ...CatalogFields
      children {
        ...CatalogFields
        children {
          ...CatalogFields
        }
      }
    }
    newProducts: getNewProducts {
      ...ProductFields
    }
    recomendedProducts: getRecommendedProducts {
      ...ProductFields
    }
    sellerTerms: publicPageByID(id: "8") {
      ...PublicPageFields
    }
    buyerTerms: publicPageByID(id: "10") {
      ...PublicPageFields
    }
    translations: commonTranslations {
      strings {
        ua
        en
        ru
      }
    }
  }
`;

export const PRODUCT_BY_SLUG = gql`
  ${PRODUCT_FIELDS}
  query productBySlug($slug: String!) {
    product: publicProduct(slug: $slug) {
      ...ProductFields
    }
  }
`;

export const PRODUCTS_BY_IDS = gql`
  ${PRODUCT_FIELDS}
  query productsById($ids: [ID!]) {
    products: getProductsByIds(ids: $ids) {
      ...ProductFields
    }
  }
`;

export const PRODUCT_BY_USER_ID = gql`
  ${PRODUCT_FIELDS}
  query productByUserId($user_id: ID!, $page: Int) {
    products: publicUserProfileProducts(user_id: $user_id, page: $page) {
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
      data {
        ...ProductFields
      }
    }
  }
`;

export const SIMILAR_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query getUserSimilarProducts {
    products: getUserSimilarProducts {
      ...ProductFields
    }
  }
`;

export const CATEGORY_BY_SLUG = gql`
  ${CATALOG_FIELDS}
  ${PRODUCT_FIELDS}
  query categoryBySlug($slug: String!, $page: Int!) {
    category: publicCatalog(slug: $slug) {
      ...CatalogFields
    }
    productsForCategory: getProductsForCtategory(cat_slug: $slug, page: $page) {
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
      data {
        ...ProductFields
      }
    }
  }
`;

export const PRODUCTS_IN_CATEGORY = gql`
  ${PRODUCT_FIELDS}
  query productsByCategory(
    $slug: String!
    $page: Int!
    $filter: ProductFilter # $orderBy: orderBy
  ) {
    productsForCategory: getProductsForCtategory(
      cat_slug: $slug
      page: $page
      filter: $filter # orderBy:$orderBy
    ) {
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
      data {
        ...ProductFields
      }
    }
  }
`;

export const NP_REGIONS = gql`
  query npRegions {
    npRegions: getNPRegions {
      id
      title_ua
      title_ru
      sync_code
    }
  }
`;

export const NP_CITY = gql`
  query npCity($region_id: ID!) {
    npCity: getNPCity(region_id: $region_id) {
      id
      region_id
      title_ua
      title_ru
      sync_code
      warehouses {
        id
        title_ua
        title_ru
        sync_code
      }
    }
  }
`;

export const USER_ALL_NOTIFICATIONS = gql`
  query userAllNotifications($page: Int, $count: Int) {
    notifications: userAllNotifications(page: $page, count: $count) {
      id
      type
      message
      status
      date
      total
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query getSearchProducts($search: String) {
    products: getSearchProducts(search: $search) {
      paginatorInfo {
        count
        currentPage
        hasMorePages
        perPage
        lastPage
        total
      }
      data {
        ...ProductFields
      }
    }
  }
`;

export const ORDER_CREATE = gql`
  mutation($input: PublicOrderCreateInput!) {
    userOrderCreate(input: $input) {
      id
      buyer_id
      buyer_name
      buyer_phone
      start_price
      count
      start_total
      comment
      delivery_type
      delivery_region
      delivery_city
      delivery_warehouse
      delivery_comment
    }
  }
`;

export const GET_SIMILAR_BY_IDS = gql`
  ${PRODUCT_FIELDS}
  query similarByIds($ids: [ID!]) {
    getSimilarProductsByIds(ids: $ids) {
      ...ProductFields
    }
  }
`;

export const ORDERS_ALL = gql`
  ${PRODUCT_FIELDS}
  query userAllOrders($page: Int) {
    orders: getAllOrdersUser(page: $page) {
      paginatorInfo {
        hasMorePages
        count
        currentPage
        firstItem
        lastItem
        lastPage
        perPage
        total
      }
      data {
        id
        product {
          ...ProductFields
        }
        buyer_id
        count
        created_at
        seller {
          id
          name
          first_name
          last_name
          email
          created_at
          updated_at
        }
        status
        delivery_region
        delivery_city
        delivery_warehouse
        buyer_id
        start_price
        last_price
        start_total
        last_total
        start_price
        transactions {
          id
          order_status
          payment_id
          masked_card
          order_time
          amount
          response_description
        }
      }
    }
  }
`;

export const ORDERS_MINI = gql`
  query getAllOrdersUser {
    orders: getAllOrdersUser {
      id
      buyer_id
      start_price
      start_total
    }
  }
`;

export const PUBIC_PAGE = gql`
  query publicPage($slug: String!) {
    page: publicPage(slug: $slug) {
      id
      slug
      page_type
      visible
      position
      title
      description
      translations {
        locale
        title
        description
      }
    }
  }
`;
