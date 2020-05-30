import React, { useState, useContext } from "react";
import { useUsersForSelectorQuery } from "../../generated/graphql";
import AutoComplete, { OptionType } from "../../components/autocomplete-input";
import { AuthContext } from "../../core/auth-manager";
import { ValueType } from "react-select/src/types";

interface Props {
  label: string;
  userIds: number[];
  onUsersSelected: (userIds: number[]) => void;
  placeholder?: string;
  isMulti?: boolean;
}

interface LabelValuePair {
  label: string;
  value: string;
}

function UserSelectorContainer({
  userIds,
  label,
  onUsersSelected,
  placeholder,
  isMulti = false
}: Props) {
  const [userSearch, setUserSearch] = useState("");
  const context = useContext(AuthContext);
  const selectedUsersResult = useUsersForSelectorQuery({
    variables: {
      search: "",
      ids: userIds
    },
    skip: !userIds.length
  });

  let selectedUsers: ValueType<OptionType> = [];

  if (selectedUsersResult?.data?.users?.nodes) {
    selectedUsers = selectedUsersResult.data.users.nodes.map(user => ({
      label: user.fullName,
      value: `${user.id}`
    }));
  }

  const usersResult = useUsersForSelectorQuery({
    variables: {
      search: userSearch
    },
    fetchPolicy: "network-only"
  });

  let users: OptionType[] = [];

  if (usersResult?.data?.users?.nodes) {
    users = usersResult.data.users.nodes.reduce(
      (users: LabelValuePair[], user) => {
        if (context?.user?.id && context.user.id !== user.id)
          users.push({
            label: user.fullName,
            value: `${user.id}`
          });
        return users;
      },
      []
    );
  }

  const onInputChange = (value: string) => {
    setUserSearch(value);
  };

  const onValueChange = (option: any) => {
    if (option && Array.isArray(option)) {
      const userIds = option.map(val => parseInt(val.value, 10));
      onUsersSelected(userIds);
    } else if (option && !Array.isArray(option)) {
      onUsersSelected([parseInt(option.value, 10)]);
    } else {
      onUsersSelected([]);
    }
  };

  return (
    <AutoComplete
      suggestions={users}
      isMulti={isMulti}
      value={selectedUsers}
      placeholder={placeholder || "Select User"}
      id="user-select"
      label={label}
      isLoading={selectedUsersResult.loading || usersResult.loading}
      onInputChange={onInputChange}
      onValueChange={onValueChange}
    />
  );
}

export default UserSelectorContainer;
