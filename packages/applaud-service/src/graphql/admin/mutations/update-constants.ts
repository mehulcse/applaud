import {GraphQLContext} from "../../../types/graphql-context";
import {ConstantService} from "../../../services/internal/services/constant-service";

interface UpdateConstantsInput {
  constantId: number;
  name?: string;
  value?: string;
}

interface UpdateConstantsInputArgs {
  input: UpdateConstantsInput;
}

export default {
  Mutation: {
    updateConstants: async (
      _: any,
      args: UpdateConstantsInputArgs,
      {context}: GraphQLContext
    ) => {
      const {constantId, ...updates} = args.input;
      const constant = await new ConstantService(context).update(constantId, updates);
      return {
        constant
      };
    }
  }
};
