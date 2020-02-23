import React, { useEffect, useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  useCreateDepartmentTeamMutation,
  useDeleteDepartmentTeamMutation,
  TeamDetailQueryResult
} from "../../generated/graphql";
import AppIcon from "../../components/app-icon";
import DepartmentSelectorContainer from "../../components/department-selector/department-selector";
import theme from "../../core/mui-theme";
import { openSnackbar } from "../../components/notifier";
import Loader from "../../components/loader";
import { LOADER_TYPE } from "../../constants/constants";

interface Props {
  queryResult: TeamDetailQueryResult;
  teamId: number;
}

export default function TeamDepartment(props: Props) {
  const { queryResult, teamId } = props;
  const departments = queryResult?.data?.team?.departments ?? [];

  const [departmentId, setDepartmentId] = useState<number>(0);

  const [
    deleteDepartmentTeam,
    { loading: deleteLoading }
  ] = useDeleteDepartmentTeamMutation();

  const [
    createDepartmentTeam,
    { loading: createLoading }
  ] = useCreateDepartmentTeamMutation();

  async function onDelete(departmentId: number) {
    if (departmentId && teamId) {
      const response = await deleteDepartmentTeam({
        variables: {
          input: {
            departmentId,
            teamId
          }
        }
      }).catch(error => error);

      if (response?.data?.deleteDepartmentTeam?.isDeleted) {
        openSnackbar(
          {
            message: "Department removed successfully"
          },
          "success"
        );
        queryResult.refetch();
      }
    } else {
      openSnackbar(
        {
          message: "Please provide team"
        },
        "error"
      );
    }
  }

  async function onAdd() {
    if (departmentId && teamId) {
      const response = await createDepartmentTeam({
        variables: {
          input: {
            departmentId,
            teamId
          }
        }
      }).catch(error => {
        if (error?.message) {
          openSnackbar(
            {
              message: error.message
            },
            "error"
          );
        } else {
          openSnackbar(
            {
              message: "Error occurred while adding team to department"
            },
            "error"
          );
        }
        return error;
      });

      if (response?.data?.createDepartmentTeam?.departmentTeam?.id) {
        openSnackbar(
          {
            message: "Team added to department successfully"
          },
          "success"
        );
        setDepartmentId(0);
        queryResult.refetch();
      }
    } else {
      openSnackbar(
        {
          message: "Please provide department"
        },
        "error"
      );
    }
  }

  function onDepartmentsSelected(departmentIds: number[]) {
    if (departmentIds.length) {
      setDepartmentId(departmentIds[0]);
    } else {
      setDepartmentId(0);
    }
  }

  return (
    <Grid container>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          Department
        </Typography>
      </Grid>
      <Grid container>
        <List component="ul" id="teams">
          {departments.map((department: any) => (
            <ListItem>
              <ListItemText style={{ marginRight: theme.spacing(1) }}>
                {department.name}
              </ListItemText>
              <ListItemIcon style={{ cursor: "pointer" }}>
                <AppIcon
                  icon={faTimes}
                  onClick={onDelete.bind(null, department.id)}
                />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <DepartmentSelectorContainer
            label="Department"
            departmentIds={departmentId ? [departmentId] : []}
            onDepartmentsSelected={onDepartmentsSelected}
            placeholder="Select Department"
            isDisabled={!!departments?.length}
          />
        </Grid>
        <Grid item style={{ padding: theme.spacing(4), cursor: "pointer" }}>
          <AppIcon
            icon={faPlus}
            onClick={!departments?.length && !!departmentId ? onAdd : () => {}}
            size="lg"
          />
        </Grid>
      </Grid>
      {(deleteLoading || createLoading) && (
        <Loader type={LOADER_TYPE.fullView} />
      )}
    </Grid>
  );
}
