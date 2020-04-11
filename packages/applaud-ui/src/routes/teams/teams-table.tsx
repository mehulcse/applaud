import React from "react";
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
import AppLink from "../../components/app-link";

interface Props {
  queryResult: TeamsQueryResult;
  onEditClick: (teamId: number) => void;
}

class TeamsTable extends React.Component<Props> {
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
      data?.teams?.nodes &&
      data.teams.nodes.length < data.teams.totalCount &&
      this.scrollableRef &&
      this.scrollableRef.scrollTop + this.scrollableRef.clientHeight >=
        this.scrollableRef.scrollHeight * SCROLL_THRESHOLD
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
  };

  renderTableBody = () => {
    const { queryResult, onEditClick } = this.props;
    const { data, error, loading } = queryResult;

    if (data?.teams?.nodes?.length) {
      return data.teams.nodes.map((team: any, index: number) => (
        <TableRow key={team.id} hover id={team.id}>
          <TableCell>
            <AppLink to={`/teams/${team.id}`}>{team.name}</AppLink>
          </TableCell>
          <TableCell>{team.description}</TableCell>
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
                <strong>Description</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Action</strong>
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

export default TeamsTable;
