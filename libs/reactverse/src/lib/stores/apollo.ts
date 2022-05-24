import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloClient, InMemoryCache, split, from } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

let uri: string;
export const getUploadLink = (connectUri?: string) => {
  const token = localStorage.getItem("currentUser");
  uri = connectUri ?? "http://localhost:3333/graphql";
  return createUploadLink({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
    uri,
  });
};

// const getSplitLink = (uri?: string) =>
//   process.browser
//     ? split(({ query }) => {
//         const definition = getMainDefinition(query);
//         return definition.kind === "OperationDefinition" && definition.operation === "subscription";
//       }, getUploadLink())
//     : getUploadLink();

const client = new ApolloClient({
  link: getUploadLink(),
  cache: new InMemoryCache(),
});
export const setLink = (uri?: string) => client.setLink(getUploadLink(uri));
export default client;
