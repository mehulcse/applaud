import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography
} from "@material-ui/core";
import { UsersQueryResult, Team } from "../../generated/graphql";
import NoDataAvailable from "../../components/no-data-available";
import AppLink from "../../components/app-link";
import Loader from "../../components/loader";
import ErrorCard from "../../components/error-card";
import {
  PAGE_LIMIT,
  LOADER_TYPE,
  SCROLL_THRESHOLD
} from "../../constants/constants";
import { StyledTableWrapper } from "../../components/table-wrapper";

interface Props {
  queryResult: UsersQueryResult;
}

class UsersTable extends React.Component<Props> {
  private scrollableRef: HTMLElement | null = null;

  componentDidUpdate() {
    window.addEventListener("scroll", this.handleScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { queryResult } = this.props;
    const { loading, data } = queryResult;
    if (
      !loading &&
      data?.users?.nodes &&
      data.users.nodes.length < data.users.totalCount &&
      this.scrollableRef &&
      this.scrollableRef.scrollTop + this.scrollableRef.clientHeight >=
        this.scrollableRef.scrollHeight * SCROLL_THRESHOLD
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
  };

  renderTableBody = () => {
    const { queryResult } = this.props;
    const { data, error, loading } = queryResult;

    if (data?.users?.nodes.length) {
      return data.users.nodes.map((user: any, index: number) => (
        <TableRow key={user.id} hover id={user.id}>
          <TableCell>
            <AppLink to={`/users/${user.id}`}>{user.fullName}</AppLink>
          </TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            {user.teams &&
              user.teams.length > 0 &&
              user.teams.map((team: Team, index: number) => (
                <Typography variant="body2" key={index}>
                  <AppLink to={`/teams/${team.id}`}>{team.name}</AppLink>
                </Typography>
              ))}
          </TableCell>
        </TableRow>
      ));
    } else if (!loading) {
      if (error) {
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
    return;
  };

  render() {
    const { queryResult } = this.props;
    const { loading } = queryResult;
    return (
      <StyledTableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Team</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            style={{ overflow: "auto" }}
            ref={(ref: HTMLTableElement) => (this.scrollableRef = ref)}
          >
            {this.renderTableBody()}
            {loading && <Loader type={LOADER_TYPE.table} />}
          </TableBody>
        </Table>
      </StyledTableWrapper>
    );
  }
}

export default UsersTable;
