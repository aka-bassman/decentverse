import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloClient, InMemoryCache, split, from } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

export const getUploadLink = (uri?: string) => {
  const token = localStorage.getItem("currentUser");
  return createUploadLink({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
    uri: uri ?? "localhost:3333",
  });
};

const getSplitLink = (uri?: string) =>
  process.browser
    ? split(({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      }, getUploadLink())
    : getUploadLink();

const client = new ApolloClient({
  link: getSplitLink(),
  cache: new InMemoryCache(),
});
export const setLink = (uri: string) => client.setLink(getSplitLink(uri));
export default client;
