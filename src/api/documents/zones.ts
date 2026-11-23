import { graphql } from '@/gql';

export const ZoneListDocument = graphql(`
  query ZoneList($options: ZoneListOptions) {
    zones(options: $options) {
      items {
        id
        name
      }
      totalItems
    }
  }
`);

export const ZoneDetailDocument = graphql(`
  query ZoneDetail($id: ID!) {
    zone(id: $id) {
      id
      createdAt
      updatedAt
      name
      members {
        id
        code
        name
        enabled
      }
      customFields @customFields(entity: "Zone")
    }
  }
`);

export const CreateZoneDocument = graphql(`
  mutation CreateZone($input: CreateZoneInput!) {
    createZone(input: $input) {
      id
    }
  }
`);

export const UpdateZoneDocument = graphql(`
  mutation UpdateZone($input: UpdateZoneInput!) {
    updateZone(input: $input) {
      id
    }
  }
`);

export const DeleteZoneDocument = graphql(`
  mutation DeleteZone($id: ID!) {
    deleteZone(id: $id) {
      result
      message
    }
  }
`);

export const AddMembersToZoneDocument = graphql(`
  mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {
    addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {
      id
    }
  }
`);

export const RemoveMembersFromZoneDocument = graphql(`
  mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {
    removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {
      id
    }
  }
`);
