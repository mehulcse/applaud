import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerAvailableProductService } from "../../../services/internal/services/partner-available-product-service";

interface UpdatePartnerAvailableProductInput {
  partnerAvailableProductId: number;
  wholesalePrice: number;
}

interface UpdatePartnerAvailableProductInputArgs {
  input: UpdatePartnerAvailableProductInput;
}

export default {
  Mutation: {
    updatePartnerAvailableProduct: async (
      _: any,
      args: UpdatePartnerAvailableProductInputArgs,
      { context }: GraphQLContext
    ) => {
      const { partnerAvailableProductId, ...updates } = args.input;

      const updatedPartnerAvailableProduct = await new PartnerAvailableProductService(
        context
      ).update(partnerAvailableProductId, updates);

      return { partnerAvailableProduct: updatedPartnerAvailableProduct };
    }
  }
};
