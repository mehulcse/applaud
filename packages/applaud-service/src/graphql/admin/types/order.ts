import { GraphQLContext } from "../../../types/graphql-context";
import Customer from "../../../services/internal/db/models/customer";
import { CustomerKeywordService } from "../../../services/internal/services/customer-keyword-service";
import CustomerKeyword from "../../../services/internal/db/models/customer-keyword";
import Order, {
  ORDER_STATUS,
  OrderStatus
} from "../../../services/internal/db/models/order";
import PartnerProduct from "../../../services/internal/db/models/partner-product";
import { PartnerProductService } from "../../../services/internal/services/partner-product-service";
import User from "../../../services/internal/db/models/user";
import { UserService } from "../../../services/internal/services/user-service";
import { CustomerService } from "../../../services/internal/services/customer-service";

export default {
  Order: {
    customer: async (
      order: Order,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Customer | null> => {
      const customer = await new CustomerService(context).getById(
        order.customerId
      );
      return customer || null;
    },
    user: async (
      order: Order,
      _args: any,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(order.userId);
      return user;
    },
    partnerProduct: async (
      order: Order,
      _args: any,
      { context }: GraphQLContext
    ): Promise<PartnerProduct | null> => {
      const partnerProduct = await new PartnerProductService(context).getById(
        order.partnerProductId
      );
      return partnerProduct || null;
    },
    customerKeyword: async (
      order: Order,
      _args: any,
      { context }: GraphQLContext
    ): Promise<CustomerKeyword | null> => {
      if (!order.customerKeywordId) {
        return null;
      }
      const customerKeyword = await new CustomerKeywordService(context).getById(
        order.customerKeywordId
      );
      return customerKeyword || null;
    },
    status: async (order: Order, _args: any): Promise<OrderStatus | null> => {
      const orderStatus = Object.entries(ORDER_STATUS).find(
        arr => arr[1].id === order.status
      );
      if (orderStatus) {
        return orderStatus[1];
      }
      return null;
    }
  }
};
