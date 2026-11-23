import { graphql } from '@/gql';

export const LoginDocument = graphql(`
  mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {
    login(username: $username, password: $password, rememberMe: $rememberMe) {
      __typename
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const LogoutDocument = graphql(`
  mutation Logout {
    logout {
      success
    }
  }
`);

export const CurrentUserDocument = graphql(`
  query CurrentUser {
    me {
      id
      identifier
      channels {
        id
        code
        token
        permissions
      }
    }
    activeAdministrator {
      id
      firstName
      lastName
      emailAddress
    }
  }
`);

export const ActiveChannelDocument = graphql(`
  query ActiveChannel {
    activeChannel {
      id
      code
      token
      defaultCurrencyCode
      defaultLanguageCode
      pricesIncludeTax
    }
    globalSettings {
      id
      serverConfig {
        moneyStrategyPrecision
      }
    }
  }
`);
