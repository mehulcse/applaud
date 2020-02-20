import { QueryBuilder, Model } from "objection";
import { ValidationError } from "yup";
// import { UserInputError } from "apollo-server-express";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { formatApolloErrors, ApolloError } from "apollo-server-core";
import { getLogger } from "../logger";

export interface Connection<T> {
  totalCount: number;
  nodes: T[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface PaginationArgs<SortType = string> {
  limit: number;
  offset: number;
  sort: SortType;
}

export function handlePagination<QM extends Model, QR, QV>(
  builder: QueryBuilder<QM, QR, QV>,
  args: PaginationArgs
) {
  if (args.limit) {
    builder.limit(args.limit);
  } else {
    builder.limit(1000);
  }

  if (args.offset) {
    builder.offset(args.offset);
  }
}

export function buildPageInfo(totalCount: number, args: PaginationArgs) {
  return {
    hasNextPage: (args.offset || 0) + (args.limit || 1000) < totalCount,
    hasPreviousPage: totalCount > 0 && (args.offset || 0) > 0
  };
}

export const transformError = (e: GraphQLError): GraphQLFormattedError => {
  // const error = new ApolloError("This is a test.");
  // return formatApolloErrors([error])[0];
  const logger = getLogger();
  logger.debug(e.name, { e });
  if (e.originalError && e.originalError.name === "ValidationError") {
    console.log("got here");
    const validationError = e.originalError as ValidationError;
    const newError = new ApolloError(
      `${validationError.message}`,
      "BAD_INPUT_ERROR",
      {
        test: "this is a test."
      }
    );
    // return new UserInputError("Arguments invalid.", {
    //   invalidArgs: validationError.inner.map((innerError: ValidationError) => ({
    //     field: innerError.path,
    //     type: innerError.type,
    //     message: innerError.message
    //   }))
    // });
    return formatApolloErrors([newError], {})[0];
  }
  return formatApolloErrors([e])[0];
};
