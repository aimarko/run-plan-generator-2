/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWeek = /* GraphQL */ `
  mutation CreateWeek(
    $input: CreateWeekInput!
    $condition: ModelWeekConditionInput
  ) {
    createWeek(input: $input, condition: $condition) {
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
export const updateWeek = /* GraphQL */ `
  mutation UpdateWeek(
    $input: UpdateWeekInput!
    $condition: ModelWeekConditionInput
  ) {
    updateWeek(input: $input, condition: $condition) {
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
export const deleteWeek = /* GraphQL */ `
  mutation DeleteWeek(
    $input: DeleteWeekInput!
    $condition: ModelWeekConditionInput
  ) {
    deleteWeek(input: $input, condition: $condition) {
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
