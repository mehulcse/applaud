import { GraphQLContext } from "../../../types/graphql-context";
import { DomainService } from "../../../services/internal/services/domain-service";

interface CreateDomainInput {
  id: string;
}

interface Args {
  input: CreateDomainInput;
}

export default {
  Mutation: {
    createDomain: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const domain = await new DomainService(context).create(args.input);

      return {
        domain
      };
    }
  }
};
