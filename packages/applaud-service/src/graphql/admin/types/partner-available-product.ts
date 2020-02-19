import Product from "../../../services/internal/db/models/product";
import { ProductService } from "../../../services/internal/services/product-service";
import { GraphQLContext } from "../../../types/graphql-context";
import PartnerAvailableProduct from "../../../services/internal/db/models/partner-available-product";
import Partner from "../../../services/internal/db/models/partner";
import { PartnerService } from "../../../services/internal/services/partner-service";

export default {
  PartnerAvailableProduct: {
    partner: async (
      partnerAvailableProduct: PartnerAvailableProduct,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Partner | null> => {
      const partner = await new PartnerService(context).getById(
        partnerAvailableProduct.partnerId
      );
      return partner;
    },
    product: async (
      partnerAvailableProduct: PartnerAvailableProduct,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Product | null> => {
      const product = await new ProductService(context).getById(
        partnerAvailableProduct.productId
      );
      return product;
    }
  }
};
