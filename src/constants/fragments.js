import gql from "graphql-tag";

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    user_id
    slug
    title
    description
    total
    total_bought
    date_end
    date_start
    status
    location
    images_url
    actual_price
    visible
    views
    moderation_message
    prices {
      min
      max
      price
    }
    created_at
  }
`;

export const CATALOG_FIELDS = gql`
  fragment CatalogFields on Catalog {
    slug
    id
    title
    visible
    main_catalog
    popular
    color
    position
    translations {
      locale
      title
      description
    }
    image_url
    image_big_url
    image_index_url
    price {
      min
      max
    }
  }
`;

export const PUBLIC_PAGE_FIELDS = gql`
  fragment PublicPageFields on Page {
    title
    translations {
      locale
      title
      description
    }
  }
`;
