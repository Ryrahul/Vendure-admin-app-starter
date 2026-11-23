import { graphql } from '@/gql';

export const ChannelListDocument = graphql(`
  query ChannelList($options: ChannelListOptions) {
    channels(options: $options) {
      items {
        id
        code
        defaultLanguageCode
        defaultCurrencyCode
        pricesIncludeTax
        seller {
          id
          name
        }
      }
      totalItems
    }
  }
`);

export const ChannelDetailDocument = graphql(`
  query ChannelDetail($id: ID!) {
    channel(id: $id) {
      id
      createdAt
      updatedAt
      code
      token
      pricesIncludeTax
      availableCurrencyCodes
      availableLanguageCodes
      defaultCurrencyCode
      defaultLanguageCode
      trackInventory
      outOfStockThreshold
      defaultShippingZone {
        id
        name
      }
      defaultTaxZone {
        id
        name
      }
      seller {
        id
        name
      }
      customFields @customFields(entity: "Channel")
    }
  }
`);

export const CreateChannelDocument = graphql(`
  mutation CreateChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      __typename
      ... on Channel {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const UpdateChannelDocument = graphql(`
  mutation UpdateChannel($input: UpdateChannelInput!) {
    updateChannel(input: $input) {
      __typename
      ... on Channel {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const DeleteChannelDocument = graphql(`
  mutation DeleteChannel($id: ID!) {
    deleteChannel(id: $id) {
      result
      message
    }
  }
`);

export const PickZoneOptionsDocument = graphql(`
  query PickZoneOptions($options: ZoneListOptions) {
    zones(options: $options) {
      items {
        id
        name
      }
      totalItems
    }
  }
`);

export const DEFAULT_CHANNEL_CODE = '__default_channel__';
export const channelLabel = (code: string) => (code === DEFAULT_CHANNEL_CODE ? 'Default channel' : code);
