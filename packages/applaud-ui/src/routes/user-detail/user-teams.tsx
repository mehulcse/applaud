import React, { useState } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import { faCross, faPlus } from "@fortawesome/free-solid-svg-icons";
import AppIcon from "../../components/app-icon";
import TeamSelectorContainer from "../../components/team-selector/team-selector";

interface Props {
  teams: any;
}

export default function UserTeams(props: Props) {
  const { teams } = props;

  const [teamIds, setTeamIds] = useState<number[]>([]);

  function onDelete() {
    console.log("Call mutation for delete");
  }

  function onAdd() {
    console.log("Add Team");
  }

  function onTeamsSelected(teamIds: number[]) {
    setTeamIds(teamIds);
  }

  return (
    <Grid item xs={12} sm container>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          Teams
        </Typography>
      </Grid>
      <List component="ul" id="teams">
        {teams.map((team: any) => (
          <ListItem>
            <ListItemText>{team.name}</ListItemText>
            <ListItemIcon>
              <AppIcon icon={faCross} onClick={onDelete} />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      <Grid>
        <TeamSelectorContainer
          label="Team"
          teamIds={teamIds}
          onTeamsSelected={onTeamsSelected}
          placeholder="Select Team"
        />
        <AppIcon icon={faPlus} onClick={onAdd} />
      </Grid>
    </Grid>
  );
}
