import React, { useState } from "react";
import { useTeamsForSelectorQuery } from "../../generated/graphql";
import AutoComplete, { OptionType } from "../../components/autocomplete-input";
import { ValueType } from "react-select/src/types";

interface Props {
  label: string;
  teamIds: number[];
  onTeamsSelected: (teamIds: number[]) => void;
  placeholder?: string;
  isMulti?: boolean;
}

function TeamSelectorContainer({
  teamIds,
  label,
  onTeamsSelected,
  placeholder,
  isMulti = false
}: Props) {
  const [teamSearch, setTeamSearch] = useState("");

  const selectedTeamsResult = useTeamsForSelectorQuery({
    variables: {
      search: "",
      ids: teamIds
    },
    skip: !teamIds.length
  });

  let selectedTeams: ValueType<OptionType> = [];

  if (selectedTeamsResult?.data?.teams?.nodes) {
    selectedTeams = selectedTeamsResult.data.teams.nodes.map(team => ({
      label: team.name,
      value: `${team.id}`
    }));
  }

  const teamsResult = useTeamsForSelectorQuery({
    variables: {
      search: teamSearch
    },
    fetchPolicy: "network-only"
  });

  let users: OptionType[] = [];

  if (teamsResult?.data?.teams?.nodes) {
    users = teamsResult.data.teams.nodes.map(team => ({
      label: team.name,
      value: `${team.id}`
    }));
  }

  const onInputChange = (value: string) => {
    setTeamSearch(value);
  };

  const onValueChange = (option: any) => {
    if (option && Array.isArray(option)) {
      const teamIds = option.map(val => parseInt(val.value, 10));
      onTeamsSelected(teamIds);
    } else if (option && !Array.isArray(option)) {
      onTeamsSelected([parseInt(option.value, 10)]);
    } else {
      onTeamsSelected([]);
    }
  };

  return (
    <AutoComplete
      suggestions={users}
      isMulti={isMulti}
      value={selectedTeams}
      placeholder={placeholder || "Select Team"}
      id="team-select"
      label={label}
      isLoading={selectedTeamsResult.loading || teamsResult.loading}
      onInputChange={onInputChange}
      onValueChange={onValueChange}
    />
  );
}

export default TeamSelectorContainer;
