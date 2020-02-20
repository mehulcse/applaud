import { QueryBuilder, Model } from "objection";

export interface PaginationArgs<SortType = string> {
  limit?: number;
  offset?: number;
  sort?: SortType;
}

export interface QueryInitializationResult<T extends Model> {
  query: QueryBuilder<T, T[], T[]>;
}

export interface DateQuery {
  eq?: Date;
  gt?: Date;
  gte?: Date;
  lt?: Date;
  lte?: Date;
  orIsNull?: boolean;
}
