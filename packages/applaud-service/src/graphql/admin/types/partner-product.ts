import PartnerProduct from "../../../services/internal/db/models/partner-product";
import Product from "../../../services/internal/db/models/product";
import { ProductService } from "../../../services/internal/services/product-service";
import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";
import User from "../../../services/internal/db/models/user";
import Partner from "../../../services/internal/db/models/partner";
import { PartnerService } from "../../../services/internal/services/partner-service";

export default {
  PartnerProduct: {
    addedByUser: async (
      partnerProduct: PartnerProduct,
      _args: any,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(
        partnerProduct.addedByUserId
      );
      return user;
    },
    product: async (
      partnerProduct: PartnerProduct,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Product | null> => {
      const product = await new ProductService(context).getById(
        partnerProduct.productId
      );
      return product;
    },
    partner: async (
      partnerProduct: PartnerProduct,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Partner | null> => {
      const partner = await new PartnerService(context).getById(
        partnerProduct.partnerId
      );
      return partner;
    }
  }
};
