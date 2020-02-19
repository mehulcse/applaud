import Domain from "../../../services/internal/db/models/domain";
import { GraphQLContext } from "../../../types/graphql-context";
import { DomainService } from "../../../services/internal/services/domain-service";

interface Args {
  id: string;
}

export default {
  Query: {
    domain: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Domain | null> => {
      const domain = await new DomainService(context).getById(args.id);
      return domain;
    }
  }
};
