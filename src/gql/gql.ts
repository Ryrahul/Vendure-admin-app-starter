/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query AdministratorList($options: AdministratorListOptions) {\n    administrators(options: $options) {\n      items {\n        id\n        firstName\n        lastName\n        emailAddress\n        user {\n          id\n          roles {\n            id\n            code\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.AdministratorListDocument,
    "\n  query AdministratorDetail($id: ID!) {\n    administrator(id: $id) {\n      id\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      emailAddress\n      user {\n        id\n        identifier\n        lastLogin\n        roles {\n          id\n          code\n          description\n          channels {\n            id\n            code\n          }\n        }\n      }\n      customFields @customFields(entity: \"Administrator\")\n    }\n  }\n": typeof types.AdministratorDetailDocument,
    "\n  mutation CreateAdministrator($input: CreateAdministratorInput!) {\n    createAdministrator(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateAdministratorDocument,
    "\n  mutation UpdateAdministrator($input: UpdateAdministratorInput!) {\n    updateAdministrator(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateAdministratorDocument,
    "\n  mutation DeleteAdministrator($id: ID!) {\n    deleteAdministrator(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteAdministratorDocument,
    "\n  query ApiKeyList($options: ApiKeyListOptions) {\n    apiKeys(options: $options) {\n      items {\n        id\n        name\n        lookupId\n        lastUsedAt\n      }\n      totalItems\n    }\n  }\n": typeof types.ApiKeyListDocument,
    "\n  query ApiKeyDetail($id: ID!) {\n    apiKey(id: $id) {\n      id\n      createdAt\n      updatedAt\n      lookupId\n      lastUsedAt\n      name\n      owner {\n        id\n        identifier\n      }\n      user {\n        id\n        roles {\n          id\n          code\n          description\n        }\n      }\n      translations {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ApiKey\")\n    }\n  }\n": typeof types.ApiKeyDetailDocument,
    "\n  query ActiveAdministratorRoles {\n    activeAdministrator {\n      id\n      user {\n        id\n        roles {\n          id\n          code\n          description\n        }\n      }\n    }\n  }\n": typeof types.ActiveAdministratorRolesDocument,
    "\n  mutation CreateApiKey($input: CreateApiKeyInput!) {\n    createApiKey(input: $input) {\n      apiKey\n      entityId\n    }\n  }\n": typeof types.CreateApiKeyDocument,
    "\n  mutation UpdateApiKey($input: UpdateApiKeyInput!) {\n    updateApiKey(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateApiKeyDocument,
    "\n  mutation RotateApiKey($id: ID!) {\n    rotateApiKey(id: $id) {\n      apiKey\n    }\n  }\n": typeof types.RotateApiKeyDocument,
    "\n  mutation DeleteApiKeys($ids: [ID!]!) {\n    deleteApiKeys(ids: $ids) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteApiKeysDocument,
    "\n  query AssetList($options: AssetListOptions) {\n    assets(options: $options) {\n      items {\n        id\n        name\n        preview\n        type\n        mimeType\n      }\n      totalItems\n    }\n  }\n": typeof types.AssetListDocument,
    "\n  query AssetDetail($id: ID!) {\n    asset(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      type\n      fileSize\n      mimeType\n      width\n      height\n      source\n      preview\n      focalPoint {\n        x\n        y\n      }\n      tags {\n        id\n        value\n      }\n      customFields @customFields(entity: \"Asset\")\n    }\n  }\n": typeof types.AssetDetailDocument,
    "\n  query AssetTags($options: TagListOptions) {\n    tags(options: $options) {\n      items {\n        id\n        value\n      }\n      totalItems\n    }\n  }\n": typeof types.AssetTagsDocument,
    "\n  mutation UpdateAsset($input: UpdateAssetInput!) {\n    updateAsset(input: $input) {\n      id\n      updatedAt\n    }\n  }\n": typeof types.UpdateAssetDocument,
    "\n  mutation DeleteAssets($input: DeleteAssetsInput!) {\n    deleteAssets(input: $input) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteAssetsDocument,
    "\n  mutation CreateAssets($input: [CreateAssetInput!]!) {\n    createAssets(input: $input) {\n      ... on Asset {\n        __typename\n        id\n        name\n        preview\n        mimeType\n      }\n      ... on MimeTypeError {\n        __typename\n        errorCode\n        message\n        fileName\n        mimeType\n      }\n    }\n  }\n": typeof types.CreateAssetsDocument,
    "\n  mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {\n    login(username: $username, password: $password, rememberMe: $rememberMe) {\n      __typename\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout {\n    logout {\n      success\n    }\n  }\n": typeof types.LogoutDocument,
    "\n  query CurrentUser {\n    me {\n      id\n      identifier\n      channels {\n        id\n        code\n        token\n        permissions\n      }\n    }\n    activeAdministrator {\n      id\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n": typeof types.CurrentUserDocument,
    "\n  query ActiveChannel {\n    activeChannel {\n      id\n      code\n      token\n      defaultCurrencyCode\n      defaultLanguageCode\n      pricesIncludeTax\n    }\n    globalSettings {\n      id\n      serverConfig {\n        moneyStrategyPrecision\n      }\n    }\n  }\n": typeof types.ActiveChannelDocument,
    "\n  query ChannelList($options: ChannelListOptions) {\n    channels(options: $options) {\n      items {\n        id\n        code\n        defaultLanguageCode\n        defaultCurrencyCode\n        pricesIncludeTax\n        seller {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.ChannelListDocument,
    "\n  query ChannelDetail($id: ID!) {\n    channel(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      token\n      pricesIncludeTax\n      availableCurrencyCodes\n      availableLanguageCodes\n      defaultCurrencyCode\n      defaultLanguageCode\n      trackInventory\n      outOfStockThreshold\n      defaultShippingZone {\n        id\n        name\n      }\n      defaultTaxZone {\n        id\n        name\n      }\n      seller {\n        id\n        name\n      }\n      customFields @customFields(entity: \"Channel\")\n    }\n  }\n": typeof types.ChannelDetailDocument,
    "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      __typename\n      ... on Channel {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.CreateChannelDocument,
    "\n  mutation UpdateChannel($input: UpdateChannelInput!) {\n    updateChannel(input: $input) {\n      __typename\n      ... on Channel {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.UpdateChannelDocument,
    "\n  mutation DeleteChannel($id: ID!) {\n    deleteChannel(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteChannelDocument,
    "\n  query PickZoneOptions($options: ZoneListOptions) {\n    zones(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": typeof types.PickZoneOptionsDocument,
    "\n  query CollectionList($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        name\n        slug\n        isPrivate\n        parentId\n        position\n        productVariantCount\n        featuredAsset {\n          id\n          preview\n        }\n        breadcrumbs {\n          id\n          name\n        }\n        children {\n          id\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.CollectionListDocument,
    "\n  query CollectionDetail($id: ID!) {\n    collection(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      name\n      slug\n      description\n      isPrivate\n      inheritFilters\n      position\n      parentId\n      breadcrumbs {\n        id\n        name\n      }\n      parent {\n        id\n        name\n      }\n      children {\n        id\n        name\n      }\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      filters {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"Collection\", locale: true) {\n        id\n        languageCode\n        name\n        slug\n        description\n      }\n      customFields @customFields(entity: \"Collection\")\n    }\n  }\n": typeof types.CollectionDetailDocument,
    "\n  query CollectionContents($id: ID!, $options: ProductVariantListOptions) {\n    collection(id: $id) {\n      id\n      productVariants(options: $options) {\n        totalItems\n        items {\n          id\n          name\n          sku\n          featuredAsset {\n            id\n            preview\n          }\n          product {\n            id\n            featuredAsset {\n              id\n              preview\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.CollectionContentsDocument,
    "\n  query CollectionFilters {\n    collectionFilters {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": typeof types.CollectionFiltersDocument,
    "\n  mutation CreateCollection($input: CreateCollectionInput!) {\n    createCollection(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateCollectionDocument,
    "\n  mutation UpdateCollection($input: UpdateCollectionInput!) {\n    updateCollection(input: $input) {\n      id\n      updatedAt\n    }\n  }\n": typeof types.UpdateCollectionDocument,
    "\n  mutation MoveCollection($input: MoveCollectionInput!) {\n    moveCollection(input: $input) {\n      id\n      parentId\n    }\n  }\n": typeof types.MoveCollectionDocument,
    "\n  mutation DeleteCollection($id: ID!) {\n    deleteCollection(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteCollectionDocument,
    "\n  query CountryList($options: CountryListOptions) {\n    countries(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n      }\n      totalItems\n    }\n  }\n": typeof types.CountryListDocument,
    "\n  query CountryDetail($id: ID!) {\n    country(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      enabled\n      translations @customFields(entity: \"Country\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"Country\")\n    }\n  }\n": typeof types.CountryDetailDocument,
    "\n  mutation CreateCountry($input: CreateCountryInput!) {\n    createCountry(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateCountryDocument,
    "\n  mutation UpdateCountry($input: UpdateCountryInput!) {\n    updateCountry(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateCountryDocument,
    "\n  mutation DeleteCountry($id: ID!) {\n    deleteCountry(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteCountryDocument,
    "\n  query CustomerGroupList($options: CustomerGroupListOptions) {\n    customerGroups(options: $options) {\n      items {\n        id\n        name\n        customers {\n          totalItems\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.CustomerGroupListDocument,
    "\n  query CustomerGroupDetail($id: ID!) {\n    customerGroup(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      customFields @customFields(entity: \"CustomerGroup\")\n    }\n  }\n": typeof types.CustomerGroupDetailDocument,
    "\n  query CustomerGroupMembers($id: ID!, $options: CustomerListOptions) {\n    customerGroup(id: $id) {\n      id\n      customers(options: $options) {\n        items {\n          id\n          firstName\n          lastName\n          emailAddress\n        }\n        totalItems\n      }\n    }\n  }\n": typeof types.CustomerGroupMembersDocument,
    "\n  mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {\n    createCustomerGroup(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateCustomerGroupDocument,
    "\n  mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {\n    updateCustomerGroup(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateCustomerGroupDocument,
    "\n  mutation DeleteCustomerGroup($id: ID!) {\n    deleteCustomerGroup(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteCustomerGroupDocument,
    "\n  mutation AddCustomersToGroup($customerGroupId: ID!, $customerIds: [ID!]!) {\n    addCustomersToGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {\n      id\n    }\n  }\n": typeof types.AddCustomersToGroupDocument,
    "\n  mutation RemoveCustomersFromGroup($customerGroupId: ID!, $customerIds: [ID!]!) {\n    removeCustomersFromGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {\n      id\n    }\n  }\n": typeof types.RemoveCustomersFromGroupDocument,
    "\n  query CustomerList($options: CustomerListOptions) {\n    customers(options: $options) {\n      items {\n        id\n        createdAt\n        title\n        firstName\n        lastName\n        emailAddress\n        phoneNumber\n        user {\n          id\n          verified\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.CustomerListDocument,
    "\n  fragment CustomerAddress on Address {\n    id\n    fullName\n    company\n    streetLine1\n    streetLine2\n    city\n    province\n    postalCode\n    phoneNumber\n    defaultShippingAddress\n    defaultBillingAddress\n    country {\n      id\n      code\n      name\n    }\n    customFields @customFields(entity: \"Address\")\n  }\n": typeof types.CustomerAddressFragmentDoc,
    "\n  query CustomerDetail($id: ID!) {\n    customer(id: $id) {\n      id\n      createdAt\n      updatedAt\n      title\n      firstName\n      lastName\n      phoneNumber\n      emailAddress\n      groups {\n        id\n        name\n      }\n      user {\n        id\n        identifier\n        verified\n        lastLogin\n      }\n      addresses {\n        ...CustomerAddress\n      }\n      customFields @customFields(entity: \"Customer\")\n    }\n  }\n": typeof types.CustomerDetailDocument,
    "\n  query CustomerOrders($customerId: ID!, $options: OrderListOptions) {\n    customer(id: $customerId) {\n      id\n      orders(options: $options) {\n        items {\n          ...OrderListItem\n        }\n        totalItems\n      }\n    }\n  }\n": typeof types.CustomerOrdersDocument,
    "\n  query CustomerHistory($id: ID!, $options: HistoryEntryListOptions) {\n    activeAdministrator {\n      id\n    }\n    customer(id: $id) {\n      id\n      history(options: $options) {\n        totalItems\n        items {\n          id\n          type\n          createdAt\n          isPublic\n          data\n          administrator {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n": typeof types.CustomerHistoryDocument,
    "\n  mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {\n    createCustomer(input: $input, password: $password) {\n      __typename\n      ... on Customer {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.CreateCustomerDocument,
    "\n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      __typename\n      ... on Customer {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.UpdateCustomerDocument,
    "\n  mutation DeleteCustomer($id: ID!) {\n    deleteCustomer(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteCustomerDocument,
    "\n  mutation VerifyCustomerAccount($id: ID!, $password: String) {\n    verifyCustomerAccount(id: $id, password: $password) {\n      __typename\n      ... on Customer {\n        id\n        user {\n          id\n          verified\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.VerifyCustomerAccountDocument,
    "\n  mutation CreateCustomerAddress($customerId: ID!, $input: CreateAddressInput!) {\n    createCustomerAddress(customerId: $customerId, input: $input) {\n      id\n    }\n  }\n": typeof types.CreateCustomerAddressDocument,
    "\n  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {\n    updateCustomerAddress(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateCustomerAddressDocument,
    "\n  mutation DeleteCustomerAddress($id: ID!) {\n    deleteCustomerAddress(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteCustomerAddressDocument,
    "\n  mutation AddCustomerNote($input: AddNoteToCustomerInput!) {\n    addNoteToCustomer(input: $input) {\n      id\n    }\n  }\n": typeof types.AddCustomerNoteDocument,
    "\n  mutation UpdateCustomerNote($input: UpdateCustomerNoteInput!) {\n    updateCustomerNote(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateCustomerNoteDocument,
    "\n  mutation DeleteCustomerNote($id: ID!) {\n    deleteCustomerNote(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteCustomerNoteDocument,
    "\n  query DashboardMetrics {\n    metricSummary(input: { interval: Daily, types: [OrderCount, OrderTotal, AverageOrderValue] }) {\n      type\n      title\n      entries {\n        label\n        value\n      }\n    }\n  }\n": typeof types.DashboardMetricsDocument,
    "\n  query DashboardOrders($today: DateTime!, $monthStart: DateTime!) {\n    today: orders(\n      options: {\n        take: 0\n        filter: { active: { eq: false }, orderPlacedAt: { after: $today }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n    }\n    month: orders(\n      options: {\n        take: 0\n        filter: { active: { eq: false }, orderPlacedAt: { after: $monthStart }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n    }\n    latest: orders(\n      options: {\n        take: 6\n        sort: { orderPlacedAt: DESC }\n        filter: { active: { eq: false }, state: { notIn: [\"Draft\"] } }\n      }\n    ) {\n      items {\n        ...OrderListItem\n      }\n    }\n  }\n": typeof types.DashboardOrdersDocument,
    "\n  query DashboardOrderTotals($since: DateTime!, $take: Int!) {\n    orders(\n      options: {\n        take: $take\n        sort: { orderPlacedAt: DESC }\n        filter: { active: { eq: false }, orderPlacedAt: { after: $since }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n      items {\n        id\n        orderPlacedAt\n        totalWithTax\n      }\n    }\n  }\n": typeof types.DashboardOrderTotalsDocument,
    "\n  query DraftOrderDetail($id: ID!) {\n    order(id: $id) {\n      id\n      code\n      state\n      active\n      createdAt\n      updatedAt\n      currencyCode\n      totalQuantity\n      subTotalWithTax\n      shippingWithTax\n      total\n      totalWithTax\n      couponCodes\n      nextStates\n      customer {\n        id\n        firstName\n        lastName\n        emailAddress\n        addresses {\n          id\n          fullName\n          company\n          streetLine1\n          streetLine2\n          city\n          province\n          postalCode\n          phoneNumber\n          defaultShippingAddress\n          defaultBillingAddress\n          country {\n            id\n            code\n            name\n          }\n        }\n      }\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        linePriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          id\n          name\n          sku\n        }\n      }\n      discounts {\n        description\n        amountWithTax\n      }\n      promotions {\n        id\n        name\n        couponCode\n      }\n      shippingLines {\n        id\n        priceWithTax\n        shippingMethod {\n          id\n          name\n        }\n      }\n      shippingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      billingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      customFields @customFields(entity: \"Order\")\n    }\n  }\n": typeof types.DraftOrderDetailDocument,
    "\n  mutation CreateDraftOrder {\n    createDraftOrder {\n      id\n    }\n  }\n": typeof types.CreateDraftOrderDocument,
    "\n  mutation DeleteDraftOrder($orderId: ID!) {\n    deleteDraftOrder(orderId: $orderId) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteDraftOrderDocument,
    "\n  mutation AddItemToDraftOrder($orderId: ID!, $input: AddItemToDraftOrderInput!) {\n    addItemToDraftOrder(orderId: $orderId, input: $input) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.AddItemToDraftOrderDocument,
    "\n  mutation AdjustDraftOrderLine($orderId: ID!, $input: AdjustDraftOrderLineInput!) {\n    adjustDraftOrderLine(orderId: $orderId, input: $input) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.AdjustDraftOrderLineDocument,
    "\n  mutation RemoveDraftOrderLine($orderId: ID!, $orderLineId: ID!) {\n    removeDraftOrderLine(orderId: $orderId, orderLineId: $orderLineId) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.RemoveDraftOrderLineDocument,
    "\n  mutation SetCustomerForDraftOrder($orderId: ID!, $customerId: ID, $input: CreateCustomerInput) {\n    setCustomerForDraftOrder(orderId: $orderId, customerId: $customerId, input: $input) {\n      __typename\n      ... on Order {\n        id\n        customer {\n          id\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.SetCustomerForDraftOrderDocument,
    "\n  mutation SetDraftOrderShippingAddress($orderId: ID!, $input: CreateAddressInput!) {\n    setDraftOrderShippingAddress(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n": typeof types.SetDraftOrderShippingAddressDocument,
    "\n  mutation SetDraftOrderBillingAddress($orderId: ID!, $input: CreateAddressInput!) {\n    setDraftOrderBillingAddress(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n": typeof types.SetDraftOrderBillingAddressDocument,
    "\n  mutation UnsetDraftOrderShippingAddress($orderId: ID!) {\n    unsetDraftOrderShippingAddress(orderId: $orderId) {\n      id\n    }\n  }\n": typeof types.UnsetDraftOrderShippingAddressDocument,
    "\n  mutation UnsetDraftOrderBillingAddress($orderId: ID!) {\n    unsetDraftOrderBillingAddress(orderId: $orderId) {\n      id\n    }\n  }\n": typeof types.UnsetDraftOrderBillingAddressDocument,
    "\n  query DraftOrderEligibleShippingMethods($orderId: ID!) {\n    eligibleShippingMethodsForDraftOrder(orderId: $orderId) {\n      id\n      name\n      code\n      description\n      price\n      priceWithTax\n    }\n  }\n": typeof types.DraftOrderEligibleShippingMethodsDocument,
    "\n  mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {\n    setDraftOrderShippingMethod(orderId: $orderId, shippingMethodId: $shippingMethodId) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.SetDraftOrderShippingMethodDocument,
    "\n  mutation ApplyCouponCodeToDraftOrder($orderId: ID!, $couponCode: String!) {\n    applyCouponCodeToDraftOrder(orderId: $orderId, couponCode: $couponCode) {\n      __typename\n      ... on Order {\n        id\n        couponCodes\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.ApplyCouponCodeToDraftOrderDocument,
    "\n  mutation RemoveCouponCodeFromDraftOrder($orderId: ID!, $couponCode: String!) {\n    removeCouponCodeFromDraftOrder(orderId: $orderId, couponCode: $couponCode) {\n      id\n      couponCodes\n    }\n  }\n": typeof types.RemoveCouponCodeFromDraftOrderDocument,
    "\n  mutation SetDraftOrderCustomFields($orderId: ID!, $input: UpdateOrderInput!) {\n    setDraftOrderCustomFields(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n": typeof types.SetDraftOrderCustomFieldsDocument,
    "\n  query DraftOrderVariants($options: ProductVariantListOptions) {\n    productVariants(options: $options) {\n      items {\n        id\n        name\n        sku\n        stockLevel\n      }\n      totalItems\n    }\n  }\n": typeof types.DraftOrderVariantsDocument,
    "\n  query FacetList($options: FacetListOptions) {\n    facets(options: $options) {\n      items {\n        id\n        code\n        name\n        isPrivate\n        valueList(options: { take: 5 }) {\n          totalItems\n          items {\n            id\n            name\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.FacetListDocument,
    "\n  query FacetDetail($id: ID!) {\n    facet(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      isPrivate\n      translations @customFields(entity: \"Facet\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"Facet\")\n      values {\n        id\n        code\n        name\n        languageCode\n        translations @customFields(entity: \"FacetValue\", locale: true) {\n          id\n          languageCode\n          name\n        }\n        customFields @customFields(entity: \"FacetValue\")\n      }\n    }\n  }\n": typeof types.FacetDetailDocument,
    "\n  mutation CreateFacet($input: CreateFacetInput!) {\n    createFacet(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateFacetDocument,
    "\n  mutation UpdateFacet($input: UpdateFacetInput!) {\n    updateFacet(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateFacetDocument,
    "\n  mutation DeleteFacet($id: ID!, $force: Boolean) {\n    deleteFacet(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteFacetDocument,
    "\n  mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {\n    createFacetValues(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateFacetValuesDocument,
    "\n  mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {\n    updateFacetValues(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateFacetValuesDocument,
    "\n  mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {\n    deleteFacetValues(ids: $ids, force: $force) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteFacetValuesDocument,
    "\n  query GlobalSettingsDetail {\n    globalSettings {\n      id\n      updatedAt\n      availableLanguages\n      trackInventory\n      outOfStockThreshold\n      customFields @customFields(entity: \"GlobalSettings\")\n    }\n  }\n": typeof types.GlobalSettingsDetailDocument,
    "\n  mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {\n    updateGlobalSettings(input: $input) {\n      __typename\n      ... on GlobalSettings {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.UpdateGlobalSettingsDocument,
    "\n  query JobList($options: JobListOptions) {\n    jobs(options: $options) {\n      items {\n        id\n        queueName\n        state\n        progress\n        createdAt\n        settledAt\n        duration\n      }\n      totalItems\n    }\n  }\n": typeof types.JobListDocument,
    "\n  query JobDetail($id: ID!) {\n    job(jobId: $id) {\n      id\n      queueName\n      state\n      progress\n      createdAt\n      startedAt\n      settledAt\n      isSettled\n      duration\n      data\n      result\n      error\n      retries\n      attempts\n    }\n  }\n": typeof types.JobDetailDocument,
    "\n  query JobQueueList {\n    jobQueues {\n      name\n      running\n    }\n  }\n": typeof types.JobQueueListDocument,
    "\n  mutation CancelJob($jobId: ID!) {\n    cancelJob(jobId: $jobId) {\n      id\n      state\n    }\n  }\n": typeof types.CancelJobDocument,
    "\n  mutation RebuildSearchIndex {\n    reindex {\n      id\n      queueName\n      state\n    }\n  }\n": typeof types.RebuildSearchIndexDocument,
    "\n  query ActiveJobCount($filter: JobFilterParameter) {\n    jobs(options: { take: 1, filter: $filter }) {\n      totalItems\n    }\n  }\n": typeof types.ActiveJobCountDocument,
    "\n  query OptionGroupList($options: ProductOptionGroupListOptions) {\n    productOptionGroups(options: $options) {\n      items {\n        id\n        code\n        name\n        productCount\n        options {\n          id\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.OptionGroupListDocument,
    "\n  query OptionGroupDetail($id: ID!) {\n    productOptionGroup(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      productCount\n      translations @customFields(entity: \"ProductOptionGroup\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ProductOptionGroup\")\n      options {\n        id\n        code\n        name\n        languageCode\n        translations @customFields(entity: \"ProductOption\", locale: true) {\n          id\n          languageCode\n          name\n        }\n        customFields @customFields(entity: \"ProductOption\")\n      }\n    }\n  }\n": typeof types.OptionGroupDetailDocument,
    "\n  mutation CreateOptionGroup($input: CreateProductOptionGroupInput!) {\n    createProductOptionGroup(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateOptionGroupDocument,
    "\n  mutation UpdateOptionGroup($input: UpdateProductOptionGroupInput!) {\n    updateProductOptionGroup(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateOptionGroupDocument,
    "\n  mutation DeleteOptionGroup($id: ID!, $force: Boolean) {\n    deleteProductOptionGroup(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteOptionGroupDocument,
    "\n  mutation CreateProductOption($input: CreateProductOptionInput!) {\n    createProductOption(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateProductOptionDocument,
    "\n  mutation UpdateProductOption($input: UpdateProductOptionInput!) {\n    updateProductOption(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateProductOptionDocument,
    "\n  mutation DeleteProductOption($id: ID!) {\n    deleteProductOption(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteProductOptionDocument,
    "\n  fragment OrderListItem on Order {\n    id\n    code\n    state\n    active\n    orderPlacedAt\n    updatedAt\n    totalWithTax\n    currencyCode\n    customer {\n      id\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n": typeof types.OrderListItemFragmentDoc,
    "\n  query OrderList($options: OrderListOptions) {\n    orders(options: $options) {\n      items {\n        ...OrderListItem\n      }\n      totalItems\n    }\n  }\n": typeof types.OrderListDocument,
    "\n  query OrderDetail($id: ID!) {\n    order(id: $id) {\n      id\n      code\n      state\n      active\n      type\n      createdAt\n      updatedAt\n      orderPlacedAt\n      currencyCode\n      totalQuantity\n      subTotal\n      subTotalWithTax\n      shipping\n      shippingWithTax\n      total\n      totalWithTax\n      nextStates\n      couponCodes\n      customer {\n        id\n        firstName\n        lastName\n        emailAddress\n        phoneNumber\n      }\n      shippingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      billingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      lines {\n        id\n        quantity\n        orderPlacedQuantity\n        unitPriceWithTax\n        proratedUnitPriceWithTax\n        linePriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          id\n          name\n          sku\n        }\n        fulfillmentLines {\n          fulfillmentId\n          quantity\n        }\n        customFields @customFields(entity: \"OrderLine\")\n      }\n      discounts {\n        description\n        amountWithTax\n      }\n      promotions {\n        id\n        name\n        couponCode\n      }\n      surcharges {\n        id\n        description\n        priceWithTax\n      }\n      shippingLines {\n        id\n        priceWithTax\n        discountedPriceWithTax\n        shippingMethod {\n          id\n          name\n          code\n          fulfillmentHandlerCode\n        }\n      }\n      payments {\n        id\n        method\n        amount\n        state\n        nextStates\n        transactionId\n        errorMessage\n        metadata\n        createdAt\n        refunds {\n          id\n          createdAt\n          state\n          total\n          items\n          shipping\n          adjustment\n          reason\n          transactionId\n          method\n          metadata\n          lines {\n            orderLineId\n            quantity\n          }\n        }\n      }\n      fulfillments {\n        id\n        state\n        nextStates\n        method\n        trackingCode\n        createdAt\n        updatedAt\n        lines {\n          orderLineId\n          quantity\n        }\n      }\n      modifications {\n        id\n        createdAt\n        priceChange\n        note\n        isSettled\n      }\n      customFields @customFields(entity: \"Order\")\n    }\n  }\n": typeof types.OrderDetailDocument,
    "\n  query OrderHistory($id: ID!, $options: HistoryEntryListOptions) {\n    activeAdministrator {\n      id\n    }\n    order(id: $id) {\n      id\n      history(options: $options) {\n        totalItems\n        items {\n          id\n          type\n          createdAt\n          isPublic\n          data\n          administrator {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n": typeof types.OrderHistoryDocument,
    "\n  mutation AddOrderNote($input: AddNoteToOrderInput!) {\n    addNoteToOrder(input: $input) {\n      id\n    }\n  }\n": typeof types.AddOrderNoteDocument,
    "\n  mutation UpdateOrderNote($input: UpdateOrderNoteInput!) {\n    updateOrderNote(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateOrderNoteDocument,
    "\n  mutation DeleteOrderNote($id: ID!) {\n    deleteOrderNote(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteOrderNoteDocument,
    "\n  mutation TransitionOrderToState($id: ID!, $state: String!) {\n    transitionOrderToState(id: $id, state: $state) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on OrderStateTransitionError {\n        transitionError\n      }\n    }\n  }\n": typeof types.TransitionOrderToStateDocument,
    "\n  query OrderPaymentMethods($options: PaymentMethodListOptions) {\n    paymentMethods(options: $options) {\n      items {\n        id\n        name\n        code\n        enabled\n      }\n      totalItems\n    }\n  }\n": typeof types.OrderPaymentMethodsDocument,
    "\n  mutation AddManualPayment($input: ManualPaymentInput!) {\n    addManualPaymentToOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.AddManualPaymentDocument,
    "\n  mutation SettlePayment($id: ID!) {\n    settlePayment(id: $id) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.SettlePaymentDocument,
    "\n  mutation CancelPayment($id: ID!) {\n    cancelPayment(id: $id) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.CancelPaymentDocument,
    "\n  mutation TransitionPaymentToState($id: ID!, $state: String!) {\n    transitionPaymentToState(id: $id, state: $state) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.TransitionPaymentToStateDocument,
    "\n  query FulfillmentHandlers {\n    fulfillmentHandlers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": typeof types.FulfillmentHandlersDocument,
    "\n  mutation FulfillOrder($input: FulfillOrderInput!) {\n    addFulfillmentToOrder(input: $input) {\n      __typename\n      ... on Fulfillment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.FulfillOrderDocument,
    "\n  mutation TransitionFulfillment($id: ID!, $state: String!) {\n    transitionFulfillmentToState(id: $id, state: $state) {\n      __typename\n      ... on Fulfillment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.TransitionFulfillmentDocument,
    "\n  mutation CancelOrder($input: CancelOrderInput!) {\n    cancelOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.CancelOrderDocument,
    "\n  mutation RefundOrder($input: RefundOrderInput!) {\n    refundOrder(input: $input) {\n      __typename\n      ... on Refund {\n        id\n        state\n        total\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.RefundOrderDocument,
    "\n  mutation SettleRefund($input: SettleRefundInput!) {\n    settleRefund(input: $input) {\n      __typename\n      ... on Refund {\n        id\n        state\n        transactionId\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.SettleRefundDocument,
    "\n  mutation ModifyOrder($input: ModifyOrderInput!) {\n    modifyOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n        subTotalWithTax\n        shippingWithTax\n        totalWithTax\n        currencyCode\n        lines {\n          id\n          quantity\n          linePriceWithTax\n          productVariant {\n            id\n            name\n          }\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.ModifyOrderDocument,
    "\n  mutation SetOrderCustomFields($input: UpdateOrderInput!) {\n    setOrderCustomFields(input: $input) {\n      id\n    }\n  }\n": typeof types.SetOrderCustomFieldsDocument,
    "\n  query PaymentMethodList($options: PaymentMethodListOptions) {\n    paymentMethods(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n        handler {\n          code\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.PaymentMethodListDocument,
    "\n  query PaymentMethodDetail($id: ID!) {\n    paymentMethod(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      name\n      description\n      enabled\n      checker {\n        code\n        args {\n          name\n          value\n        }\n      }\n      handler {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"PaymentMethod\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"PaymentMethod\")\n    }\n  }\n": typeof types.PaymentMethodDetailDocument,
    "\n  query PaymentMethodOperations {\n    paymentMethodHandlers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    paymentMethodEligibilityCheckers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": typeof types.PaymentMethodOperationsDocument,
    "\n  mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {\n    createPaymentMethod(input: $input) {\n      id\n    }\n  }\n": typeof types.CreatePaymentMethodDocument,
    "\n  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {\n    updatePaymentMethod(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdatePaymentMethodDocument,
    "\n  mutation DeletePaymentMethod($id: ID!, $force: Boolean) {\n    deletePaymentMethod(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n": typeof types.DeletePaymentMethodDocument,
    "\n  query ProductList($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        slug\n        enabled\n        updatedAt\n        featuredAsset {\n          id\n          preview\n        }\n        variantList(options: { take: 1 }) {\n          totalItems\n          items {\n            id\n            priceWithTax\n            currencyCode\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.ProductListDocument,
    "\n  query ProductDetail($id: ID!) {\n    product(id: $id) {\n      id\n      name\n      slug\n      description\n      enabled\n      createdAt\n      updatedAt\n      languageCode\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      channels {\n        id\n        code\n      }\n      optionGroups {\n        id\n        code\n        name\n      }\n      customFields @customFields(entity: \"Product\")\n      translations @customFields(entity: \"Product\", locale: true) {\n        id\n        languageCode\n        name\n        slug\n        description\n      }\n      facetValues {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      variantList(options: { take: 50 }) {\n        totalItems\n        items {\n          id\n          name\n          sku\n          enabled\n          price\n          priceWithTax\n          currencyCode\n          featuredAsset {\n            id\n            preview\n          }\n          options {\n            id\n            name\n          }\n          stockLevels {\n            id\n            stockOnHand\n            stockAllocated\n          }\n        }\n      }\n    }\n  }\n": typeof types.ProductDetailDocument,
    "\n  mutation UpdateProduct($input: UpdateProductInput!) {\n    updateProduct(input: $input) {\n      id\n      name\n      enabled\n      updatedAt\n      translations {\n        id\n        languageCode\n        name\n      }\n    }\n  }\n": typeof types.UpdateProductDocument,
    "\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      id\n      name\n    }\n  }\n": typeof types.CreateProductDocument,
    "\n  mutation DeleteProduct($id: ID!) {\n    deleteProduct(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteProductDocument,
    "\n  mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {\n    assignProductsToChannel(input: $input) {\n      id\n    }\n  }\n": typeof types.AssignProductsToChannelDocument,
    "\n  mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {\n    removeProductsFromChannel(input: $input) {\n      id\n    }\n  }\n": typeof types.RemoveProductsFromChannelDocument,
    "\n  query ProfileDetail {\n    activeAdministrator {\n      id\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      emailAddress\n      user {\n        id\n        identifier\n        lastLogin\n        roles {\n          id\n          code\n          description\n        }\n      }\n      customFields @customFields(entity: \"Administrator\")\n    }\n  }\n": typeof types.ProfileDetailDocument,
    "\n  mutation UpdateProfile($input: UpdateActiveAdministratorInput!) {\n    updateActiveAdministrator(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  query PromotionList($options: PromotionListOptions) {\n    promotions(options: $options) {\n      items {\n        id\n        name\n        couponCode\n        enabled\n        startsAt\n        endsAt\n      }\n      totalItems\n    }\n  }\n": typeof types.PromotionListDocument,
    "\n  query PromotionDetail($id: ID!) {\n    promotion(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      enabled\n      couponCode\n      perCustomerUsageLimit\n      usageLimit\n      startsAt\n      endsAt\n      conditions {\n        code\n        args {\n          name\n          value\n        }\n      }\n      actions {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"Promotion\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"Promotion\")\n    }\n  }\n": typeof types.PromotionDetailDocument,
    "\n  query PromotionOperations {\n    promotionConditions {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    promotionActions {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": typeof types.PromotionOperationsDocument,
    "\n  mutation CreatePromotion($input: CreatePromotionInput!) {\n    createPromotion(input: $input) {\n      ... on Promotion {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.CreatePromotionDocument,
    "\n  mutation UpdatePromotion($input: UpdatePromotionInput!) {\n    updatePromotion(input: $input) {\n      ... on Promotion {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.UpdatePromotionDocument,
    "\n  mutation DeletePromotion($id: ID!) {\n    deletePromotion(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeletePromotionDocument,
    "\n  query RoleList($options: RoleListOptions) {\n    roles(options: $options) {\n      items {\n        id\n        code\n        description\n        permissions\n        channels {\n          id\n          code\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.RoleListDocument,
    "\n  query RoleDetail($id: ID!) {\n    role(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      description\n      permissions\n      channels {\n        id\n        code\n      }\n      customFields @customFields(entity: \"Role\")\n    }\n  }\n": typeof types.RoleDetailDocument,
    "\n  mutation CreateRole($input: CreateRoleInput!) {\n    createRole(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateRoleDocument,
    "\n  mutation UpdateRole($input: UpdateRoleInput!) {\n    updateRole(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateRoleDocument,
    "\n  mutation DeleteRole($id: ID!) {\n    deleteRole(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteRoleDocument,
    "\n  query PickRoleOptions($options: RoleListOptions) {\n    roles(options: $options) {\n      items {\n        id\n        code\n        description\n      }\n      totalItems\n    }\n  }\n": typeof types.PickRoleOptionsDocument,
    "\n  query PickChannelOptions($options: ChannelListOptions) {\n    channels(options: $options) {\n      items {\n        id\n        code\n      }\n      totalItems\n    }\n  }\n": typeof types.PickChannelOptionsDocument,
    "\n  query ScheduledTasks {\n    scheduledTasks {\n      id\n      description\n      schedule\n      scheduleDescription\n      timezone\n      lastExecutedAt\n      nextExecutionAt\n      isRunning\n      lastResult\n      enabled\n    }\n  }\n": typeof types.ScheduledTasksDocument,
    "\n  mutation UpdateScheduledTask($input: UpdateScheduledTaskInput!) {\n    updateScheduledTask(input: $input) {\n      id\n      enabled\n    }\n  }\n": typeof types.UpdateScheduledTaskDocument,
    "\n  mutation RunScheduledTask($id: String!) {\n    runScheduledTask(id: $id) {\n      success\n    }\n  }\n": typeof types.RunScheduledTaskDocument,
    "\n  query SellerList($options: SellerListOptions) {\n    sellers(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": typeof types.SellerListDocument,
    "\n  query SellerDetail($id: ID!) {\n    seller(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      customFields @customFields(entity: \"Seller\")\n    }\n  }\n": typeof types.SellerDetailDocument,
    "\n  mutation CreateSeller($input: CreateSellerInput!) {\n    createSeller(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateSellerDocument,
    "\n  mutation UpdateSeller($input: UpdateSellerInput!) {\n    updateSeller(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateSellerDocument,
    "\n  mutation DeleteSeller($id: ID!) {\n    deleteSeller(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteSellerDocument,
    "\n  query PickSellerOptions($options: SellerListOptions) {\n    sellers(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": typeof types.PickSellerOptionsDocument,
    "\n  query ServerConfig {\n    globalSettings {\n      id\n      availableLanguages\n      serverConfig {\n        moneyStrategyPrecision\n        permittedAssetTypes\n        permissions {\n          name\n          description\n          assignable\n        }\n        orderProcess {\n          name\n          to\n        }\n        entityCustomFields {\n          entityName\n          customFields {\n            __typename\n            ... on CustomField {\n              name\n              type\n              list\n              readonly\n              internal\n              nullable\n              requiresPermission\n              ui\n              label {\n                languageCode\n                value\n              }\n              description {\n                languageCode\n                value\n              }\n            }\n            ... on StringCustomFieldConfig {\n              pattern\n              length\n              options {\n                value\n                label {\n                  languageCode\n                  value\n                }\n              }\n            }\n            ... on LocaleStringCustomFieldConfig {\n              pattern\n              length\n            }\n            ... on IntCustomFieldConfig {\n              intMin: min\n              intMax: max\n              intStep: step\n            }\n            ... on FloatCustomFieldConfig {\n              floatMin: min\n              floatMax: max\n              floatStep: step\n            }\n            ... on DateTimeCustomFieldConfig {\n              datetimeMin: min\n              datetimeMax: max\n            }\n            ... on RelationCustomFieldConfig {\n              entity\n              scalarFields\n            }\n            ... on StructCustomFieldConfig {\n              fields {\n                ... on StructField {\n                  name\n                  type\n                  list\n                  label {\n                    languageCode\n                    value\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ServerConfigDocument,
    "\n  query ShippingMethodList($options: ShippingMethodListOptions) {\n    shippingMethods(options: $options) {\n      items {\n        id\n        code\n        name\n        fulfillmentHandlerCode\n      }\n      totalItems\n    }\n  }\n": typeof types.ShippingMethodListDocument,
    "\n  query ShippingMethodDetail($id: ID!) {\n    shippingMethod(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      description\n      fulfillmentHandlerCode\n      checker {\n        code\n        args {\n          name\n          value\n        }\n      }\n      calculator {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"ShippingMethod\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"ShippingMethod\")\n    }\n  }\n": typeof types.ShippingMethodDetailDocument,
    "\n  query ShippingMethodOperations {\n    shippingEligibilityCheckers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    shippingCalculators {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    fulfillmentHandlers {\n      code\n      description\n    }\n  }\n": typeof types.ShippingMethodOperationsDocument,
    "\n  mutation CreateShippingMethod($input: CreateShippingMethodInput!) {\n    createShippingMethod(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateShippingMethodDocument,
    "\n  mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {\n    updateShippingMethod(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateShippingMethodDocument,
    "\n  mutation DeleteShippingMethod($id: ID!) {\n    deleteShippingMethod(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteShippingMethodDocument,
    "\n  query TestShippingMethod($input: TestShippingMethodInput!) {\n    testShippingMethod(input: $input) {\n      eligible\n      quote {\n        price\n        priceWithTax\n        metadata\n      }\n    }\n  }\n": typeof types.TestShippingMethodDocument,
    "\n  query TestEligibleShippingMethods($input: TestEligibleShippingMethodsInput!) {\n    testEligibleShippingMethods(input: $input) {\n      id\n      code\n      name\n      price\n      priceWithTax\n    }\n  }\n": typeof types.TestEligibleShippingMethodsDocument,
    "\n  query StockLocationList($options: StockLocationListOptions) {\n    stockLocations(options: $options) {\n      items {\n        id\n        name\n        description\n      }\n      totalItems\n    }\n  }\n": typeof types.StockLocationListDocument,
    "\n  query StockLocationDetail($id: ID!) {\n    stockLocation(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      customFields @customFields(entity: \"StockLocation\")\n    }\n  }\n": typeof types.StockLocationDetailDocument,
    "\n  mutation CreateStockLocation($input: CreateStockLocationInput!) {\n    createStockLocation(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateStockLocationDocument,
    "\n  mutation UpdateStockLocation($input: UpdateStockLocationInput!) {\n    updateStockLocation(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateStockLocationDocument,
    "\n  mutation DeleteStockLocation($input: DeleteStockLocationInput!) {\n    deleteStockLocation(input: $input) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteStockLocationDocument,
    "\n  query PickStockLocationOptions($options: StockLocationListOptions) {\n    stockLocations(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": typeof types.PickStockLocationOptionsDocument,
    "\n  query TaxCategoryList($options: TaxCategoryListOptions) {\n    taxCategories(options: $options) {\n      items {\n        id\n        name\n        isDefault\n      }\n      totalItems\n    }\n  }\n": typeof types.TaxCategoryListDocument,
    "\n  query TaxCategoryDetail($id: ID!) {\n    taxCategory(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      isDefault\n      customFields @customFields(entity: \"TaxCategory\")\n    }\n  }\n": typeof types.TaxCategoryDetailDocument,
    "\n  mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {\n    createTaxCategory(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateTaxCategoryDocument,
    "\n  mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {\n    updateTaxCategory(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateTaxCategoryDocument,
    "\n  mutation DeleteTaxCategory($id: ID!) {\n    deleteTaxCategory(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteTaxCategoryDocument,
    "\n  query TaxRateList($options: TaxRateListOptions) {\n    taxRates(options: $options) {\n      items {\n        id\n        name\n        enabled\n        value\n        category {\n          id\n          name\n        }\n        zone {\n          id\n          name\n        }\n        customerGroup {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.TaxRateListDocument,
    "\n  query TaxRateDetail($id: ID!) {\n    taxRate(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      enabled\n      value\n      category {\n        id\n        name\n      }\n      zone {\n        id\n        name\n      }\n      customerGroup {\n        id\n        name\n      }\n      customFields @customFields(entity: \"TaxRate\")\n    }\n  }\n": typeof types.TaxRateDetailDocument,
    "\n  query TaxRateOptions {\n    taxCategories(options: { take: 100, sort: { name: ASC } }) {\n      items {\n        id\n        name\n      }\n    }\n    zones(options: { take: 100, sort: { name: ASC } }) {\n      items {\n        id\n        name\n      }\n    }\n  }\n": typeof types.TaxRateOptionsDocument,
    "\n  mutation CreateTaxRate($input: CreateTaxRateInput!) {\n    createTaxRate(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateTaxRateDocument,
    "\n  mutation UpdateTaxRate($input: UpdateTaxRateInput!) {\n    updateTaxRate(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateTaxRateDocument,
    "\n  mutation DeleteTaxRate($id: ID!) {\n    deleteTaxRate(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteTaxRateDocument,
    "\n  query VariantList($options: ProductVariantListOptions, $productId: ID) {\n    productVariants(options: $options, productId: $productId) {\n      items {\n        id\n        name\n        sku\n        enabled\n        priceWithTax\n        currencyCode\n        featuredAsset {\n          id\n          preview\n        }\n        product {\n          id\n          name\n          featuredAsset {\n            id\n            preview\n          }\n        }\n        stockLevels {\n          id\n          stockOnHand\n          stockAllocated\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.VariantListDocument,
    "\n  query VariantDetail($id: ID!) {\n    productVariant(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      name\n      sku\n      enabled\n      price\n      priceWithTax\n      currencyCode\n      trackInventory\n      outOfStockThreshold\n      useGlobalOutOfStockThreshold\n      taxCategory {\n        id\n        name\n      }\n      stockLevels {\n        id\n        stockLocationId\n        stockOnHand\n        stockAllocated\n        stockLocation {\n          id\n          name\n        }\n      }\n      options {\n        id\n        code\n        name\n        group {\n          id\n          name\n        }\n      }\n      facetValues {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      product {\n        id\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      translations @customFields(entity: \"ProductVariant\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ProductVariant\")\n    }\n  }\n": typeof types.VariantDetailDocument,
    "\n  query VariantFormData {\n    taxCategories(options: { take: 100 }) {\n      items {\n        id\n        name\n        isDefault\n      }\n    }\n    stockLocations(options: { take: 100 }) {\n      items {\n        id\n        name\n      }\n    }\n    globalSettings {\n      id\n      trackInventory\n      outOfStockThreshold\n    }\n  }\n": typeof types.VariantFormDataDocument,
    "\n  query VariantProduct($id: ID!) {\n    product(id: $id) {\n      id\n      name\n      optionGroups {\n        id\n        name\n        options {\n          id\n          code\n          name\n        }\n      }\n    }\n  }\n": typeof types.VariantProductDocument,
    "\n  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {\n    createProductVariants(input: $input) {\n      id\n      name\n      sku\n    }\n  }\n": typeof types.CreateProductVariantsDocument,
    "\n  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {\n    updateProductVariant(input: $input) {\n      id\n      updatedAt\n    }\n  }\n": typeof types.UpdateProductVariantDocument,
    "\n  mutation DeleteProductVariant($id: ID!) {\n    deleteProductVariant(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteProductVariantDocument,
    "\n  query ZoneList($options: ZoneListOptions) {\n    zones(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": typeof types.ZoneListDocument,
    "\n  query ZoneDetail($id: ID!) {\n    zone(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      members {\n        id\n        code\n        name\n        enabled\n      }\n      customFields @customFields(entity: \"Zone\")\n    }\n  }\n": typeof types.ZoneDetailDocument,
    "\n  mutation CreateZone($input: CreateZoneInput!) {\n    createZone(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateZoneDocument,
    "\n  mutation UpdateZone($input: UpdateZoneInput!) {\n    updateZone(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateZoneDocument,
    "\n  mutation DeleteZone($id: ID!) {\n    deleteZone(id: $id) {\n      result\n      message\n    }\n  }\n": typeof types.DeleteZoneDocument,
    "\n  mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {\n    addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {\n      id\n    }\n  }\n": typeof types.AddMembersToZoneDocument,
    "\n  mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {\n    removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {\n      id\n    }\n  }\n": typeof types.RemoveMembersFromZoneDocument,
    "\n  query PickProducts($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        slug\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.PickProductsDocument,
    "\n  query PickVariants($options: ProductVariantListOptions) {\n    productVariants(options: $options) {\n      items {\n        id\n        name\n        sku\n        priceWithTax\n        currencyCode\n        featuredAsset {\n          id\n          preview\n        }\n        product {\n          id\n          featuredAsset {\n            id\n            preview\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.PickVariantsDocument,
    "\n  query PickCustomers($options: CustomerListOptions) {\n    customers(options: $options) {\n      items {\n        id\n        firstName\n        lastName\n        emailAddress\n      }\n      totalItems\n    }\n  }\n": typeof types.PickCustomersDocument,
    "\n  query PickFacetValues($options: FacetValueListOptions) {\n    facetValues(options: $options) {\n      items {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.PickFacetValuesDocument,
    "\n  query PickCustomerGroups($options: CustomerGroupListOptions) {\n    customerGroups(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": typeof types.PickCustomerGroupsDocument,
    "\n  query PickCollections($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        name\n        slug\n        breadcrumbs {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": typeof types.PickCollectionsDocument,
    "\n  query PickAssets($options: AssetListOptions) {\n    assets(options: $options) {\n      items {\n        id\n        name\n        preview\n      }\n      totalItems\n    }\n  }\n": typeof types.PickAssetsDocument,
    "\n  query PickCountries($options: CountryListOptions) {\n    countries(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n      }\n      totalItems\n    }\n  }\n": typeof types.PickCountriesDocument,
};
const documents: Documents = {
    "\n  query AdministratorList($options: AdministratorListOptions) {\n    administrators(options: $options) {\n      items {\n        id\n        firstName\n        lastName\n        emailAddress\n        user {\n          id\n          roles {\n            id\n            code\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": types.AdministratorListDocument,
    "\n  query AdministratorDetail($id: ID!) {\n    administrator(id: $id) {\n      id\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      emailAddress\n      user {\n        id\n        identifier\n        lastLogin\n        roles {\n          id\n          code\n          description\n          channels {\n            id\n            code\n          }\n        }\n      }\n      customFields @customFields(entity: \"Administrator\")\n    }\n  }\n": types.AdministratorDetailDocument,
    "\n  mutation CreateAdministrator($input: CreateAdministratorInput!) {\n    createAdministrator(input: $input) {\n      id\n    }\n  }\n": types.CreateAdministratorDocument,
    "\n  mutation UpdateAdministrator($input: UpdateAdministratorInput!) {\n    updateAdministrator(input: $input) {\n      id\n    }\n  }\n": types.UpdateAdministratorDocument,
    "\n  mutation DeleteAdministrator($id: ID!) {\n    deleteAdministrator(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteAdministratorDocument,
    "\n  query ApiKeyList($options: ApiKeyListOptions) {\n    apiKeys(options: $options) {\n      items {\n        id\n        name\n        lookupId\n        lastUsedAt\n      }\n      totalItems\n    }\n  }\n": types.ApiKeyListDocument,
    "\n  query ApiKeyDetail($id: ID!) {\n    apiKey(id: $id) {\n      id\n      createdAt\n      updatedAt\n      lookupId\n      lastUsedAt\n      name\n      owner {\n        id\n        identifier\n      }\n      user {\n        id\n        roles {\n          id\n          code\n          description\n        }\n      }\n      translations {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ApiKey\")\n    }\n  }\n": types.ApiKeyDetailDocument,
    "\n  query ActiveAdministratorRoles {\n    activeAdministrator {\n      id\n      user {\n        id\n        roles {\n          id\n          code\n          description\n        }\n      }\n    }\n  }\n": types.ActiveAdministratorRolesDocument,
    "\n  mutation CreateApiKey($input: CreateApiKeyInput!) {\n    createApiKey(input: $input) {\n      apiKey\n      entityId\n    }\n  }\n": types.CreateApiKeyDocument,
    "\n  mutation UpdateApiKey($input: UpdateApiKeyInput!) {\n    updateApiKey(input: $input) {\n      id\n    }\n  }\n": types.UpdateApiKeyDocument,
    "\n  mutation RotateApiKey($id: ID!) {\n    rotateApiKey(id: $id) {\n      apiKey\n    }\n  }\n": types.RotateApiKeyDocument,
    "\n  mutation DeleteApiKeys($ids: [ID!]!) {\n    deleteApiKeys(ids: $ids) {\n      result\n      message\n    }\n  }\n": types.DeleteApiKeysDocument,
    "\n  query AssetList($options: AssetListOptions) {\n    assets(options: $options) {\n      items {\n        id\n        name\n        preview\n        type\n        mimeType\n      }\n      totalItems\n    }\n  }\n": types.AssetListDocument,
    "\n  query AssetDetail($id: ID!) {\n    asset(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      type\n      fileSize\n      mimeType\n      width\n      height\n      source\n      preview\n      focalPoint {\n        x\n        y\n      }\n      tags {\n        id\n        value\n      }\n      customFields @customFields(entity: \"Asset\")\n    }\n  }\n": types.AssetDetailDocument,
    "\n  query AssetTags($options: TagListOptions) {\n    tags(options: $options) {\n      items {\n        id\n        value\n      }\n      totalItems\n    }\n  }\n": types.AssetTagsDocument,
    "\n  mutation UpdateAsset($input: UpdateAssetInput!) {\n    updateAsset(input: $input) {\n      id\n      updatedAt\n    }\n  }\n": types.UpdateAssetDocument,
    "\n  mutation DeleteAssets($input: DeleteAssetsInput!) {\n    deleteAssets(input: $input) {\n      result\n      message\n    }\n  }\n": types.DeleteAssetsDocument,
    "\n  mutation CreateAssets($input: [CreateAssetInput!]!) {\n    createAssets(input: $input) {\n      ... on Asset {\n        __typename\n        id\n        name\n        preview\n        mimeType\n      }\n      ... on MimeTypeError {\n        __typename\n        errorCode\n        message\n        fileName\n        mimeType\n      }\n    }\n  }\n": types.CreateAssetsDocument,
    "\n  mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {\n    login(username: $username, password: $password, rememberMe: $rememberMe) {\n      __typename\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout {\n      success\n    }\n  }\n": types.LogoutDocument,
    "\n  query CurrentUser {\n    me {\n      id\n      identifier\n      channels {\n        id\n        code\n        token\n        permissions\n      }\n    }\n    activeAdministrator {\n      id\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n": types.CurrentUserDocument,
    "\n  query ActiveChannel {\n    activeChannel {\n      id\n      code\n      token\n      defaultCurrencyCode\n      defaultLanguageCode\n      pricesIncludeTax\n    }\n    globalSettings {\n      id\n      serverConfig {\n        moneyStrategyPrecision\n      }\n    }\n  }\n": types.ActiveChannelDocument,
    "\n  query ChannelList($options: ChannelListOptions) {\n    channels(options: $options) {\n      items {\n        id\n        code\n        defaultLanguageCode\n        defaultCurrencyCode\n        pricesIncludeTax\n        seller {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": types.ChannelListDocument,
    "\n  query ChannelDetail($id: ID!) {\n    channel(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      token\n      pricesIncludeTax\n      availableCurrencyCodes\n      availableLanguageCodes\n      defaultCurrencyCode\n      defaultLanguageCode\n      trackInventory\n      outOfStockThreshold\n      defaultShippingZone {\n        id\n        name\n      }\n      defaultTaxZone {\n        id\n        name\n      }\n      seller {\n        id\n        name\n      }\n      customFields @customFields(entity: \"Channel\")\n    }\n  }\n": types.ChannelDetailDocument,
    "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      __typename\n      ... on Channel {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.CreateChannelDocument,
    "\n  mutation UpdateChannel($input: UpdateChannelInput!) {\n    updateChannel(input: $input) {\n      __typename\n      ... on Channel {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.UpdateChannelDocument,
    "\n  mutation DeleteChannel($id: ID!) {\n    deleteChannel(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteChannelDocument,
    "\n  query PickZoneOptions($options: ZoneListOptions) {\n    zones(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": types.PickZoneOptionsDocument,
    "\n  query CollectionList($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        name\n        slug\n        isPrivate\n        parentId\n        position\n        productVariantCount\n        featuredAsset {\n          id\n          preview\n        }\n        breadcrumbs {\n          id\n          name\n        }\n        children {\n          id\n        }\n      }\n      totalItems\n    }\n  }\n": types.CollectionListDocument,
    "\n  query CollectionDetail($id: ID!) {\n    collection(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      name\n      slug\n      description\n      isPrivate\n      inheritFilters\n      position\n      parentId\n      breadcrumbs {\n        id\n        name\n      }\n      parent {\n        id\n        name\n      }\n      children {\n        id\n        name\n      }\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      filters {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"Collection\", locale: true) {\n        id\n        languageCode\n        name\n        slug\n        description\n      }\n      customFields @customFields(entity: \"Collection\")\n    }\n  }\n": types.CollectionDetailDocument,
    "\n  query CollectionContents($id: ID!, $options: ProductVariantListOptions) {\n    collection(id: $id) {\n      id\n      productVariants(options: $options) {\n        totalItems\n        items {\n          id\n          name\n          sku\n          featuredAsset {\n            id\n            preview\n          }\n          product {\n            id\n            featuredAsset {\n              id\n              preview\n            }\n          }\n        }\n      }\n    }\n  }\n": types.CollectionContentsDocument,
    "\n  query CollectionFilters {\n    collectionFilters {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": types.CollectionFiltersDocument,
    "\n  mutation CreateCollection($input: CreateCollectionInput!) {\n    createCollection(input: $input) {\n      id\n    }\n  }\n": types.CreateCollectionDocument,
    "\n  mutation UpdateCollection($input: UpdateCollectionInput!) {\n    updateCollection(input: $input) {\n      id\n      updatedAt\n    }\n  }\n": types.UpdateCollectionDocument,
    "\n  mutation MoveCollection($input: MoveCollectionInput!) {\n    moveCollection(input: $input) {\n      id\n      parentId\n    }\n  }\n": types.MoveCollectionDocument,
    "\n  mutation DeleteCollection($id: ID!) {\n    deleteCollection(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteCollectionDocument,
    "\n  query CountryList($options: CountryListOptions) {\n    countries(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n      }\n      totalItems\n    }\n  }\n": types.CountryListDocument,
    "\n  query CountryDetail($id: ID!) {\n    country(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      enabled\n      translations @customFields(entity: \"Country\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"Country\")\n    }\n  }\n": types.CountryDetailDocument,
    "\n  mutation CreateCountry($input: CreateCountryInput!) {\n    createCountry(input: $input) {\n      id\n    }\n  }\n": types.CreateCountryDocument,
    "\n  mutation UpdateCountry($input: UpdateCountryInput!) {\n    updateCountry(input: $input) {\n      id\n    }\n  }\n": types.UpdateCountryDocument,
    "\n  mutation DeleteCountry($id: ID!) {\n    deleteCountry(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteCountryDocument,
    "\n  query CustomerGroupList($options: CustomerGroupListOptions) {\n    customerGroups(options: $options) {\n      items {\n        id\n        name\n        customers {\n          totalItems\n        }\n      }\n      totalItems\n    }\n  }\n": types.CustomerGroupListDocument,
    "\n  query CustomerGroupDetail($id: ID!) {\n    customerGroup(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      customFields @customFields(entity: \"CustomerGroup\")\n    }\n  }\n": types.CustomerGroupDetailDocument,
    "\n  query CustomerGroupMembers($id: ID!, $options: CustomerListOptions) {\n    customerGroup(id: $id) {\n      id\n      customers(options: $options) {\n        items {\n          id\n          firstName\n          lastName\n          emailAddress\n        }\n        totalItems\n      }\n    }\n  }\n": types.CustomerGroupMembersDocument,
    "\n  mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {\n    createCustomerGroup(input: $input) {\n      id\n    }\n  }\n": types.CreateCustomerGroupDocument,
    "\n  mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {\n    updateCustomerGroup(input: $input) {\n      id\n    }\n  }\n": types.UpdateCustomerGroupDocument,
    "\n  mutation DeleteCustomerGroup($id: ID!) {\n    deleteCustomerGroup(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteCustomerGroupDocument,
    "\n  mutation AddCustomersToGroup($customerGroupId: ID!, $customerIds: [ID!]!) {\n    addCustomersToGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {\n      id\n    }\n  }\n": types.AddCustomersToGroupDocument,
    "\n  mutation RemoveCustomersFromGroup($customerGroupId: ID!, $customerIds: [ID!]!) {\n    removeCustomersFromGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {\n      id\n    }\n  }\n": types.RemoveCustomersFromGroupDocument,
    "\n  query CustomerList($options: CustomerListOptions) {\n    customers(options: $options) {\n      items {\n        id\n        createdAt\n        title\n        firstName\n        lastName\n        emailAddress\n        phoneNumber\n        user {\n          id\n          verified\n        }\n      }\n      totalItems\n    }\n  }\n": types.CustomerListDocument,
    "\n  fragment CustomerAddress on Address {\n    id\n    fullName\n    company\n    streetLine1\n    streetLine2\n    city\n    province\n    postalCode\n    phoneNumber\n    defaultShippingAddress\n    defaultBillingAddress\n    country {\n      id\n      code\n      name\n    }\n    customFields @customFields(entity: \"Address\")\n  }\n": types.CustomerAddressFragmentDoc,
    "\n  query CustomerDetail($id: ID!) {\n    customer(id: $id) {\n      id\n      createdAt\n      updatedAt\n      title\n      firstName\n      lastName\n      phoneNumber\n      emailAddress\n      groups {\n        id\n        name\n      }\n      user {\n        id\n        identifier\n        verified\n        lastLogin\n      }\n      addresses {\n        ...CustomerAddress\n      }\n      customFields @customFields(entity: \"Customer\")\n    }\n  }\n": types.CustomerDetailDocument,
    "\n  query CustomerOrders($customerId: ID!, $options: OrderListOptions) {\n    customer(id: $customerId) {\n      id\n      orders(options: $options) {\n        items {\n          ...OrderListItem\n        }\n        totalItems\n      }\n    }\n  }\n": types.CustomerOrdersDocument,
    "\n  query CustomerHistory($id: ID!, $options: HistoryEntryListOptions) {\n    activeAdministrator {\n      id\n    }\n    customer(id: $id) {\n      id\n      history(options: $options) {\n        totalItems\n        items {\n          id\n          type\n          createdAt\n          isPublic\n          data\n          administrator {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n": types.CustomerHistoryDocument,
    "\n  mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {\n    createCustomer(input: $input, password: $password) {\n      __typename\n      ... on Customer {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.CreateCustomerDocument,
    "\n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      __typename\n      ... on Customer {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.UpdateCustomerDocument,
    "\n  mutation DeleteCustomer($id: ID!) {\n    deleteCustomer(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteCustomerDocument,
    "\n  mutation VerifyCustomerAccount($id: ID!, $password: String) {\n    verifyCustomerAccount(id: $id, password: $password) {\n      __typename\n      ... on Customer {\n        id\n        user {\n          id\n          verified\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.VerifyCustomerAccountDocument,
    "\n  mutation CreateCustomerAddress($customerId: ID!, $input: CreateAddressInput!) {\n    createCustomerAddress(customerId: $customerId, input: $input) {\n      id\n    }\n  }\n": types.CreateCustomerAddressDocument,
    "\n  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {\n    updateCustomerAddress(input: $input) {\n      id\n    }\n  }\n": types.UpdateCustomerAddressDocument,
    "\n  mutation DeleteCustomerAddress($id: ID!) {\n    deleteCustomerAddress(id: $id) {\n      success\n    }\n  }\n": types.DeleteCustomerAddressDocument,
    "\n  mutation AddCustomerNote($input: AddNoteToCustomerInput!) {\n    addNoteToCustomer(input: $input) {\n      id\n    }\n  }\n": types.AddCustomerNoteDocument,
    "\n  mutation UpdateCustomerNote($input: UpdateCustomerNoteInput!) {\n    updateCustomerNote(input: $input) {\n      id\n    }\n  }\n": types.UpdateCustomerNoteDocument,
    "\n  mutation DeleteCustomerNote($id: ID!) {\n    deleteCustomerNote(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteCustomerNoteDocument,
    "\n  query DashboardMetrics {\n    metricSummary(input: { interval: Daily, types: [OrderCount, OrderTotal, AverageOrderValue] }) {\n      type\n      title\n      entries {\n        label\n        value\n      }\n    }\n  }\n": types.DashboardMetricsDocument,
    "\n  query DashboardOrders($today: DateTime!, $monthStart: DateTime!) {\n    today: orders(\n      options: {\n        take: 0\n        filter: { active: { eq: false }, orderPlacedAt: { after: $today }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n    }\n    month: orders(\n      options: {\n        take: 0\n        filter: { active: { eq: false }, orderPlacedAt: { after: $monthStart }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n    }\n    latest: orders(\n      options: {\n        take: 6\n        sort: { orderPlacedAt: DESC }\n        filter: { active: { eq: false }, state: { notIn: [\"Draft\"] } }\n      }\n    ) {\n      items {\n        ...OrderListItem\n      }\n    }\n  }\n": types.DashboardOrdersDocument,
    "\n  query DashboardOrderTotals($since: DateTime!, $take: Int!) {\n    orders(\n      options: {\n        take: $take\n        sort: { orderPlacedAt: DESC }\n        filter: { active: { eq: false }, orderPlacedAt: { after: $since }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n      items {\n        id\n        orderPlacedAt\n        totalWithTax\n      }\n    }\n  }\n": types.DashboardOrderTotalsDocument,
    "\n  query DraftOrderDetail($id: ID!) {\n    order(id: $id) {\n      id\n      code\n      state\n      active\n      createdAt\n      updatedAt\n      currencyCode\n      totalQuantity\n      subTotalWithTax\n      shippingWithTax\n      total\n      totalWithTax\n      couponCodes\n      nextStates\n      customer {\n        id\n        firstName\n        lastName\n        emailAddress\n        addresses {\n          id\n          fullName\n          company\n          streetLine1\n          streetLine2\n          city\n          province\n          postalCode\n          phoneNumber\n          defaultShippingAddress\n          defaultBillingAddress\n          country {\n            id\n            code\n            name\n          }\n        }\n      }\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        linePriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          id\n          name\n          sku\n        }\n      }\n      discounts {\n        description\n        amountWithTax\n      }\n      promotions {\n        id\n        name\n        couponCode\n      }\n      shippingLines {\n        id\n        priceWithTax\n        shippingMethod {\n          id\n          name\n        }\n      }\n      shippingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      billingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      customFields @customFields(entity: \"Order\")\n    }\n  }\n": types.DraftOrderDetailDocument,
    "\n  mutation CreateDraftOrder {\n    createDraftOrder {\n      id\n    }\n  }\n": types.CreateDraftOrderDocument,
    "\n  mutation DeleteDraftOrder($orderId: ID!) {\n    deleteDraftOrder(orderId: $orderId) {\n      result\n      message\n    }\n  }\n": types.DeleteDraftOrderDocument,
    "\n  mutation AddItemToDraftOrder($orderId: ID!, $input: AddItemToDraftOrderInput!) {\n    addItemToDraftOrder(orderId: $orderId, input: $input) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AddItemToDraftOrderDocument,
    "\n  mutation AdjustDraftOrderLine($orderId: ID!, $input: AdjustDraftOrderLineInput!) {\n    adjustDraftOrderLine(orderId: $orderId, input: $input) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AdjustDraftOrderLineDocument,
    "\n  mutation RemoveDraftOrderLine($orderId: ID!, $orderLineId: ID!) {\n    removeDraftOrderLine(orderId: $orderId, orderLineId: $orderLineId) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.RemoveDraftOrderLineDocument,
    "\n  mutation SetCustomerForDraftOrder($orderId: ID!, $customerId: ID, $input: CreateCustomerInput) {\n    setCustomerForDraftOrder(orderId: $orderId, customerId: $customerId, input: $input) {\n      __typename\n      ... on Order {\n        id\n        customer {\n          id\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetCustomerForDraftOrderDocument,
    "\n  mutation SetDraftOrderShippingAddress($orderId: ID!, $input: CreateAddressInput!) {\n    setDraftOrderShippingAddress(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n": types.SetDraftOrderShippingAddressDocument,
    "\n  mutation SetDraftOrderBillingAddress($orderId: ID!, $input: CreateAddressInput!) {\n    setDraftOrderBillingAddress(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n": types.SetDraftOrderBillingAddressDocument,
    "\n  mutation UnsetDraftOrderShippingAddress($orderId: ID!) {\n    unsetDraftOrderShippingAddress(orderId: $orderId) {\n      id\n    }\n  }\n": types.UnsetDraftOrderShippingAddressDocument,
    "\n  mutation UnsetDraftOrderBillingAddress($orderId: ID!) {\n    unsetDraftOrderBillingAddress(orderId: $orderId) {\n      id\n    }\n  }\n": types.UnsetDraftOrderBillingAddressDocument,
    "\n  query DraftOrderEligibleShippingMethods($orderId: ID!) {\n    eligibleShippingMethodsForDraftOrder(orderId: $orderId) {\n      id\n      name\n      code\n      description\n      price\n      priceWithTax\n    }\n  }\n": types.DraftOrderEligibleShippingMethodsDocument,
    "\n  mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {\n    setDraftOrderShippingMethod(orderId: $orderId, shippingMethodId: $shippingMethodId) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetDraftOrderShippingMethodDocument,
    "\n  mutation ApplyCouponCodeToDraftOrder($orderId: ID!, $couponCode: String!) {\n    applyCouponCodeToDraftOrder(orderId: $orderId, couponCode: $couponCode) {\n      __typename\n      ... on Order {\n        id\n        couponCodes\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.ApplyCouponCodeToDraftOrderDocument,
    "\n  mutation RemoveCouponCodeFromDraftOrder($orderId: ID!, $couponCode: String!) {\n    removeCouponCodeFromDraftOrder(orderId: $orderId, couponCode: $couponCode) {\n      id\n      couponCodes\n    }\n  }\n": types.RemoveCouponCodeFromDraftOrderDocument,
    "\n  mutation SetDraftOrderCustomFields($orderId: ID!, $input: UpdateOrderInput!) {\n    setDraftOrderCustomFields(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n": types.SetDraftOrderCustomFieldsDocument,
    "\n  query DraftOrderVariants($options: ProductVariantListOptions) {\n    productVariants(options: $options) {\n      items {\n        id\n        name\n        sku\n        stockLevel\n      }\n      totalItems\n    }\n  }\n": types.DraftOrderVariantsDocument,
    "\n  query FacetList($options: FacetListOptions) {\n    facets(options: $options) {\n      items {\n        id\n        code\n        name\n        isPrivate\n        valueList(options: { take: 5 }) {\n          totalItems\n          items {\n            id\n            name\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": types.FacetListDocument,
    "\n  query FacetDetail($id: ID!) {\n    facet(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      isPrivate\n      translations @customFields(entity: \"Facet\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"Facet\")\n      values {\n        id\n        code\n        name\n        languageCode\n        translations @customFields(entity: \"FacetValue\", locale: true) {\n          id\n          languageCode\n          name\n        }\n        customFields @customFields(entity: \"FacetValue\")\n      }\n    }\n  }\n": types.FacetDetailDocument,
    "\n  mutation CreateFacet($input: CreateFacetInput!) {\n    createFacet(input: $input) {\n      id\n    }\n  }\n": types.CreateFacetDocument,
    "\n  mutation UpdateFacet($input: UpdateFacetInput!) {\n    updateFacet(input: $input) {\n      id\n    }\n  }\n": types.UpdateFacetDocument,
    "\n  mutation DeleteFacet($id: ID!, $force: Boolean) {\n    deleteFacet(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n": types.DeleteFacetDocument,
    "\n  mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {\n    createFacetValues(input: $input) {\n      id\n    }\n  }\n": types.CreateFacetValuesDocument,
    "\n  mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {\n    updateFacetValues(input: $input) {\n      id\n    }\n  }\n": types.UpdateFacetValuesDocument,
    "\n  mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {\n    deleteFacetValues(ids: $ids, force: $force) {\n      result\n      message\n    }\n  }\n": types.DeleteFacetValuesDocument,
    "\n  query GlobalSettingsDetail {\n    globalSettings {\n      id\n      updatedAt\n      availableLanguages\n      trackInventory\n      outOfStockThreshold\n      customFields @customFields(entity: \"GlobalSettings\")\n    }\n  }\n": types.GlobalSettingsDetailDocument,
    "\n  mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {\n    updateGlobalSettings(input: $input) {\n      __typename\n      ... on GlobalSettings {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.UpdateGlobalSettingsDocument,
    "\n  query JobList($options: JobListOptions) {\n    jobs(options: $options) {\n      items {\n        id\n        queueName\n        state\n        progress\n        createdAt\n        settledAt\n        duration\n      }\n      totalItems\n    }\n  }\n": types.JobListDocument,
    "\n  query JobDetail($id: ID!) {\n    job(jobId: $id) {\n      id\n      queueName\n      state\n      progress\n      createdAt\n      startedAt\n      settledAt\n      isSettled\n      duration\n      data\n      result\n      error\n      retries\n      attempts\n    }\n  }\n": types.JobDetailDocument,
    "\n  query JobQueueList {\n    jobQueues {\n      name\n      running\n    }\n  }\n": types.JobQueueListDocument,
    "\n  mutation CancelJob($jobId: ID!) {\n    cancelJob(jobId: $jobId) {\n      id\n      state\n    }\n  }\n": types.CancelJobDocument,
    "\n  mutation RebuildSearchIndex {\n    reindex {\n      id\n      queueName\n      state\n    }\n  }\n": types.RebuildSearchIndexDocument,
    "\n  query ActiveJobCount($filter: JobFilterParameter) {\n    jobs(options: { take: 1, filter: $filter }) {\n      totalItems\n    }\n  }\n": types.ActiveJobCountDocument,
    "\n  query OptionGroupList($options: ProductOptionGroupListOptions) {\n    productOptionGroups(options: $options) {\n      items {\n        id\n        code\n        name\n        productCount\n        options {\n          id\n        }\n      }\n      totalItems\n    }\n  }\n": types.OptionGroupListDocument,
    "\n  query OptionGroupDetail($id: ID!) {\n    productOptionGroup(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      productCount\n      translations @customFields(entity: \"ProductOptionGroup\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ProductOptionGroup\")\n      options {\n        id\n        code\n        name\n        languageCode\n        translations @customFields(entity: \"ProductOption\", locale: true) {\n          id\n          languageCode\n          name\n        }\n        customFields @customFields(entity: \"ProductOption\")\n      }\n    }\n  }\n": types.OptionGroupDetailDocument,
    "\n  mutation CreateOptionGroup($input: CreateProductOptionGroupInput!) {\n    createProductOptionGroup(input: $input) {\n      id\n    }\n  }\n": types.CreateOptionGroupDocument,
    "\n  mutation UpdateOptionGroup($input: UpdateProductOptionGroupInput!) {\n    updateProductOptionGroup(input: $input) {\n      id\n    }\n  }\n": types.UpdateOptionGroupDocument,
    "\n  mutation DeleteOptionGroup($id: ID!, $force: Boolean) {\n    deleteProductOptionGroup(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n": types.DeleteOptionGroupDocument,
    "\n  mutation CreateProductOption($input: CreateProductOptionInput!) {\n    createProductOption(input: $input) {\n      id\n    }\n  }\n": types.CreateProductOptionDocument,
    "\n  mutation UpdateProductOption($input: UpdateProductOptionInput!) {\n    updateProductOption(input: $input) {\n      id\n    }\n  }\n": types.UpdateProductOptionDocument,
    "\n  mutation DeleteProductOption($id: ID!) {\n    deleteProductOption(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteProductOptionDocument,
    "\n  fragment OrderListItem on Order {\n    id\n    code\n    state\n    active\n    orderPlacedAt\n    updatedAt\n    totalWithTax\n    currencyCode\n    customer {\n      id\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n": types.OrderListItemFragmentDoc,
    "\n  query OrderList($options: OrderListOptions) {\n    orders(options: $options) {\n      items {\n        ...OrderListItem\n      }\n      totalItems\n    }\n  }\n": types.OrderListDocument,
    "\n  query OrderDetail($id: ID!) {\n    order(id: $id) {\n      id\n      code\n      state\n      active\n      type\n      createdAt\n      updatedAt\n      orderPlacedAt\n      currencyCode\n      totalQuantity\n      subTotal\n      subTotalWithTax\n      shipping\n      shippingWithTax\n      total\n      totalWithTax\n      nextStates\n      couponCodes\n      customer {\n        id\n        firstName\n        lastName\n        emailAddress\n        phoneNumber\n      }\n      shippingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      billingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      lines {\n        id\n        quantity\n        orderPlacedQuantity\n        unitPriceWithTax\n        proratedUnitPriceWithTax\n        linePriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          id\n          name\n          sku\n        }\n        fulfillmentLines {\n          fulfillmentId\n          quantity\n        }\n        customFields @customFields(entity: \"OrderLine\")\n      }\n      discounts {\n        description\n        amountWithTax\n      }\n      promotions {\n        id\n        name\n        couponCode\n      }\n      surcharges {\n        id\n        description\n        priceWithTax\n      }\n      shippingLines {\n        id\n        priceWithTax\n        discountedPriceWithTax\n        shippingMethod {\n          id\n          name\n          code\n          fulfillmentHandlerCode\n        }\n      }\n      payments {\n        id\n        method\n        amount\n        state\n        nextStates\n        transactionId\n        errorMessage\n        metadata\n        createdAt\n        refunds {\n          id\n          createdAt\n          state\n          total\n          items\n          shipping\n          adjustment\n          reason\n          transactionId\n          method\n          metadata\n          lines {\n            orderLineId\n            quantity\n          }\n        }\n      }\n      fulfillments {\n        id\n        state\n        nextStates\n        method\n        trackingCode\n        createdAt\n        updatedAt\n        lines {\n          orderLineId\n          quantity\n        }\n      }\n      modifications {\n        id\n        createdAt\n        priceChange\n        note\n        isSettled\n      }\n      customFields @customFields(entity: \"Order\")\n    }\n  }\n": types.OrderDetailDocument,
    "\n  query OrderHistory($id: ID!, $options: HistoryEntryListOptions) {\n    activeAdministrator {\n      id\n    }\n    order(id: $id) {\n      id\n      history(options: $options) {\n        totalItems\n        items {\n          id\n          type\n          createdAt\n          isPublic\n          data\n          administrator {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n": types.OrderHistoryDocument,
    "\n  mutation AddOrderNote($input: AddNoteToOrderInput!) {\n    addNoteToOrder(input: $input) {\n      id\n    }\n  }\n": types.AddOrderNoteDocument,
    "\n  mutation UpdateOrderNote($input: UpdateOrderNoteInput!) {\n    updateOrderNote(input: $input) {\n      id\n    }\n  }\n": types.UpdateOrderNoteDocument,
    "\n  mutation DeleteOrderNote($id: ID!) {\n    deleteOrderNote(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteOrderNoteDocument,
    "\n  mutation TransitionOrderToState($id: ID!, $state: String!) {\n    transitionOrderToState(id: $id, state: $state) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on OrderStateTransitionError {\n        transitionError\n      }\n    }\n  }\n": types.TransitionOrderToStateDocument,
    "\n  query OrderPaymentMethods($options: PaymentMethodListOptions) {\n    paymentMethods(options: $options) {\n      items {\n        id\n        name\n        code\n        enabled\n      }\n      totalItems\n    }\n  }\n": types.OrderPaymentMethodsDocument,
    "\n  mutation AddManualPayment($input: ManualPaymentInput!) {\n    addManualPaymentToOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AddManualPaymentDocument,
    "\n  mutation SettlePayment($id: ID!) {\n    settlePayment(id: $id) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SettlePaymentDocument,
    "\n  mutation CancelPayment($id: ID!) {\n    cancelPayment(id: $id) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.CancelPaymentDocument,
    "\n  mutation TransitionPaymentToState($id: ID!, $state: String!) {\n    transitionPaymentToState(id: $id, state: $state) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.TransitionPaymentToStateDocument,
    "\n  query FulfillmentHandlers {\n    fulfillmentHandlers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": types.FulfillmentHandlersDocument,
    "\n  mutation FulfillOrder($input: FulfillOrderInput!) {\n    addFulfillmentToOrder(input: $input) {\n      __typename\n      ... on Fulfillment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.FulfillOrderDocument,
    "\n  mutation TransitionFulfillment($id: ID!, $state: String!) {\n    transitionFulfillmentToState(id: $id, state: $state) {\n      __typename\n      ... on Fulfillment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.TransitionFulfillmentDocument,
    "\n  mutation CancelOrder($input: CancelOrderInput!) {\n    cancelOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.CancelOrderDocument,
    "\n  mutation RefundOrder($input: RefundOrderInput!) {\n    refundOrder(input: $input) {\n      __typename\n      ... on Refund {\n        id\n        state\n        total\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.RefundOrderDocument,
    "\n  mutation SettleRefund($input: SettleRefundInput!) {\n    settleRefund(input: $input) {\n      __typename\n      ... on Refund {\n        id\n        state\n        transactionId\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SettleRefundDocument,
    "\n  mutation ModifyOrder($input: ModifyOrderInput!) {\n    modifyOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n        subTotalWithTax\n        shippingWithTax\n        totalWithTax\n        currencyCode\n        lines {\n          id\n          quantity\n          linePriceWithTax\n          productVariant {\n            id\n            name\n          }\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.ModifyOrderDocument,
    "\n  mutation SetOrderCustomFields($input: UpdateOrderInput!) {\n    setOrderCustomFields(input: $input) {\n      id\n    }\n  }\n": types.SetOrderCustomFieldsDocument,
    "\n  query PaymentMethodList($options: PaymentMethodListOptions) {\n    paymentMethods(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n        handler {\n          code\n        }\n      }\n      totalItems\n    }\n  }\n": types.PaymentMethodListDocument,
    "\n  query PaymentMethodDetail($id: ID!) {\n    paymentMethod(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      name\n      description\n      enabled\n      checker {\n        code\n        args {\n          name\n          value\n        }\n      }\n      handler {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"PaymentMethod\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"PaymentMethod\")\n    }\n  }\n": types.PaymentMethodDetailDocument,
    "\n  query PaymentMethodOperations {\n    paymentMethodHandlers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    paymentMethodEligibilityCheckers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": types.PaymentMethodOperationsDocument,
    "\n  mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {\n    createPaymentMethod(input: $input) {\n      id\n    }\n  }\n": types.CreatePaymentMethodDocument,
    "\n  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {\n    updatePaymentMethod(input: $input) {\n      id\n    }\n  }\n": types.UpdatePaymentMethodDocument,
    "\n  mutation DeletePaymentMethod($id: ID!, $force: Boolean) {\n    deletePaymentMethod(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n": types.DeletePaymentMethodDocument,
    "\n  query ProductList($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        slug\n        enabled\n        updatedAt\n        featuredAsset {\n          id\n          preview\n        }\n        variantList(options: { take: 1 }) {\n          totalItems\n          items {\n            id\n            priceWithTax\n            currencyCode\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": types.ProductListDocument,
    "\n  query ProductDetail($id: ID!) {\n    product(id: $id) {\n      id\n      name\n      slug\n      description\n      enabled\n      createdAt\n      updatedAt\n      languageCode\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      channels {\n        id\n        code\n      }\n      optionGroups {\n        id\n        code\n        name\n      }\n      customFields @customFields(entity: \"Product\")\n      translations @customFields(entity: \"Product\", locale: true) {\n        id\n        languageCode\n        name\n        slug\n        description\n      }\n      facetValues {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      variantList(options: { take: 50 }) {\n        totalItems\n        items {\n          id\n          name\n          sku\n          enabled\n          price\n          priceWithTax\n          currencyCode\n          featuredAsset {\n            id\n            preview\n          }\n          options {\n            id\n            name\n          }\n          stockLevels {\n            id\n            stockOnHand\n            stockAllocated\n          }\n        }\n      }\n    }\n  }\n": types.ProductDetailDocument,
    "\n  mutation UpdateProduct($input: UpdateProductInput!) {\n    updateProduct(input: $input) {\n      id\n      name\n      enabled\n      updatedAt\n      translations {\n        id\n        languageCode\n        name\n      }\n    }\n  }\n": types.UpdateProductDocument,
    "\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      id\n      name\n    }\n  }\n": types.CreateProductDocument,
    "\n  mutation DeleteProduct($id: ID!) {\n    deleteProduct(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteProductDocument,
    "\n  mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {\n    assignProductsToChannel(input: $input) {\n      id\n    }\n  }\n": types.AssignProductsToChannelDocument,
    "\n  mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {\n    removeProductsFromChannel(input: $input) {\n      id\n    }\n  }\n": types.RemoveProductsFromChannelDocument,
    "\n  query ProfileDetail {\n    activeAdministrator {\n      id\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      emailAddress\n      user {\n        id\n        identifier\n        lastLogin\n        roles {\n          id\n          code\n          description\n        }\n      }\n      customFields @customFields(entity: \"Administrator\")\n    }\n  }\n": types.ProfileDetailDocument,
    "\n  mutation UpdateProfile($input: UpdateActiveAdministratorInput!) {\n    updateActiveAdministrator(input: $input) {\n      id\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  query PromotionList($options: PromotionListOptions) {\n    promotions(options: $options) {\n      items {\n        id\n        name\n        couponCode\n        enabled\n        startsAt\n        endsAt\n      }\n      totalItems\n    }\n  }\n": types.PromotionListDocument,
    "\n  query PromotionDetail($id: ID!) {\n    promotion(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      enabled\n      couponCode\n      perCustomerUsageLimit\n      usageLimit\n      startsAt\n      endsAt\n      conditions {\n        code\n        args {\n          name\n          value\n        }\n      }\n      actions {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"Promotion\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"Promotion\")\n    }\n  }\n": types.PromotionDetailDocument,
    "\n  query PromotionOperations {\n    promotionConditions {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    promotionActions {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n": types.PromotionOperationsDocument,
    "\n  mutation CreatePromotion($input: CreatePromotionInput!) {\n    createPromotion(input: $input) {\n      ... on Promotion {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.CreatePromotionDocument,
    "\n  mutation UpdatePromotion($input: UpdatePromotionInput!) {\n    updatePromotion(input: $input) {\n      ... on Promotion {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.UpdatePromotionDocument,
    "\n  mutation DeletePromotion($id: ID!) {\n    deletePromotion(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeletePromotionDocument,
    "\n  query RoleList($options: RoleListOptions) {\n    roles(options: $options) {\n      items {\n        id\n        code\n        description\n        permissions\n        channels {\n          id\n          code\n        }\n      }\n      totalItems\n    }\n  }\n": types.RoleListDocument,
    "\n  query RoleDetail($id: ID!) {\n    role(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      description\n      permissions\n      channels {\n        id\n        code\n      }\n      customFields @customFields(entity: \"Role\")\n    }\n  }\n": types.RoleDetailDocument,
    "\n  mutation CreateRole($input: CreateRoleInput!) {\n    createRole(input: $input) {\n      id\n    }\n  }\n": types.CreateRoleDocument,
    "\n  mutation UpdateRole($input: UpdateRoleInput!) {\n    updateRole(input: $input) {\n      id\n    }\n  }\n": types.UpdateRoleDocument,
    "\n  mutation DeleteRole($id: ID!) {\n    deleteRole(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteRoleDocument,
    "\n  query PickRoleOptions($options: RoleListOptions) {\n    roles(options: $options) {\n      items {\n        id\n        code\n        description\n      }\n      totalItems\n    }\n  }\n": types.PickRoleOptionsDocument,
    "\n  query PickChannelOptions($options: ChannelListOptions) {\n    channels(options: $options) {\n      items {\n        id\n        code\n      }\n      totalItems\n    }\n  }\n": types.PickChannelOptionsDocument,
    "\n  query ScheduledTasks {\n    scheduledTasks {\n      id\n      description\n      schedule\n      scheduleDescription\n      timezone\n      lastExecutedAt\n      nextExecutionAt\n      isRunning\n      lastResult\n      enabled\n    }\n  }\n": types.ScheduledTasksDocument,
    "\n  mutation UpdateScheduledTask($input: UpdateScheduledTaskInput!) {\n    updateScheduledTask(input: $input) {\n      id\n      enabled\n    }\n  }\n": types.UpdateScheduledTaskDocument,
    "\n  mutation RunScheduledTask($id: String!) {\n    runScheduledTask(id: $id) {\n      success\n    }\n  }\n": types.RunScheduledTaskDocument,
    "\n  query SellerList($options: SellerListOptions) {\n    sellers(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": types.SellerListDocument,
    "\n  query SellerDetail($id: ID!) {\n    seller(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      customFields @customFields(entity: \"Seller\")\n    }\n  }\n": types.SellerDetailDocument,
    "\n  mutation CreateSeller($input: CreateSellerInput!) {\n    createSeller(input: $input) {\n      id\n    }\n  }\n": types.CreateSellerDocument,
    "\n  mutation UpdateSeller($input: UpdateSellerInput!) {\n    updateSeller(input: $input) {\n      id\n    }\n  }\n": types.UpdateSellerDocument,
    "\n  mutation DeleteSeller($id: ID!) {\n    deleteSeller(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteSellerDocument,
    "\n  query PickSellerOptions($options: SellerListOptions) {\n    sellers(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": types.PickSellerOptionsDocument,
    "\n  query ServerConfig {\n    globalSettings {\n      id\n      availableLanguages\n      serverConfig {\n        moneyStrategyPrecision\n        permittedAssetTypes\n        permissions {\n          name\n          description\n          assignable\n        }\n        orderProcess {\n          name\n          to\n        }\n        entityCustomFields {\n          entityName\n          customFields {\n            __typename\n            ... on CustomField {\n              name\n              type\n              list\n              readonly\n              internal\n              nullable\n              requiresPermission\n              ui\n              label {\n                languageCode\n                value\n              }\n              description {\n                languageCode\n                value\n              }\n            }\n            ... on StringCustomFieldConfig {\n              pattern\n              length\n              options {\n                value\n                label {\n                  languageCode\n                  value\n                }\n              }\n            }\n            ... on LocaleStringCustomFieldConfig {\n              pattern\n              length\n            }\n            ... on IntCustomFieldConfig {\n              intMin: min\n              intMax: max\n              intStep: step\n            }\n            ... on FloatCustomFieldConfig {\n              floatMin: min\n              floatMax: max\n              floatStep: step\n            }\n            ... on DateTimeCustomFieldConfig {\n              datetimeMin: min\n              datetimeMax: max\n            }\n            ... on RelationCustomFieldConfig {\n              entity\n              scalarFields\n            }\n            ... on StructCustomFieldConfig {\n              fields {\n                ... on StructField {\n                  name\n                  type\n                  list\n                  label {\n                    languageCode\n                    value\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ServerConfigDocument,
    "\n  query ShippingMethodList($options: ShippingMethodListOptions) {\n    shippingMethods(options: $options) {\n      items {\n        id\n        code\n        name\n        fulfillmentHandlerCode\n      }\n      totalItems\n    }\n  }\n": types.ShippingMethodListDocument,
    "\n  query ShippingMethodDetail($id: ID!) {\n    shippingMethod(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      description\n      fulfillmentHandlerCode\n      checker {\n        code\n        args {\n          name\n          value\n        }\n      }\n      calculator {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"ShippingMethod\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"ShippingMethod\")\n    }\n  }\n": types.ShippingMethodDetailDocument,
    "\n  query ShippingMethodOperations {\n    shippingEligibilityCheckers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    shippingCalculators {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    fulfillmentHandlers {\n      code\n      description\n    }\n  }\n": types.ShippingMethodOperationsDocument,
    "\n  mutation CreateShippingMethod($input: CreateShippingMethodInput!) {\n    createShippingMethod(input: $input) {\n      id\n    }\n  }\n": types.CreateShippingMethodDocument,
    "\n  mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {\n    updateShippingMethod(input: $input) {\n      id\n    }\n  }\n": types.UpdateShippingMethodDocument,
    "\n  mutation DeleteShippingMethod($id: ID!) {\n    deleteShippingMethod(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteShippingMethodDocument,
    "\n  query TestShippingMethod($input: TestShippingMethodInput!) {\n    testShippingMethod(input: $input) {\n      eligible\n      quote {\n        price\n        priceWithTax\n        metadata\n      }\n    }\n  }\n": types.TestShippingMethodDocument,
    "\n  query TestEligibleShippingMethods($input: TestEligibleShippingMethodsInput!) {\n    testEligibleShippingMethods(input: $input) {\n      id\n      code\n      name\n      price\n      priceWithTax\n    }\n  }\n": types.TestEligibleShippingMethodsDocument,
    "\n  query StockLocationList($options: StockLocationListOptions) {\n    stockLocations(options: $options) {\n      items {\n        id\n        name\n        description\n      }\n      totalItems\n    }\n  }\n": types.StockLocationListDocument,
    "\n  query StockLocationDetail($id: ID!) {\n    stockLocation(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      customFields @customFields(entity: \"StockLocation\")\n    }\n  }\n": types.StockLocationDetailDocument,
    "\n  mutation CreateStockLocation($input: CreateStockLocationInput!) {\n    createStockLocation(input: $input) {\n      id\n    }\n  }\n": types.CreateStockLocationDocument,
    "\n  mutation UpdateStockLocation($input: UpdateStockLocationInput!) {\n    updateStockLocation(input: $input) {\n      id\n    }\n  }\n": types.UpdateStockLocationDocument,
    "\n  mutation DeleteStockLocation($input: DeleteStockLocationInput!) {\n    deleteStockLocation(input: $input) {\n      result\n      message\n    }\n  }\n": types.DeleteStockLocationDocument,
    "\n  query PickStockLocationOptions($options: StockLocationListOptions) {\n    stockLocations(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": types.PickStockLocationOptionsDocument,
    "\n  query TaxCategoryList($options: TaxCategoryListOptions) {\n    taxCategories(options: $options) {\n      items {\n        id\n        name\n        isDefault\n      }\n      totalItems\n    }\n  }\n": types.TaxCategoryListDocument,
    "\n  query TaxCategoryDetail($id: ID!) {\n    taxCategory(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      isDefault\n      customFields @customFields(entity: \"TaxCategory\")\n    }\n  }\n": types.TaxCategoryDetailDocument,
    "\n  mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {\n    createTaxCategory(input: $input) {\n      id\n    }\n  }\n": types.CreateTaxCategoryDocument,
    "\n  mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {\n    updateTaxCategory(input: $input) {\n      id\n    }\n  }\n": types.UpdateTaxCategoryDocument,
    "\n  mutation DeleteTaxCategory($id: ID!) {\n    deleteTaxCategory(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteTaxCategoryDocument,
    "\n  query TaxRateList($options: TaxRateListOptions) {\n    taxRates(options: $options) {\n      items {\n        id\n        name\n        enabled\n        value\n        category {\n          id\n          name\n        }\n        zone {\n          id\n          name\n        }\n        customerGroup {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": types.TaxRateListDocument,
    "\n  query TaxRateDetail($id: ID!) {\n    taxRate(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      enabled\n      value\n      category {\n        id\n        name\n      }\n      zone {\n        id\n        name\n      }\n      customerGroup {\n        id\n        name\n      }\n      customFields @customFields(entity: \"TaxRate\")\n    }\n  }\n": types.TaxRateDetailDocument,
    "\n  query TaxRateOptions {\n    taxCategories(options: { take: 100, sort: { name: ASC } }) {\n      items {\n        id\n        name\n      }\n    }\n    zones(options: { take: 100, sort: { name: ASC } }) {\n      items {\n        id\n        name\n      }\n    }\n  }\n": types.TaxRateOptionsDocument,
    "\n  mutation CreateTaxRate($input: CreateTaxRateInput!) {\n    createTaxRate(input: $input) {\n      id\n    }\n  }\n": types.CreateTaxRateDocument,
    "\n  mutation UpdateTaxRate($input: UpdateTaxRateInput!) {\n    updateTaxRate(input: $input) {\n      id\n    }\n  }\n": types.UpdateTaxRateDocument,
    "\n  mutation DeleteTaxRate($id: ID!) {\n    deleteTaxRate(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteTaxRateDocument,
    "\n  query VariantList($options: ProductVariantListOptions, $productId: ID) {\n    productVariants(options: $options, productId: $productId) {\n      items {\n        id\n        name\n        sku\n        enabled\n        priceWithTax\n        currencyCode\n        featuredAsset {\n          id\n          preview\n        }\n        product {\n          id\n          name\n          featuredAsset {\n            id\n            preview\n          }\n        }\n        stockLevels {\n          id\n          stockOnHand\n          stockAllocated\n        }\n      }\n      totalItems\n    }\n  }\n": types.VariantListDocument,
    "\n  query VariantDetail($id: ID!) {\n    productVariant(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      name\n      sku\n      enabled\n      price\n      priceWithTax\n      currencyCode\n      trackInventory\n      outOfStockThreshold\n      useGlobalOutOfStockThreshold\n      taxCategory {\n        id\n        name\n      }\n      stockLevels {\n        id\n        stockLocationId\n        stockOnHand\n        stockAllocated\n        stockLocation {\n          id\n          name\n        }\n      }\n      options {\n        id\n        code\n        name\n        group {\n          id\n          name\n        }\n      }\n      facetValues {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      product {\n        id\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      translations @customFields(entity: \"ProductVariant\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ProductVariant\")\n    }\n  }\n": types.VariantDetailDocument,
    "\n  query VariantFormData {\n    taxCategories(options: { take: 100 }) {\n      items {\n        id\n        name\n        isDefault\n      }\n    }\n    stockLocations(options: { take: 100 }) {\n      items {\n        id\n        name\n      }\n    }\n    globalSettings {\n      id\n      trackInventory\n      outOfStockThreshold\n    }\n  }\n": types.VariantFormDataDocument,
    "\n  query VariantProduct($id: ID!) {\n    product(id: $id) {\n      id\n      name\n      optionGroups {\n        id\n        name\n        options {\n          id\n          code\n          name\n        }\n      }\n    }\n  }\n": types.VariantProductDocument,
    "\n  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {\n    createProductVariants(input: $input) {\n      id\n      name\n      sku\n    }\n  }\n": types.CreateProductVariantsDocument,
    "\n  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {\n    updateProductVariant(input: $input) {\n      id\n      updatedAt\n    }\n  }\n": types.UpdateProductVariantDocument,
    "\n  mutation DeleteProductVariant($id: ID!) {\n    deleteProductVariant(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteProductVariantDocument,
    "\n  query ZoneList($options: ZoneListOptions) {\n    zones(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": types.ZoneListDocument,
    "\n  query ZoneDetail($id: ID!) {\n    zone(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      members {\n        id\n        code\n        name\n        enabled\n      }\n      customFields @customFields(entity: \"Zone\")\n    }\n  }\n": types.ZoneDetailDocument,
    "\n  mutation CreateZone($input: CreateZoneInput!) {\n    createZone(input: $input) {\n      id\n    }\n  }\n": types.CreateZoneDocument,
    "\n  mutation UpdateZone($input: UpdateZoneInput!) {\n    updateZone(input: $input) {\n      id\n    }\n  }\n": types.UpdateZoneDocument,
    "\n  mutation DeleteZone($id: ID!) {\n    deleteZone(id: $id) {\n      result\n      message\n    }\n  }\n": types.DeleteZoneDocument,
    "\n  mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {\n    addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {\n      id\n    }\n  }\n": types.AddMembersToZoneDocument,
    "\n  mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {\n    removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {\n      id\n    }\n  }\n": types.RemoveMembersFromZoneDocument,
    "\n  query PickProducts($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        slug\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      totalItems\n    }\n  }\n": types.PickProductsDocument,
    "\n  query PickVariants($options: ProductVariantListOptions) {\n    productVariants(options: $options) {\n      items {\n        id\n        name\n        sku\n        priceWithTax\n        currencyCode\n        featuredAsset {\n          id\n          preview\n        }\n        product {\n          id\n          featuredAsset {\n            id\n            preview\n          }\n        }\n      }\n      totalItems\n    }\n  }\n": types.PickVariantsDocument,
    "\n  query PickCustomers($options: CustomerListOptions) {\n    customers(options: $options) {\n      items {\n        id\n        firstName\n        lastName\n        emailAddress\n      }\n      totalItems\n    }\n  }\n": types.PickCustomersDocument,
    "\n  query PickFacetValues($options: FacetValueListOptions) {\n    facetValues(options: $options) {\n      items {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": types.PickFacetValuesDocument,
    "\n  query PickCustomerGroups($options: CustomerGroupListOptions) {\n    customerGroups(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n": types.PickCustomerGroupsDocument,
    "\n  query PickCollections($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        name\n        slug\n        breadcrumbs {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n": types.PickCollectionsDocument,
    "\n  query PickAssets($options: AssetListOptions) {\n    assets(options: $options) {\n      items {\n        id\n        name\n        preview\n      }\n      totalItems\n    }\n  }\n": types.PickAssetsDocument,
    "\n  query PickCountries($options: CountryListOptions) {\n    countries(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n      }\n      totalItems\n    }\n  }\n": types.PickCountriesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdministratorList($options: AdministratorListOptions) {\n    administrators(options: $options) {\n      items {\n        id\n        firstName\n        lastName\n        emailAddress\n        user {\n          id\n          roles {\n            id\n            code\n          }\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').AdministratorListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdministratorDetail($id: ID!) {\n    administrator(id: $id) {\n      id\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      emailAddress\n      user {\n        id\n        identifier\n        lastLogin\n        roles {\n          id\n          code\n          description\n          channels {\n            id\n            code\n          }\n        }\n      }\n      customFields @customFields(entity: \"Administrator\")\n    }\n  }\n"): typeof import('./graphql').AdministratorDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAdministrator($input: CreateAdministratorInput!) {\n    createAdministrator(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateAdministratorDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateAdministrator($input: UpdateAdministratorInput!) {\n    updateAdministrator(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateAdministratorDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAdministrator($id: ID!) {\n    deleteAdministrator(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteAdministratorDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ApiKeyList($options: ApiKeyListOptions) {\n    apiKeys(options: $options) {\n      items {\n        id\n        name\n        lookupId\n        lastUsedAt\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').ApiKeyListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ApiKeyDetail($id: ID!) {\n    apiKey(id: $id) {\n      id\n      createdAt\n      updatedAt\n      lookupId\n      lastUsedAt\n      name\n      owner {\n        id\n        identifier\n      }\n      user {\n        id\n        roles {\n          id\n          code\n          description\n        }\n      }\n      translations {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ApiKey\")\n    }\n  }\n"): typeof import('./graphql').ApiKeyDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveAdministratorRoles {\n    activeAdministrator {\n      id\n      user {\n        id\n        roles {\n          id\n          code\n          description\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ActiveAdministratorRolesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateApiKey($input: CreateApiKeyInput!) {\n    createApiKey(input: $input) {\n      apiKey\n      entityId\n    }\n  }\n"): typeof import('./graphql').CreateApiKeyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateApiKey($input: UpdateApiKeyInput!) {\n    updateApiKey(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateApiKeyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RotateApiKey($id: ID!) {\n    rotateApiKey(id: $id) {\n      apiKey\n    }\n  }\n"): typeof import('./graphql').RotateApiKeyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteApiKeys($ids: [ID!]!) {\n    deleteApiKeys(ids: $ids) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteApiKeysDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AssetList($options: AssetListOptions) {\n    assets(options: $options) {\n      items {\n        id\n        name\n        preview\n        type\n        mimeType\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').AssetListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AssetDetail($id: ID!) {\n    asset(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      type\n      fileSize\n      mimeType\n      width\n      height\n      source\n      preview\n      focalPoint {\n        x\n        y\n      }\n      tags {\n        id\n        value\n      }\n      customFields @customFields(entity: \"Asset\")\n    }\n  }\n"): typeof import('./graphql').AssetDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AssetTags($options: TagListOptions) {\n    tags(options: $options) {\n      items {\n        id\n        value\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').AssetTagsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateAsset($input: UpdateAssetInput!) {\n    updateAsset(input: $input) {\n      id\n      updatedAt\n    }\n  }\n"): typeof import('./graphql').UpdateAssetDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAssets($input: DeleteAssetsInput!) {\n    deleteAssets(input: $input) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteAssetsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAssets($input: [CreateAssetInput!]!) {\n    createAssets(input: $input) {\n      ... on Asset {\n        __typename\n        id\n        name\n        preview\n        mimeType\n      }\n      ... on MimeTypeError {\n        __typename\n        errorCode\n        message\n        fileName\n        mimeType\n      }\n    }\n  }\n"): typeof import('./graphql').CreateAssetsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {\n    login(username: $username, password: $password, rememberMe: $rememberMe) {\n      __typename\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout {\n      success\n    }\n  }\n"): typeof import('./graphql').LogoutDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CurrentUser {\n    me {\n      id\n      identifier\n      channels {\n        id\n        code\n        token\n        permissions\n      }\n    }\n    activeAdministrator {\n      id\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n"): typeof import('./graphql').CurrentUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveChannel {\n    activeChannel {\n      id\n      code\n      token\n      defaultCurrencyCode\n      defaultLanguageCode\n      pricesIncludeTax\n    }\n    globalSettings {\n      id\n      serverConfig {\n        moneyStrategyPrecision\n      }\n    }\n  }\n"): typeof import('./graphql').ActiveChannelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ChannelList($options: ChannelListOptions) {\n    channels(options: $options) {\n      items {\n        id\n        code\n        defaultLanguageCode\n        defaultCurrencyCode\n        pricesIncludeTax\n        seller {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').ChannelListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ChannelDetail($id: ID!) {\n    channel(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      token\n      pricesIncludeTax\n      availableCurrencyCodes\n      availableLanguageCodes\n      defaultCurrencyCode\n      defaultLanguageCode\n      trackInventory\n      outOfStockThreshold\n      defaultShippingZone {\n        id\n        name\n      }\n      defaultTaxZone {\n        id\n        name\n      }\n      seller {\n        id\n        name\n      }\n      customFields @customFields(entity: \"Channel\")\n    }\n  }\n"): typeof import('./graphql').ChannelDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      __typename\n      ... on Channel {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').CreateChannelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateChannel($input: UpdateChannelInput!) {\n    updateChannel(input: $input) {\n      __typename\n      ... on Channel {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateChannelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteChannel($id: ID!) {\n    deleteChannel(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteChannelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickZoneOptions($options: ZoneListOptions) {\n    zones(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickZoneOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CollectionList($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        name\n        slug\n        isPrivate\n        parentId\n        position\n        productVariantCount\n        featuredAsset {\n          id\n          preview\n        }\n        breadcrumbs {\n          id\n          name\n        }\n        children {\n          id\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').CollectionListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CollectionDetail($id: ID!) {\n    collection(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      name\n      slug\n      description\n      isPrivate\n      inheritFilters\n      position\n      parentId\n      breadcrumbs {\n        id\n        name\n      }\n      parent {\n        id\n        name\n      }\n      children {\n        id\n        name\n      }\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      filters {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"Collection\", locale: true) {\n        id\n        languageCode\n        name\n        slug\n        description\n      }\n      customFields @customFields(entity: \"Collection\")\n    }\n  }\n"): typeof import('./graphql').CollectionDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CollectionContents($id: ID!, $options: ProductVariantListOptions) {\n    collection(id: $id) {\n      id\n      productVariants(options: $options) {\n        totalItems\n        items {\n          id\n          name\n          sku\n          featuredAsset {\n            id\n            preview\n          }\n          product {\n            id\n            featuredAsset {\n              id\n              preview\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').CollectionContentsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CollectionFilters {\n    collectionFilters {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n"): typeof import('./graphql').CollectionFiltersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCollection($input: CreateCollectionInput!) {\n    createCollection(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateCollectionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCollection($input: UpdateCollectionInput!) {\n    updateCollection(input: $input) {\n      id\n      updatedAt\n    }\n  }\n"): typeof import('./graphql').UpdateCollectionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MoveCollection($input: MoveCollectionInput!) {\n    moveCollection(input: $input) {\n      id\n      parentId\n    }\n  }\n"): typeof import('./graphql').MoveCollectionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCollection($id: ID!) {\n    deleteCollection(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteCollectionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CountryList($options: CountryListOptions) {\n    countries(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').CountryListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CountryDetail($id: ID!) {\n    country(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      enabled\n      translations @customFields(entity: \"Country\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"Country\")\n    }\n  }\n"): typeof import('./graphql').CountryDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCountry($input: CreateCountryInput!) {\n    createCountry(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateCountryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCountry($input: UpdateCountryInput!) {\n    updateCountry(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateCountryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCountry($id: ID!) {\n    deleteCountry(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteCountryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerGroupList($options: CustomerGroupListOptions) {\n    customerGroups(options: $options) {\n      items {\n        id\n        name\n        customers {\n          totalItems\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').CustomerGroupListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerGroupDetail($id: ID!) {\n    customerGroup(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      customFields @customFields(entity: \"CustomerGroup\")\n    }\n  }\n"): typeof import('./graphql').CustomerGroupDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerGroupMembers($id: ID!, $options: CustomerListOptions) {\n    customerGroup(id: $id) {\n      id\n      customers(options: $options) {\n        items {\n          id\n          firstName\n          lastName\n          emailAddress\n        }\n        totalItems\n      }\n    }\n  }\n"): typeof import('./graphql').CustomerGroupMembersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {\n    createCustomerGroup(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateCustomerGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {\n    updateCustomerGroup(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateCustomerGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCustomerGroup($id: ID!) {\n    deleteCustomerGroup(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteCustomerGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddCustomersToGroup($customerGroupId: ID!, $customerIds: [ID!]!) {\n    addCustomersToGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddCustomersToGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCustomersFromGroup($customerGroupId: ID!, $customerIds: [ID!]!) {\n    removeCustomersFromGroup(customerGroupId: $customerGroupId, customerIds: $customerIds) {\n      id\n    }\n  }\n"): typeof import('./graphql').RemoveCustomersFromGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerList($options: CustomerListOptions) {\n    customers(options: $options) {\n      items {\n        id\n        createdAt\n        title\n        firstName\n        lastName\n        emailAddress\n        phoneNumber\n        user {\n          id\n          verified\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').CustomerListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CustomerAddress on Address {\n    id\n    fullName\n    company\n    streetLine1\n    streetLine2\n    city\n    province\n    postalCode\n    phoneNumber\n    defaultShippingAddress\n    defaultBillingAddress\n    country {\n      id\n      code\n      name\n    }\n    customFields @customFields(entity: \"Address\")\n  }\n"): typeof import('./graphql').CustomerAddressFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerDetail($id: ID!) {\n    customer(id: $id) {\n      id\n      createdAt\n      updatedAt\n      title\n      firstName\n      lastName\n      phoneNumber\n      emailAddress\n      groups {\n        id\n        name\n      }\n      user {\n        id\n        identifier\n        verified\n        lastLogin\n      }\n      addresses {\n        ...CustomerAddress\n      }\n      customFields @customFields(entity: \"Customer\")\n    }\n  }\n"): typeof import('./graphql').CustomerDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerOrders($customerId: ID!, $options: OrderListOptions) {\n    customer(id: $customerId) {\n      id\n      orders(options: $options) {\n        items {\n          ...OrderListItem\n        }\n        totalItems\n      }\n    }\n  }\n"): typeof import('./graphql').CustomerOrdersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerHistory($id: ID!, $options: HistoryEntryListOptions) {\n    activeAdministrator {\n      id\n    }\n    customer(id: $id) {\n      id\n      history(options: $options) {\n        totalItems\n        items {\n          id\n          type\n          createdAt\n          isPublic\n          data\n          administrator {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').CustomerHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {\n    createCustomer(input: $input, password: $password) {\n      __typename\n      ... on Customer {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').CreateCustomerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      __typename\n      ... on Customer {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateCustomerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCustomer($id: ID!) {\n    deleteCustomer(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteCustomerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyCustomerAccount($id: ID!, $password: String) {\n    verifyCustomerAccount(id: $id, password: $password) {\n      __typename\n      ... on Customer {\n        id\n        user {\n          id\n          verified\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').VerifyCustomerAccountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCustomerAddress($customerId: ID!, $input: CreateAddressInput!) {\n    createCustomerAddress(customerId: $customerId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateCustomerAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {\n    updateCustomerAddress(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateCustomerAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCustomerAddress($id: ID!) {\n    deleteCustomerAddress(id: $id) {\n      success\n    }\n  }\n"): typeof import('./graphql').DeleteCustomerAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddCustomerNote($input: AddNoteToCustomerInput!) {\n    addNoteToCustomer(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddCustomerNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCustomerNote($input: UpdateCustomerNoteInput!) {\n    updateCustomerNote(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateCustomerNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCustomerNote($id: ID!) {\n    deleteCustomerNote(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteCustomerNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DashboardMetrics {\n    metricSummary(input: { interval: Daily, types: [OrderCount, OrderTotal, AverageOrderValue] }) {\n      type\n      title\n      entries {\n        label\n        value\n      }\n    }\n  }\n"): typeof import('./graphql').DashboardMetricsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DashboardOrders($today: DateTime!, $monthStart: DateTime!) {\n    today: orders(\n      options: {\n        take: 0\n        filter: { active: { eq: false }, orderPlacedAt: { after: $today }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n    }\n    month: orders(\n      options: {\n        take: 0\n        filter: { active: { eq: false }, orderPlacedAt: { after: $monthStart }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n    }\n    latest: orders(\n      options: {\n        take: 6\n        sort: { orderPlacedAt: DESC }\n        filter: { active: { eq: false }, state: { notIn: [\"Draft\"] } }\n      }\n    ) {\n      items {\n        ...OrderListItem\n      }\n    }\n  }\n"): typeof import('./graphql').DashboardOrdersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DashboardOrderTotals($since: DateTime!, $take: Int!) {\n    orders(\n      options: {\n        take: $take\n        sort: { orderPlacedAt: DESC }\n        filter: { active: { eq: false }, orderPlacedAt: { after: $since }, state: { notIn: [\"Draft\", \"Cancelled\"] } }\n      }\n    ) {\n      totalItems\n      items {\n        id\n        orderPlacedAt\n        totalWithTax\n      }\n    }\n  }\n"): typeof import('./graphql').DashboardOrderTotalsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DraftOrderDetail($id: ID!) {\n    order(id: $id) {\n      id\n      code\n      state\n      active\n      createdAt\n      updatedAt\n      currencyCode\n      totalQuantity\n      subTotalWithTax\n      shippingWithTax\n      total\n      totalWithTax\n      couponCodes\n      nextStates\n      customer {\n        id\n        firstName\n        lastName\n        emailAddress\n        addresses {\n          id\n          fullName\n          company\n          streetLine1\n          streetLine2\n          city\n          province\n          postalCode\n          phoneNumber\n          defaultShippingAddress\n          defaultBillingAddress\n          country {\n            id\n            code\n            name\n          }\n        }\n      }\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        linePriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          id\n          name\n          sku\n        }\n      }\n      discounts {\n        description\n        amountWithTax\n      }\n      promotions {\n        id\n        name\n        couponCode\n      }\n      shippingLines {\n        id\n        priceWithTax\n        shippingMethod {\n          id\n          name\n        }\n      }\n      shippingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      billingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      customFields @customFields(entity: \"Order\")\n    }\n  }\n"): typeof import('./graphql').DraftOrderDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDraftOrder {\n    createDraftOrder {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateDraftOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteDraftOrder($orderId: ID!) {\n    deleteDraftOrder(orderId: $orderId) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteDraftOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddItemToDraftOrder($orderId: ID!, $input: AddItemToDraftOrderInput!) {\n    addItemToDraftOrder(orderId: $orderId, input: $input) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AddItemToDraftOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdjustDraftOrderLine($orderId: ID!, $input: AdjustDraftOrderLineInput!) {\n    adjustDraftOrderLine(orderId: $orderId, input: $input) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AdjustDraftOrderLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveDraftOrderLine($orderId: ID!, $orderLineId: ID!) {\n    removeDraftOrderLine(orderId: $orderId, orderLineId: $orderLineId) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').RemoveDraftOrderLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetCustomerForDraftOrder($orderId: ID!, $customerId: ID, $input: CreateCustomerInput) {\n    setCustomerForDraftOrder(orderId: $orderId, customerId: $customerId, input: $input) {\n      __typename\n      ... on Order {\n        id\n        customer {\n          id\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').SetCustomerForDraftOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetDraftOrderShippingAddress($orderId: ID!, $input: CreateAddressInput!) {\n    setDraftOrderShippingAddress(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').SetDraftOrderShippingAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetDraftOrderBillingAddress($orderId: ID!, $input: CreateAddressInput!) {\n    setDraftOrderBillingAddress(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').SetDraftOrderBillingAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnsetDraftOrderShippingAddress($orderId: ID!) {\n    unsetDraftOrderShippingAddress(orderId: $orderId) {\n      id\n    }\n  }\n"): typeof import('./graphql').UnsetDraftOrderShippingAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnsetDraftOrderBillingAddress($orderId: ID!) {\n    unsetDraftOrderBillingAddress(orderId: $orderId) {\n      id\n    }\n  }\n"): typeof import('./graphql').UnsetDraftOrderBillingAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DraftOrderEligibleShippingMethods($orderId: ID!) {\n    eligibleShippingMethodsForDraftOrder(orderId: $orderId) {\n      id\n      name\n      code\n      description\n      price\n      priceWithTax\n    }\n  }\n"): typeof import('./graphql').DraftOrderEligibleShippingMethodsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {\n    setDraftOrderShippingMethod(orderId: $orderId, shippingMethodId: $shippingMethodId) {\n      __typename\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').SetDraftOrderShippingMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ApplyCouponCodeToDraftOrder($orderId: ID!, $couponCode: String!) {\n    applyCouponCodeToDraftOrder(orderId: $orderId, couponCode: $couponCode) {\n      __typename\n      ... on Order {\n        id\n        couponCodes\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').ApplyCouponCodeToDraftOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCouponCodeFromDraftOrder($orderId: ID!, $couponCode: String!) {\n    removeCouponCodeFromDraftOrder(orderId: $orderId, couponCode: $couponCode) {\n      id\n      couponCodes\n    }\n  }\n"): typeof import('./graphql').RemoveCouponCodeFromDraftOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetDraftOrderCustomFields($orderId: ID!, $input: UpdateOrderInput!) {\n    setDraftOrderCustomFields(orderId: $orderId, input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').SetDraftOrderCustomFieldsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DraftOrderVariants($options: ProductVariantListOptions) {\n    productVariants(options: $options) {\n      items {\n        id\n        name\n        sku\n        stockLevel\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').DraftOrderVariantsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FacetList($options: FacetListOptions) {\n    facets(options: $options) {\n      items {\n        id\n        code\n        name\n        isPrivate\n        valueList(options: { take: 5 }) {\n          totalItems\n          items {\n            id\n            name\n          }\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').FacetListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FacetDetail($id: ID!) {\n    facet(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      isPrivate\n      translations @customFields(entity: \"Facet\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"Facet\")\n      values {\n        id\n        code\n        name\n        languageCode\n        translations @customFields(entity: \"FacetValue\", locale: true) {\n          id\n          languageCode\n          name\n        }\n        customFields @customFields(entity: \"FacetValue\")\n      }\n    }\n  }\n"): typeof import('./graphql').FacetDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateFacet($input: CreateFacetInput!) {\n    createFacet(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateFacetDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateFacet($input: UpdateFacetInput!) {\n    updateFacet(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateFacetDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteFacet($id: ID!, $force: Boolean) {\n    deleteFacet(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteFacetDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {\n    createFacetValues(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateFacetValuesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {\n    updateFacetValues(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateFacetValuesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {\n    deleteFacetValues(ids: $ids, force: $force) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteFacetValuesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GlobalSettingsDetail {\n    globalSettings {\n      id\n      updatedAt\n      availableLanguages\n      trackInventory\n      outOfStockThreshold\n      customFields @customFields(entity: \"GlobalSettings\")\n    }\n  }\n"): typeof import('./graphql').GlobalSettingsDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {\n    updateGlobalSettings(input: $input) {\n      __typename\n      ... on GlobalSettings {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateGlobalSettingsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query JobList($options: JobListOptions) {\n    jobs(options: $options) {\n      items {\n        id\n        queueName\n        state\n        progress\n        createdAt\n        settledAt\n        duration\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').JobListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query JobDetail($id: ID!) {\n    job(jobId: $id) {\n      id\n      queueName\n      state\n      progress\n      createdAt\n      startedAt\n      settledAt\n      isSettled\n      duration\n      data\n      result\n      error\n      retries\n      attempts\n    }\n  }\n"): typeof import('./graphql').JobDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query JobQueueList {\n    jobQueues {\n      name\n      running\n    }\n  }\n"): typeof import('./graphql').JobQueueListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelJob($jobId: ID!) {\n    cancelJob(jobId: $jobId) {\n      id\n      state\n    }\n  }\n"): typeof import('./graphql').CancelJobDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RebuildSearchIndex {\n    reindex {\n      id\n      queueName\n      state\n    }\n  }\n"): typeof import('./graphql').RebuildSearchIndexDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveJobCount($filter: JobFilterParameter) {\n    jobs(options: { take: 1, filter: $filter }) {\n      totalItems\n    }\n  }\n"): typeof import('./graphql').ActiveJobCountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OptionGroupList($options: ProductOptionGroupListOptions) {\n    productOptionGroups(options: $options) {\n      items {\n        id\n        code\n        name\n        productCount\n        options {\n          id\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').OptionGroupListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OptionGroupDetail($id: ID!) {\n    productOptionGroup(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      productCount\n      translations @customFields(entity: \"ProductOptionGroup\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ProductOptionGroup\")\n      options {\n        id\n        code\n        name\n        languageCode\n        translations @customFields(entity: \"ProductOption\", locale: true) {\n          id\n          languageCode\n          name\n        }\n        customFields @customFields(entity: \"ProductOption\")\n      }\n    }\n  }\n"): typeof import('./graphql').OptionGroupDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOptionGroup($input: CreateProductOptionGroupInput!) {\n    createProductOptionGroup(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateOptionGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateOptionGroup($input: UpdateProductOptionGroupInput!) {\n    updateProductOptionGroup(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateOptionGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteOptionGroup($id: ID!, $force: Boolean) {\n    deleteProductOptionGroup(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteOptionGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProductOption($input: CreateProductOptionInput!) {\n    createProductOption(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateProductOptionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProductOption($input: UpdateProductOptionInput!) {\n    updateProductOption(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateProductOptionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProductOption($id: ID!) {\n    deleteProductOption(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteProductOptionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderListItem on Order {\n    id\n    code\n    state\n    active\n    orderPlacedAt\n    updatedAt\n    totalWithTax\n    currencyCode\n    customer {\n      id\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n"): typeof import('./graphql').OrderListItemFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrderList($options: OrderListOptions) {\n    orders(options: $options) {\n      items {\n        ...OrderListItem\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').OrderListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrderDetail($id: ID!) {\n    order(id: $id) {\n      id\n      code\n      state\n      active\n      type\n      createdAt\n      updatedAt\n      orderPlacedAt\n      currencyCode\n      totalQuantity\n      subTotal\n      subTotalWithTax\n      shipping\n      shippingWithTax\n      total\n      totalWithTax\n      nextStates\n      couponCodes\n      customer {\n        id\n        firstName\n        lastName\n        emailAddress\n        phoneNumber\n      }\n      shippingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      billingAddress {\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country\n        countryCode\n        phoneNumber\n      }\n      lines {\n        id\n        quantity\n        orderPlacedQuantity\n        unitPriceWithTax\n        proratedUnitPriceWithTax\n        linePriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          id\n          name\n          sku\n        }\n        fulfillmentLines {\n          fulfillmentId\n          quantity\n        }\n        customFields @customFields(entity: \"OrderLine\")\n      }\n      discounts {\n        description\n        amountWithTax\n      }\n      promotions {\n        id\n        name\n        couponCode\n      }\n      surcharges {\n        id\n        description\n        priceWithTax\n      }\n      shippingLines {\n        id\n        priceWithTax\n        discountedPriceWithTax\n        shippingMethod {\n          id\n          name\n          code\n          fulfillmentHandlerCode\n        }\n      }\n      payments {\n        id\n        method\n        amount\n        state\n        nextStates\n        transactionId\n        errorMessage\n        metadata\n        createdAt\n        refunds {\n          id\n          createdAt\n          state\n          total\n          items\n          shipping\n          adjustment\n          reason\n          transactionId\n          method\n          metadata\n          lines {\n            orderLineId\n            quantity\n          }\n        }\n      }\n      fulfillments {\n        id\n        state\n        nextStates\n        method\n        trackingCode\n        createdAt\n        updatedAt\n        lines {\n          orderLineId\n          quantity\n        }\n      }\n      modifications {\n        id\n        createdAt\n        priceChange\n        note\n        isSettled\n      }\n      customFields @customFields(entity: \"Order\")\n    }\n  }\n"): typeof import('./graphql').OrderDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrderHistory($id: ID!, $options: HistoryEntryListOptions) {\n    activeAdministrator {\n      id\n    }\n    order(id: $id) {\n      id\n      history(options: $options) {\n        totalItems\n        items {\n          id\n          type\n          createdAt\n          isPublic\n          data\n          administrator {\n            id\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').OrderHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddOrderNote($input: AddNoteToOrderInput!) {\n    addNoteToOrder(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddOrderNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateOrderNote($input: UpdateOrderNoteInput!) {\n    updateOrderNote(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateOrderNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteOrderNote($id: ID!) {\n    deleteOrderNote(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteOrderNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TransitionOrderToState($id: ID!, $state: String!) {\n    transitionOrderToState(id: $id, state: $state) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on OrderStateTransitionError {\n        transitionError\n      }\n    }\n  }\n"): typeof import('./graphql').TransitionOrderToStateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrderPaymentMethods($options: PaymentMethodListOptions) {\n    paymentMethods(options: $options) {\n      items {\n        id\n        name\n        code\n        enabled\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').OrderPaymentMethodsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddManualPayment($input: ManualPaymentInput!) {\n    addManualPaymentToOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AddManualPaymentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SettlePayment($id: ID!) {\n    settlePayment(id: $id) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').SettlePaymentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelPayment($id: ID!) {\n    cancelPayment(id: $id) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').CancelPaymentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TransitionPaymentToState($id: ID!, $state: String!) {\n    transitionPaymentToState(id: $id, state: $state) {\n      __typename\n      ... on Payment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').TransitionPaymentToStateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FulfillmentHandlers {\n    fulfillmentHandlers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n"): typeof import('./graphql').FulfillmentHandlersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FulfillOrder($input: FulfillOrderInput!) {\n    addFulfillmentToOrder(input: $input) {\n      __typename\n      ... on Fulfillment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').FulfillOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TransitionFulfillment($id: ID!, $state: String!) {\n    transitionFulfillmentToState(id: $id, state: $state) {\n      __typename\n      ... on Fulfillment {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').TransitionFulfillmentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelOrder($input: CancelOrderInput!) {\n    cancelOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').CancelOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefundOrder($input: RefundOrderInput!) {\n    refundOrder(input: $input) {\n      __typename\n      ... on Refund {\n        id\n        state\n        total\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').RefundOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SettleRefund($input: SettleRefundInput!) {\n    settleRefund(input: $input) {\n      __typename\n      ... on Refund {\n        id\n        state\n        transactionId\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').SettleRefundDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ModifyOrder($input: ModifyOrderInput!) {\n    modifyOrder(input: $input) {\n      __typename\n      ... on Order {\n        id\n        state\n        subTotalWithTax\n        shippingWithTax\n        totalWithTax\n        currencyCode\n        lines {\n          id\n          quantity\n          linePriceWithTax\n          productVariant {\n            id\n            name\n          }\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').ModifyOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetOrderCustomFields($input: UpdateOrderInput!) {\n    setOrderCustomFields(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').SetOrderCustomFieldsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PaymentMethodList($options: PaymentMethodListOptions) {\n    paymentMethods(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n        handler {\n          code\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PaymentMethodListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PaymentMethodDetail($id: ID!) {\n    paymentMethod(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      name\n      description\n      enabled\n      checker {\n        code\n        args {\n          name\n          value\n        }\n      }\n      handler {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"PaymentMethod\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"PaymentMethod\")\n    }\n  }\n"): typeof import('./graphql').PaymentMethodDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PaymentMethodOperations {\n    paymentMethodHandlers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    paymentMethodEligibilityCheckers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n"): typeof import('./graphql').PaymentMethodOperationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {\n    createPaymentMethod(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreatePaymentMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {\n    updatePaymentMethod(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdatePaymentMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePaymentMethod($id: ID!, $force: Boolean) {\n    deletePaymentMethod(id: $id, force: $force) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeletePaymentMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductList($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        slug\n        enabled\n        updatedAt\n        featuredAsset {\n          id\n          preview\n        }\n        variantList(options: { take: 1 }) {\n          totalItems\n          items {\n            id\n            priceWithTax\n            currencyCode\n          }\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').ProductListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductDetail($id: ID!) {\n    product(id: $id) {\n      id\n      name\n      slug\n      description\n      enabled\n      createdAt\n      updatedAt\n      languageCode\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      channels {\n        id\n        code\n      }\n      optionGroups {\n        id\n        code\n        name\n      }\n      customFields @customFields(entity: \"Product\")\n      translations @customFields(entity: \"Product\", locale: true) {\n        id\n        languageCode\n        name\n        slug\n        description\n      }\n      facetValues {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      variantList(options: { take: 50 }) {\n        totalItems\n        items {\n          id\n          name\n          sku\n          enabled\n          price\n          priceWithTax\n          currencyCode\n          featuredAsset {\n            id\n            preview\n          }\n          options {\n            id\n            name\n          }\n          stockLevels {\n            id\n            stockOnHand\n            stockAllocated\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ProductDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProduct($input: UpdateProductInput!) {\n    updateProduct(input: $input) {\n      id\n      name\n      enabled\n      updatedAt\n      translations {\n        id\n        languageCode\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateProductDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      id\n      name\n    }\n  }\n"): typeof import('./graphql').CreateProductDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProduct($id: ID!) {\n    deleteProduct(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteProductDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {\n    assignProductsToChannel(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').AssignProductsToChannelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {\n    removeProductsFromChannel(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').RemoveProductsFromChannelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProfileDetail {\n    activeAdministrator {\n      id\n      createdAt\n      updatedAt\n      firstName\n      lastName\n      emailAddress\n      user {\n        id\n        identifier\n        lastLogin\n        roles {\n          id\n          code\n          description\n        }\n      }\n      customFields @customFields(entity: \"Administrator\")\n    }\n  }\n"): typeof import('./graphql').ProfileDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateActiveAdministratorInput!) {\n    updateActiveAdministrator(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PromotionList($options: PromotionListOptions) {\n    promotions(options: $options) {\n      items {\n        id\n        name\n        couponCode\n        enabled\n        startsAt\n        endsAt\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PromotionListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PromotionDetail($id: ID!) {\n    promotion(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      enabled\n      couponCode\n      perCustomerUsageLimit\n      usageLimit\n      startsAt\n      endsAt\n      conditions {\n        code\n        args {\n          name\n          value\n        }\n      }\n      actions {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"Promotion\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"Promotion\")\n    }\n  }\n"): typeof import('./graphql').PromotionDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PromotionOperations {\n    promotionConditions {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    promotionActions {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n  }\n"): typeof import('./graphql').PromotionOperationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePromotion($input: CreatePromotionInput!) {\n    createPromotion(input: $input) {\n      ... on Promotion {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').CreatePromotionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePromotion($input: UpdatePromotionInput!) {\n    updatePromotion(input: $input) {\n      ... on Promotion {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdatePromotionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePromotion($id: ID!) {\n    deletePromotion(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeletePromotionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RoleList($options: RoleListOptions) {\n    roles(options: $options) {\n      items {\n        id\n        code\n        description\n        permissions\n        channels {\n          id\n          code\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').RoleListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RoleDetail($id: ID!) {\n    role(id: $id) {\n      id\n      createdAt\n      updatedAt\n      code\n      description\n      permissions\n      channels {\n        id\n        code\n      }\n      customFields @customFields(entity: \"Role\")\n    }\n  }\n"): typeof import('./graphql').RoleDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRole($input: CreateRoleInput!) {\n    createRole(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateRoleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateRole($input: UpdateRoleInput!) {\n    updateRole(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateRoleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteRole($id: ID!) {\n    deleteRole(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteRoleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickRoleOptions($options: RoleListOptions) {\n    roles(options: $options) {\n      items {\n        id\n        code\n        description\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickRoleOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickChannelOptions($options: ChannelListOptions) {\n    channels(options: $options) {\n      items {\n        id\n        code\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickChannelOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScheduledTasks {\n    scheduledTasks {\n      id\n      description\n      schedule\n      scheduleDescription\n      timezone\n      lastExecutedAt\n      nextExecutionAt\n      isRunning\n      lastResult\n      enabled\n    }\n  }\n"): typeof import('./graphql').ScheduledTasksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateScheduledTask($input: UpdateScheduledTaskInput!) {\n    updateScheduledTask(input: $input) {\n      id\n      enabled\n    }\n  }\n"): typeof import('./graphql').UpdateScheduledTaskDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RunScheduledTask($id: String!) {\n    runScheduledTask(id: $id) {\n      success\n    }\n  }\n"): typeof import('./graphql').RunScheduledTaskDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SellerList($options: SellerListOptions) {\n    sellers(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').SellerListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SellerDetail($id: ID!) {\n    seller(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      customFields @customFields(entity: \"Seller\")\n    }\n  }\n"): typeof import('./graphql').SellerDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSeller($input: CreateSellerInput!) {\n    createSeller(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateSellerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSeller($input: UpdateSellerInput!) {\n    updateSeller(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateSellerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteSeller($id: ID!) {\n    deleteSeller(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteSellerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickSellerOptions($options: SellerListOptions) {\n    sellers(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickSellerOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ServerConfig {\n    globalSettings {\n      id\n      availableLanguages\n      serverConfig {\n        moneyStrategyPrecision\n        permittedAssetTypes\n        permissions {\n          name\n          description\n          assignable\n        }\n        orderProcess {\n          name\n          to\n        }\n        entityCustomFields {\n          entityName\n          customFields {\n            __typename\n            ... on CustomField {\n              name\n              type\n              list\n              readonly\n              internal\n              nullable\n              requiresPermission\n              ui\n              label {\n                languageCode\n                value\n              }\n              description {\n                languageCode\n                value\n              }\n            }\n            ... on StringCustomFieldConfig {\n              pattern\n              length\n              options {\n                value\n                label {\n                  languageCode\n                  value\n                }\n              }\n            }\n            ... on LocaleStringCustomFieldConfig {\n              pattern\n              length\n            }\n            ... on IntCustomFieldConfig {\n              intMin: min\n              intMax: max\n              intStep: step\n            }\n            ... on FloatCustomFieldConfig {\n              floatMin: min\n              floatMax: max\n              floatStep: step\n            }\n            ... on DateTimeCustomFieldConfig {\n              datetimeMin: min\n              datetimeMax: max\n            }\n            ... on RelationCustomFieldConfig {\n              entity\n              scalarFields\n            }\n            ... on StructCustomFieldConfig {\n              fields {\n                ... on StructField {\n                  name\n                  type\n                  list\n                  label {\n                    languageCode\n                    value\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ServerConfigDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ShippingMethodList($options: ShippingMethodListOptions) {\n    shippingMethods(options: $options) {\n      items {\n        id\n        code\n        name\n        fulfillmentHandlerCode\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').ShippingMethodListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ShippingMethodDetail($id: ID!) {\n    shippingMethod(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      code\n      name\n      description\n      fulfillmentHandlerCode\n      checker {\n        code\n        args {\n          name\n          value\n        }\n      }\n      calculator {\n        code\n        args {\n          name\n          value\n        }\n      }\n      translations @customFields(entity: \"ShippingMethod\", locale: true) {\n        id\n        languageCode\n        name\n        description\n      }\n      customFields @customFields(entity: \"ShippingMethod\")\n    }\n  }\n"): typeof import('./graphql').ShippingMethodDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ShippingMethodOperations {\n    shippingEligibilityCheckers {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    shippingCalculators {\n      code\n      description\n      args {\n        name\n        type\n        list\n        required\n        defaultValue\n        label\n        description\n        ui\n      }\n    }\n    fulfillmentHandlers {\n      code\n      description\n    }\n  }\n"): typeof import('./graphql').ShippingMethodOperationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateShippingMethod($input: CreateShippingMethodInput!) {\n    createShippingMethod(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateShippingMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {\n    updateShippingMethod(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateShippingMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteShippingMethod($id: ID!) {\n    deleteShippingMethod(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteShippingMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TestShippingMethod($input: TestShippingMethodInput!) {\n    testShippingMethod(input: $input) {\n      eligible\n      quote {\n        price\n        priceWithTax\n        metadata\n      }\n    }\n  }\n"): typeof import('./graphql').TestShippingMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TestEligibleShippingMethods($input: TestEligibleShippingMethodsInput!) {\n    testEligibleShippingMethods(input: $input) {\n      id\n      code\n      name\n      price\n      priceWithTax\n    }\n  }\n"): typeof import('./graphql').TestEligibleShippingMethodsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query StockLocationList($options: StockLocationListOptions) {\n    stockLocations(options: $options) {\n      items {\n        id\n        name\n        description\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').StockLocationListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query StockLocationDetail($id: ID!) {\n    stockLocation(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      customFields @customFields(entity: \"StockLocation\")\n    }\n  }\n"): typeof import('./graphql').StockLocationDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateStockLocation($input: CreateStockLocationInput!) {\n    createStockLocation(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateStockLocationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateStockLocation($input: UpdateStockLocationInput!) {\n    updateStockLocation(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateStockLocationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteStockLocation($input: DeleteStockLocationInput!) {\n    deleteStockLocation(input: $input) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteStockLocationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickStockLocationOptions($options: StockLocationListOptions) {\n    stockLocations(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickStockLocationOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TaxCategoryList($options: TaxCategoryListOptions) {\n    taxCategories(options: $options) {\n      items {\n        id\n        name\n        isDefault\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').TaxCategoryListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TaxCategoryDetail($id: ID!) {\n    taxCategory(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      isDefault\n      customFields @customFields(entity: \"TaxCategory\")\n    }\n  }\n"): typeof import('./graphql').TaxCategoryDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {\n    createTaxCategory(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateTaxCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {\n    updateTaxCategory(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateTaxCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTaxCategory($id: ID!) {\n    deleteTaxCategory(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteTaxCategoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TaxRateList($options: TaxRateListOptions) {\n    taxRates(options: $options) {\n      items {\n        id\n        name\n        enabled\n        value\n        category {\n          id\n          name\n        }\n        zone {\n          id\n          name\n        }\n        customerGroup {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').TaxRateListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TaxRateDetail($id: ID!) {\n    taxRate(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      enabled\n      value\n      category {\n        id\n        name\n      }\n      zone {\n        id\n        name\n      }\n      customerGroup {\n        id\n        name\n      }\n      customFields @customFields(entity: \"TaxRate\")\n    }\n  }\n"): typeof import('./graphql').TaxRateDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TaxRateOptions {\n    taxCategories(options: { take: 100, sort: { name: ASC } }) {\n      items {\n        id\n        name\n      }\n    }\n    zones(options: { take: 100, sort: { name: ASC } }) {\n      items {\n        id\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').TaxRateOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTaxRate($input: CreateTaxRateInput!) {\n    createTaxRate(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateTaxRateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTaxRate($input: UpdateTaxRateInput!) {\n    updateTaxRate(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateTaxRateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTaxRate($id: ID!) {\n    deleteTaxRate(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteTaxRateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VariantList($options: ProductVariantListOptions, $productId: ID) {\n    productVariants(options: $options, productId: $productId) {\n      items {\n        id\n        name\n        sku\n        enabled\n        priceWithTax\n        currencyCode\n        featuredAsset {\n          id\n          preview\n        }\n        product {\n          id\n          name\n          featuredAsset {\n            id\n            preview\n          }\n        }\n        stockLevels {\n          id\n          stockOnHand\n          stockAllocated\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').VariantListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VariantDetail($id: ID!) {\n    productVariant(id: $id) {\n      id\n      createdAt\n      updatedAt\n      languageCode\n      name\n      sku\n      enabled\n      price\n      priceWithTax\n      currencyCode\n      trackInventory\n      outOfStockThreshold\n      useGlobalOutOfStockThreshold\n      taxCategory {\n        id\n        name\n      }\n      stockLevels {\n        id\n        stockLocationId\n        stockOnHand\n        stockAllocated\n        stockLocation {\n          id\n          name\n        }\n      }\n      options {\n        id\n        code\n        name\n        group {\n          id\n          name\n        }\n      }\n      facetValues {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      featuredAsset {\n        id\n        preview\n        name\n      }\n      assets {\n        id\n        preview\n        name\n      }\n      product {\n        id\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      translations @customFields(entity: \"ProductVariant\", locale: true) {\n        id\n        languageCode\n        name\n      }\n      customFields @customFields(entity: \"ProductVariant\")\n    }\n  }\n"): typeof import('./graphql').VariantDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VariantFormData {\n    taxCategories(options: { take: 100 }) {\n      items {\n        id\n        name\n        isDefault\n      }\n    }\n    stockLocations(options: { take: 100 }) {\n      items {\n        id\n        name\n      }\n    }\n    globalSettings {\n      id\n      trackInventory\n      outOfStockThreshold\n    }\n  }\n"): typeof import('./graphql').VariantFormDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VariantProduct($id: ID!) {\n    product(id: $id) {\n      id\n      name\n      optionGroups {\n        id\n        name\n        options {\n          id\n          code\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').VariantProductDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {\n    createProductVariants(input: $input) {\n      id\n      name\n      sku\n    }\n  }\n"): typeof import('./graphql').CreateProductVariantsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {\n    updateProductVariant(input: $input) {\n      id\n      updatedAt\n    }\n  }\n"): typeof import('./graphql').UpdateProductVariantDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProductVariant($id: ID!) {\n    deleteProductVariant(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteProductVariantDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ZoneList($options: ZoneListOptions) {\n    zones(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').ZoneListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ZoneDetail($id: ID!) {\n    zone(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      members {\n        id\n        code\n        name\n        enabled\n      }\n      customFields @customFields(entity: \"Zone\")\n    }\n  }\n"): typeof import('./graphql').ZoneDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateZone($input: CreateZoneInput!) {\n    createZone(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateZoneDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateZone($input: UpdateZoneInput!) {\n    updateZone(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateZoneDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteZone($id: ID!) {\n    deleteZone(id: $id) {\n      result\n      message\n    }\n  }\n"): typeof import('./graphql').DeleteZoneDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {\n    addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddMembersToZoneDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {\n    removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {\n      id\n    }\n  }\n"): typeof import('./graphql').RemoveMembersFromZoneDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickProducts($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        slug\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickVariants($options: ProductVariantListOptions) {\n    productVariants(options: $options) {\n      items {\n        id\n        name\n        sku\n        priceWithTax\n        currencyCode\n        featuredAsset {\n          id\n          preview\n        }\n        product {\n          id\n          featuredAsset {\n            id\n            preview\n          }\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickVariantsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickCustomers($options: CustomerListOptions) {\n    customers(options: $options) {\n      items {\n        id\n        firstName\n        lastName\n        emailAddress\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickCustomersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickFacetValues($options: FacetValueListOptions) {\n    facetValues(options: $options) {\n      items {\n        id\n        name\n        code\n        facet {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickFacetValuesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickCustomerGroups($options: CustomerGroupListOptions) {\n    customerGroups(options: $options) {\n      items {\n        id\n        name\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickCustomerGroupsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickCollections($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        name\n        slug\n        breadcrumbs {\n          id\n          name\n        }\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickCollectionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickAssets($options: AssetListOptions) {\n    assets(options: $options) {\n      items {\n        id\n        name\n        preview\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickAssetsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PickCountries($options: CountryListOptions) {\n    countries(options: $options) {\n      items {\n        id\n        code\n        name\n        enabled\n      }\n      totalItems\n    }\n  }\n"): typeof import('./graphql').PickCountriesDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
