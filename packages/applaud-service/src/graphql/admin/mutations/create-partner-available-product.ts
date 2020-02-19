import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerAvailableProductService } from "../../../services/internal/services/partner-available-product-service";

interface CreatePartnerAvailableProductInput {
  partnerId: number;
  productId: string;
  wholesalePrice: number;
}

interface Args {
  input: CreatePartnerAvailableProductInput;
}

export default {
  Mutation: {
    createPartnerAvailableProduct: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const partnerAvailableProduct = await new PartnerAvailableProductService(
        context
      ).create(args.input);

      return {
        partnerAvailableProduct
      };
    }
  }
};
