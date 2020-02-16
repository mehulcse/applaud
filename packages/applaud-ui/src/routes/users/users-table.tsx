import React, { useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  Tooltip,
  Button
} from "@material-ui/core";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import NoDataAvailable from "../../components/no-data-available";
import AppIcon from "../../components/app-icon";
import Loader from "../../components/loader";
import ErrorCard from "../../components/error-card";
import { PAGE_LIMIT, LOADER_TYPE, SCROLL_THRESHOLD } from "../../constants/constants";

// TODO: remove any type with queryresult type
interface Props {
  queryResult: any;
  onEditClick: (userId: number) => void;
}

function UsersTable(props: Props) {
  const { queryResult, onEditClick } = props;
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
      data.users.nodes.length <
      data.users.totalCount &&
      scrollableRef?.current &&
      scrollableRef.current.scrollTop + scrollableRef.current.clientHeight >=
      scrollableRef.current.scrollHeight * SCROLL_THRESHOLD
    ) {
      queryResult.fetchMore({
        variables: {
          offset: data.users.nodes.length,
          limit: PAGE_LIMIT,
        },
        updateQuery: (
          prev: any,
          { fetchMoreResult }: { fetchMoreResult?: any }
        ) => {
          if (!fetchMoreResult) {
            return prev;
          }
          if (
            prev?.users?.nodes &&
            fetchMoreResult &&
            fetchMoreResult.users
          ) {
            return Object.assign({}, prev, {
              ...prev,
              users: {
                ...prev.users,
                  nodes: [
                    ...prev.users.nodes,
                    ...fetchMoreResult.users.nodes
                  ]
                }
              }
            );
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
      return (
        data.users.nodes.map(
          (
            user: any,
            index: number
          ) => (
            <TableRow key={user.id} hover id={user.id}>
              <TableCell>
                {user.id}
              </TableCell>
              <TableCell>
                {user.fullName}
              </TableCell>
              <TableCell>
                {user.email}
              </TableCell>
              <TableCell>
                {user.team.name}
              </TableCell>
              <TableCell>
                {user.department.name}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Edit">
                  <IconButton
                    color="inherit"
                    component={Button}
                    id={`btn-edit_${user.id}`}
                    aria-label="Edit"
                    onClick={onEditClick.bind(null, user.id)}
                  >
                    <AppIcon icon={faEdit} size="lg" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )
        )
      );
    } else if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <ErrorCard error={error} />
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow>
        <TableCell colSpan={6}>
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
          <TableCell align="center">
            <strong>Action</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody style={{overflow: "auto"}} ref={scrollableRef}>
        {!loading && renderTableBody()}
        {loading && <Loader type={LOADER_TYPE.table} />}
      </TableBody>
    </Table>
  );
}

export default UsersTable;