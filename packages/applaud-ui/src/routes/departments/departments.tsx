import React, { useState } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDepartmentsQuery } from "../../generated/graphql";
import DepartmentsTable from "./departments-table";
import { SearchInput } from "../../components/search-input";
import AppIcon from "../../components/app-icon";
import PaperBox from "../../components/paper-box";
import PageLayout from "../../components/page-layout";
import AddDepartmentDialog from "./add-department-dialog";
import UpdateDepartmentDialog from "./update-department-dialog";
import { PAGE_LIMIT } from "../../constants/constants";

export default function Departments() {
  const [search, setSearch] = useState("");
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState(0);

  const queryResult = useDepartmentsQuery({
    variables: {
      search,
      limit: PAGE_LIMIT,
      offset: 0
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  function onChange(value: string) {
    setSearch(value);
  }

  function handleAddDepartment() {
    setShowAddDepartment(true);
  }

  function closeDialog(id?: number) {
    setShowAddDepartment(false);
    if (id) {
      queryResult.refetch();
    }
  }

  function onEdit(departmentId: number) {
    setEditDepartmentId(departmentId);
  }

  function updateCloseDialog(id?: number) {
    setEditDepartmentId(0);
    if (id) {
      queryResult.refetch();
    }
  }

  return (
    <PageLayout pageTitle="Departments">
      <PaperBox>
        <Grid justify="space-between" container>
          <Grid item xs={6}>
            <Box marginY={2} display="flex">
              <SearchInput
                inputValue={search}
                placeholder="Search Department"
                onChange={onChange}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box marginY={2} display="flex">
              <Button
                color="primary"
                onClick={handleAddDepartment}
                variant="outlined"
              >
                <AppIcon icon={faPlus} standardRightMargin />
                Add Department
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box marginY={2}>
          <DepartmentsTable queryResult={queryResult} onEditClick={onEdit} />
        </Box>
        <AddDepartmentDialog open={showAddDepartment} onClose={closeDialog} />
        <UpdateDepartmentDialog
          departmentId={editDepartmentId}
          open={Boolean(editDepartmentId)}
          onClose={updateCloseDialog}
        />
      </PaperBox>
    </PageLayout>
  );
}
