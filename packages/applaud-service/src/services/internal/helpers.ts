import { Logger } from "log4js";
import { Model, QueryBuilder } from "objection";
import { PaginationArgs, DateQuery } from "./common";

export function handlePagination<QM extends Model, QR, QV>(
  builder: QueryBuilder<QM, QR, QV>,
  args: PaginationArgs
) {
  if (args.limit) {
    builder.limit(args.limit);
  }

  if (args.offset) {
    builder.offset(args.offset);
  }
}

interface ExecuteOptions {
  logger?: Logger;
  showLogging?: boolean;
}

export async function executeSelectAll<QM extends Model, QR, QV>(
  builder: QueryBuilder<QM, QR, QV>,
  options?: ExecuteOptions
) {
  if (options && options.logger && options.showLogging) {
    options.logger.debug(builder.toSql());
  }
  return await builder;
}

export async function executeSelectFirst<QM extends Model, QR, QV>(
  builder: QueryBuilder<QM, QR, QV>,
  options?: ExecuteOptions
) {
  if (options && options.logger && options.showLogging) {
    options.logger.debug(builder.toSql());
  }
  return (await builder.first()) || null;
}

export async function executeSelectCount<QM extends Model, QR, QV>(
  builder: QueryBuilder<QM, QR, QV>,
  options?: ExecuteOptions
) {
  if (options && options.logger && options.showLogging) {
    options.logger.debug(builder.toSql());
  }
  return builder.resultSize();
}

// Allow for querying based on a date using several operators
export function generateDateQuery<QM extends Model, QR, QV>(
  queryBuilder: QueryBuilder<QM, QR, QV>,
  column: string,
  dateQuery: DateQuery
) {
  queryBuilder.whereWrapped(queryBuilder => {
    if (dateQuery.eq) {
      queryBuilder.where(column, dateQuery.eq);
    }
    if (dateQuery.gt) {
      queryBuilder.where(column, ">", dateQuery.gt);
    } else if (dateQuery.gte) {
      queryBuilder.where(column, ">=", dateQuery.gte);
    }
    if (dateQuery.lt) {
      queryBuilder.where(column, "<", dateQuery.lt);
    } else if (dateQuery.lte) {
      queryBuilder.where(column, "<=", dateQuery.lte);
    }
    if (dateQuery.orIsNull) {
      queryBuilder.orWhereNull(column);
    }
  });
  return queryBuilder;
}
