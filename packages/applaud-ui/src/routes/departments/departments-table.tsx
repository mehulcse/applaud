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
import { DepartmentsQueryResult } from "../../generated/graphql";
import NoDataAvailable from "../../components/no-data-available";
import AppIcon from "../../components/app-icon";
import Loader from "../../components/loader";
import ErrorCard from "../../components/error-card";
import {
  PAGE_LIMIT,
  LOADER_TYPE,
  SCROLL_THRESHOLD
} from "../../constants/constants";

interface Props {
  queryResult: DepartmentsQueryResult;
  onEditClick: (departmentId: number) => void;
}

function DepartmentsTable(props: Props) {
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
      data?.departments?.nodes &&
      data.departments.nodes.length < data.departments.totalCount &&
      scrollableRef?.current &&
      scrollableRef.current.scrollTop + scrollableRef.current.clientHeight >=
        scrollableRef.current.scrollHeight * SCROLL_THRESHOLD
    ) {
      queryResult.fetchMore({
        variables: {
          offset: data.departments.nodes.length,
          limit: PAGE_LIMIT
        },
        updateQuery: (
          prev: any,
          { fetchMoreResult }: { fetchMoreResult?: any }
        ) => {
          if (!fetchMoreResult) {
            return prev;
          }
          if (
            prev?.departments?.nodes &&
            fetchMoreResult &&
            fetchMoreResult.departments
          ) {
            return Object.assign({}, prev, {
              ...prev,
              departments: {
                ...prev.departments,
                nodes: [
                  ...prev.departments.nodes,
                  ...fetchMoreResult.departments.nodes
                ]
              }
            });
          }
          return prev;
        }
      });
    }
  }

  let count = 0;

  if (data?.departments?.totalCount) {
    count = data.departments.totalCount;
  }

  function renderTableBody() {
    if (data?.departments?.nodes?.length) {
      return data.departments.nodes.map((department: any, index: number) => (
        <TableRow key={department.id} hover id={department.id}>
          <TableCell>{department.id}</TableCell>
          <TableCell>{department.name}</TableCell>
          <TableCell align="center">
            <Tooltip title="Edit">
              <IconButton
                color="inherit"
                component={Button}
                id={`btn-edit_${department.id}`}
                aria-label="Edit"
                onClick={onEditClick.bind(null, department.id)}
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
  );
}

export default DepartmentsTable;
