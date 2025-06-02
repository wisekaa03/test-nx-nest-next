import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(user: { username: $username, password: $password }) {
      token
      user {
        username
        email
      }
    }
  }
`;
