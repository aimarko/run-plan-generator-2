/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWeek = /* GraphQL */ `
  query GetWeek($id: ID!) {
    getWeek(id: $id) {
      id
      weeksToRace
      buildPercent
      cutbackWeek
      cutbackAmount
      runsPerWeek
      startingMileage
      runPercents
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listWeeks = /* GraphQL */ `
  query ListWeeks(
    $filter: ModelWeekFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWeeks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        weeksToRace
        buildPercent
        cutbackWeek
        cutbackAmount
        runsPerWeek
        startingMileage
        runPercents
        notes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

// graphql/queries.ts
export const QueryAllWeeks = /* GraphQL */ `
  query QueryAllWeeks {
    listWeeks {
      items {
        id
        weeksToRace
        buildPercent
        cutbackWeek
        cutbackAmount
        runsPerWeek
        startingMileage
        runPercents
        notes
        createdAt
        updatedAt
        __typename
      }
    }
  }
`;
