import { graphql } from '@/gql';

export const PromotionListDocument = graphql(`
  query PromotionList($options: PromotionListOptions) {
    promotions(options: $options) {
      items {
        id
        name
        couponCode
        enabled
        startsAt
        endsAt
      }
      totalItems
    }
  }
`);

export const PromotionDetailDocument = graphql(`
  query PromotionDetail($id: ID!) {
    promotion(id: $id) {
      id
      createdAt
      updatedAt
      name
      description
      enabled
      couponCode
      perCustomerUsageLimit
      usageLimit
      startsAt
      endsAt
      conditions {
        code
        args {
          name
          value
        }
      }
      actions {
        code
        args {
          name
          value
        }
      }
      translations @customFields(entity: "Promotion", locale: true) {
        id
        languageCode
        name
        description
      }
      customFields @customFields(entity: "Promotion")
    }
  }
`);

export const PromotionOperationsDocument = graphql(`
  query PromotionOperations {
    promotionConditions {
      code
      description
      args {
        name
        type
        list
        required
        defaultValue
        label
        description
        ui
      }
    }
    promotionActions {
      code
      description
      args {
        name
        type
        list
        required
        defaultValue
        label
        description
        ui
      }
    }
  }
`);

export const CreatePromotionDocument = graphql(`
  mutation CreatePromotion($input: CreatePromotionInput!) {
    createPromotion(input: $input) {
      ... on Promotion {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const UpdatePromotionDocument = graphql(`
  mutation UpdatePromotion($input: UpdatePromotionInput!) {
    updatePromotion(input: $input) {
      ... on Promotion {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const DeletePromotionDocument = graphql(`
  mutation DeletePromotion($id: ID!) {
    deletePromotion(id: $id) {
      result
      message
    }
  }
`);
