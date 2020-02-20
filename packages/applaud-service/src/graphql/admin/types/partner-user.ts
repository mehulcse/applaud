import PartnerUser from "../../../services/internal/db/models/partner-user";
import { UserService } from "../../../services/internal/services/user-service";
import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerService } from "../../../services/internal/services/partner-service";
import Partner from "../../../services/internal/db/models/partner";
import User from "../../../services/internal/db/models/user";

export default {
  PartnerUser: {
    user: async (
      partnerUser: PartnerUser,
      _args: any,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(partnerUser.userId);
      return user;
    },
    partner: async (
      partnerUser: PartnerUser,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Partner | null> => {
      const partner = await new PartnerService(context).getById(
        partnerUser.partnerId
      );
      return partner;
    },
    addedByUser: async (
      partnerUser: PartnerUser,
      _args: any,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(
        partnerUser.addedByUserId
      );
      return user;
    }
  }
};
