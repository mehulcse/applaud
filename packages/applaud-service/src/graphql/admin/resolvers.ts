import { merge } from "lodash";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";

import categoriesQuery from "./queries/categories";
import categoryQuery from "./queries/category";
import createCategoryMutation from "./mutations/create-category";
import createDomainMutation from "./mutations/create-domain";
import createDomainCategoryMutation from "./mutations/create-domain-category";
import createPartnerMutation from "./mutations/create-partner";
import createPartnerAvailableProductMutation from "./mutations/create-partner-available-product";
import createPartnerUserMutation from "./mutations/create-partner-user";
import createUserMutation from "./mutations/create-user";
import createUserRoleMutation from "./mutations/create-user-role";
import createVendorMutation from "./mutations/create-vendor";
import createVendorUserMutation from "./mutations/create-vendor-user";
import createSiteMutation from "./mutations/create-site";
import createSitePostMutation from "./mutations/create-site-post";
import customerQuery from "./queries/customer";
import customersQuery from "./queries/customers";
import customerType from "./types/customer";
import deleteDomainCategoryMutation from "./mutations/delete-domain-category";
import domainsQuery from "./queries/domains";
import domainQuery from "./queries/domain";
import domainType from "./types/domain";
import domainCategoryType from "./types/domain-category";
import domainStatuses from "./queries/domain-status";
import loginUserMutation from "./mutations/login-user";
import logoutUserMutation from "./mutations/logout-user";
import orderQuery from "./queries/order";
import ordersQuery from "./queries/orders";
import orderType from "./types/order";
import orderStatuses from "./queries/order-status";
import partnerAvailableProductType from "./types/partner-available-product";
import partnerProductType from "./types/partner-product";
import partnerQuery from "./queries/partner";
import partnersQuery from "./queries/partners";
import partnerType from "./types/partner";
import partnerUserType from "./types/partner-user";
import productsQuery from "./queries/products";
import updateCategoryMutation from "./mutations/update-category";
import updatePartnerMutation from "./mutations/update-partner";
import updatePartnerAvailableProductMutation from "./mutations/update-partner-available-product";
import updatePartnerUser from "./mutations/update-partner-user";
import updateVendorMutation from "./mutations/update-vendor";
import updateVendorUserMutation from "./mutations/update-vendor-user";
import updateSitePostMutation from "./mutations/update-site-post";
import deleteSitePostMutation from "./mutations/delete-site-post";
import userQuery from "./queries/user";
import usersQuery from "./queries/users";
import userType from "./types/user";
import vendorQuery from "./queries/vendor";
import vendorsQuery from "./queries/vendors";
import vendorType from "./types/vendor";
import vendorUserType from "./types/vendor-user";
import sitePostQuery from "./queries/site-post";
import sitePostsQuery from "./queries/site-posts";
import sitePostType from "./types/site-post";
import viewerQuery from "./queries/viewer";
import rolesQuery from "./queries/roles";
import sitesQuery from "./queries/sites";
import siteQuery from "./queries/site";
import siteDeployStatusesQuery from "./queries/site-deploy-status";
import siteType from "./types/site";

export default merge(
  { Date: GraphQLDate, DateTime: GraphQLDateTime, Time: GraphQLTime },
  categoriesQuery,
  categoryQuery,
  createCategoryMutation,
  createDomainMutation,
  createDomainCategoryMutation,
  createPartnerMutation,
  createPartnerAvailableProductMutation,
  createPartnerUserMutation,
  createUserMutation,
  createUserRoleMutation,
  createVendorMutation,
  createVendorUserMutation,
  createSiteMutation,
  createSitePostMutation,
  customerQuery,
  customersQuery,
  customerType,
  domainsQuery,
  domainQuery,
  domainType,
  domainCategoryType,
  domainStatuses,
  deleteDomainCategoryMutation,
  loginUserMutation,
  logoutUserMutation,
  orderQuery,
  ordersQuery,
  orderType,
  orderStatuses,
  partnerAvailableProductType,
  partnerProductType,
  partnerQuery,
  partnersQuery,
  partnerType,
  partnerUserType,
  productsQuery,
  updateCategoryMutation,
  updatePartnerAvailableProductMutation,
  updatePartnerMutation,
  updatePartnerUser,
  updateVendorMutation,
  updateVendorUserMutation,
  updateSitePostMutation,
  deleteSitePostMutation,
  userQuery,
  usersQuery,
  userType,
  vendorQuery,
  vendorsQuery,
  vendorType,
  vendorUserType,
  sitePostQuery,
  sitePostsQuery,
  sitePostType,
  viewerQuery,
  rolesQuery,
  sitesQuery,
  siteQuery,
  siteDeployStatusesQuery,
  siteType
);
