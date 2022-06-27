import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";
import * as types from "./character.types";

// * Character Query
export type CharacterQuery = { character: types.Character };
export const characterQuery = gql`
  ${types.characterFragment}
  query character($characterId: ID) {
    character(characterId: $characterId) {
      ...characterFragment
    }
  }
`;
export const character = async (characterId: string) =>
  (
    await client.query<CharacterQuery>({
      query: characterQuery,
      variables: { characterId },
    })
  ).data.character;

// * Characters Query
export type CharactersQuery = { characters: types.Character[] };
export const charactersQuery = gql`
  ${types.characterFragment}
  query characters($query: JSONObject, $skip: Int, $limit: Int) {
    characters(query: $query, skip: $skip, limit: $limit) {
      ...characterFragment
    }
  }
`;
export const characters = async (query: any, skip: number, limit: number) =>
  (
    await client.query<CharactersQuery>({
      query: charactersQuery,
      variables: { query, skip, limit },
    })
  ).data.characters;

// * Create Character Mutation
export type CreateCharacterMutation = { createCharacter: types.Character };
export const createCharacterMutation = gql`
  ${types.characterFragment}
  mutation createCharacter($data: CharacterInput) {
    createCharacter(data: $data) {
      ...characterFragment
    }
  }
`;
export const createCharacter = async (data: types.CharacterInput) =>
  (
    await client.mutate<CreateCharacterMutation>({
      mutation: createCharacterMutation,
      variables: { data },
    })
  ).data?.createCharacter;

// * Update Character Mutation
export type UpdateCharacterMutation = { updateCharacter: types.Character };
export const updateCharacterMutation = gql`
  ${types.characterFragment}
  mutation updateCharacter($adminId: ID, $data: CharacterInput) {
    updateCharacter(adminId: $admin, data: $data) {
      ...characterFragment
    }
  }
`;
export const updateCharacter = async (characterId: string, data: types.CharacterInput) =>
  (
    await client.mutate<UpdateCharacterMutation>({
      mutation: updateCharacterMutation,
      variables: { characterId, data },
    })
  ).data?.updateCharacter;

// * Remove Admin Mutation
export type RemoveCharacterMutation = { removeCharacter: types.Character };
export const removeCharacterMutation = gql`
  ${types.characterFragment}
  mutation removeCharacter($characterId: CharacterInput) {
    removeCharacter(characterId: $characterId) {
      ...characterFragment
    }
  }
`;
export const removeCharacter = async (characterId: string) =>
  (
    await client.mutate<RemoveCharacterMutation>({
      mutation: removeCharacterMutation,
      variables: { characterId },
    })
  ).data?.removeCharacter;
