import { graphql } from '@/gql';

/**
 * Server-wide configuration, loaded once per session (like the web dashboard's
 * ServerConfigProvider): custom fields per entity, permissions, order process, etc.
 */
export const ServerConfigDocument = graphql(`
  query ServerConfig {
    globalSettings {
      id
      availableLanguages
      serverConfig {
        moneyStrategyPrecision
        permittedAssetTypes
        permissions {
          name
          description
          assignable
        }
        orderProcess {
          name
          to
        }
        entityCustomFields {
          entityName
          customFields {
            __typename
            ... on CustomField {
              name
              type
              list
              readonly
              internal
              nullable
              requiresPermission
              ui
              label {
                languageCode
                value
              }
              description {
                languageCode
                value
              }
            }
            ... on StringCustomFieldConfig {
              pattern
              length
              options {
                value
                label {
                  languageCode
                  value
                }
              }
            }
            ... on LocaleStringCustomFieldConfig {
              pattern
              length
            }
            ... on IntCustomFieldConfig {
              intMin: min
              intMax: max
              intStep: step
            }
            ... on FloatCustomFieldConfig {
              floatMin: min
              floatMax: max
              floatStep: step
            }
            ... on DateTimeCustomFieldConfig {
              datetimeMin: min
              datetimeMax: max
            }
            ... on RelationCustomFieldConfig {
              entity
              scalarFields
            }
            ... on StructCustomFieldConfig {
              fields {
                ... on StructField {
                  name
                  type
                  list
                  label {
                    languageCode
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);
