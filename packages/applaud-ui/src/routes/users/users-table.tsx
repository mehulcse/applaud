import React, { useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from "@material-ui/core";
import { UsersQueryResult } from "../../generated/graphql";
import NoDataAvailable from "../../components/no-data-available";
import AppLink from "../../components/app-link";
import Loader from "../../components/loader";
import ErrorCard from "../../components/error-card";
import {
  PAGE_LIMIT,
  LOADER_TYPE,
  SCROLL_THRESHOLD
} from "../../constants/constants";

interface Props {
  queryResult: UsersQueryResult;
}

function UsersTable(props: Props) {
  const { queryResult } = props;
  const { loading, data, error } = queryResult;

  const scrollableRef = useRef<Element>(null);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function handleScroll() {
    if (
      !loading &&
      data?.users?.nodes &&
      data.users.nodes.length < data.users.totalCount &&
      scrollableRef?.current &&
      scrollableRef.current.scrollTop + scrollableRef.current.clientHeight >=
        scrollableRef.current.scrollHeight * SCROLL_THRESHOLD
    ) {
      queryResult.fetchMore({
        variables: {
          offset: data.users.nodes.length,
          limit: PAGE_LIMIT
        },
        updateQuery: (
          prev: any,
          { fetchMoreResult }: { fetchMoreResult?: any }
        ) => {
          if (!fetchMoreResult) {
            return prev;
          }
          if (prev?.users?.nodes && fetchMoreResult && fetchMoreResult.users) {
            return Object.assign({}, prev, {
              ...prev,
              users: {
                ...prev.users,
                nodes: [...prev.users.nodes, ...fetchMoreResult.users.nodes]
              }
            });
          }
          return prev;
        }
      });
    }
  }

  let count = 0;

  if (data?.users?.totalCount) {
    count = data.users.totalCount;
  }

  function renderTableBody() {
    if (data?.users?.nodes.length) {
      return data.users.nodes.map((user: any, index: number) => (
        <TableRow key={user.id} hover id={user.id}>
          <TableCell>
            <AppLink to={`/users/${user.id}`}>{user.id}</AppLink>
          </TableCell>
          <TableCell>
            <AppLink to={`/users/${user.id}`}>{user.fullName}</AppLink>
          </TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{/* TODO: uncomment user.team.name */}</TableCell>
          <TableCell>{/* TODO: uncomment user.department.name */}</TableCell>
        </TableRow>
      ));
    } else if (error) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <ErrorCard error={error} />
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <NoDataAvailable />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <strong>Id</strong>
          </TableCell>
          <TableCell>
            <strong>Name</strong>
          </TableCell>
          <TableCell>
            <strong>Email</strong>
          </TableCell>
          <TableCell>
            <strong>Team</strong>
          </TableCell>
          <TableCell>
            <strong>Department</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody style={{ overflow: "auto" }} ref={scrollableRef}>
        {!loading && renderTableBody()}
        {loading && <Loader type={LOADER_TYPE.table} />}
      </TableBody>
    </Table>
  );
}

export default UsersTable;
