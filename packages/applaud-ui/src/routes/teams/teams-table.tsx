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
import { TeamsQueryResult } from "../../generated/graphql";
import NoDataAvailable from "../../components/no-data-available";
import AppIcon from "../../components/app-icon";
import Loader from "../../components/loader";
import ErrorCard from "../../components/error-card";
import {
  PAGE_LIMIT,
  LOADER_TYPE,
  SCROLL_THRESHOLD
} from "../../constants/constants";
import { StyledTableWrapper } from "../../components/table-wrapper";

interface Props {
  queryResult: TeamsQueryResult;
  onEditClick: (teamId: number) => void;
}

function TeamsTable(props: Props) {
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
      data?.teams?.nodes &&
      data.teams.nodes.length < data.teams.totalCount &&
      scrollableRef?.current &&
      scrollableRef.current.scrollTop + scrollableRef.current.clientHeight >=
        scrollableRef.current.scrollHeight * SCROLL_THRESHOLD
    ) {
      queryResult.fetchMore({
        variables: {
          offset: data.teams.nodes.length,
          limit: PAGE_LIMIT
        },
        updateQuery: (
          prev: any,
          { fetchMoreResult }: { fetchMoreResult?: any }
        ) => {
          if (!fetchMoreResult) {
            return prev;
          }
          if (prev?.teams?.nodes && fetchMoreResult && fetchMoreResult.teams) {
            return Object.assign({}, prev, {
              ...prev,
              teams: {
                ...prev.teams,
                nodes: [...prev.teams.nodes, ...fetchMoreResult.teams.nodes]
              }
            });
          }
          return prev;
        }
      });
    }
  }

  let count = 0;

  if (data?.teams?.totalCount) {
    count = data.teams.totalCount;
  }

  function renderTableBody() {
    if (data?.teams?.nodes?.length) {
      return data.teams.nodes.map((team: any, index: number) => (
        <TableRow key={team.id} hover id={team.id}>
          <TableCell>{team.id}</TableCell>
          <TableCell>{team.name}</TableCell>
          <TableCell align="center">
            <Tooltip title="Edit">
              <IconButton
                color="inherit"
                component={Button}
                id={`btn-edit_${team.id}`}
                aria-label="Edit"
                onClick={onEditClick.bind(null, team.id)}
              >
                <AppIcon icon={faEdit} size="lg" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ));
    } else if (error) {
      return (
        <TableRow>
          <TableCell colSpan={3}>
            <ErrorCard error={error} />
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <NoDataAvailable />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <StyledTableWrapper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Id</strong>
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Action</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ overflow: "auto" }} ref={scrollableRef}>
          {!loading && renderTableBody()}
          {loading && <Loader type={LOADER_TYPE.table} />}
        </TableBody>
      </Table>
    </StyledTableWrapper>
  );
}

export default TeamsTable;
