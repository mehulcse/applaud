import React, { useState } from "react";
import { useDepartmentsForSelectorQuery } from "../../generated/graphql";
import AutoComplete, { OptionType } from "../../components/autocomplete-input";
import { ValueType } from "react-select/src/types";

interface Props {
  label: string;
  departmentIds: number[];
  onDepartmentsSelected: (departmentIds: number[]) => void;
  placeholder?: string;
  isMulti?: boolean;
}

function DepartmentSelectorContainer({
  departmentIds,
  label,
  onDepartmentsSelected,
  placeholder,
  isMulti = false
}: Props) {
  const [departmentSearch, setDepartmentSearch] = useState("");

  const selectedDepartmentsResult = useDepartmentsForSelectorQuery({
    variables: {
      search: "",
      ids: departmentIds
    },
    skip: !departmentIds.length
  });

  let selectedDepartments: ValueType<OptionType> = [];

  if (selectedDepartmentsResult?.data?.departments?.nodes) {
    selectedDepartments = selectedDepartmentsResult.data.departments.nodes.map(
      (department: any) => ({
        label: department.name,
        value: `${department.id}`
      })
    );
  }

  const departmentsResult = useDepartmentsForSelectorQuery({
    variables: {
      search: departmentSearch
    },
    fetchPolicy: "network-only"
  });

  let departments: OptionType[] = [];

  if (departmentsResult?.data?.departments?.nodes) {
    departments = departmentsResult.data.departments.nodes.map(
      (department: any) => ({
        label: department.name,
        value: `${department.id}`
      })
    );
  }

  const onInputChange = (value: string) => {
    setDepartmentSearch(value);
  };

  const onValueChange = (option: any) => {
    if (option && Array.isArray(option)) {
      const departmentIds = option.map(val => parseInt(val.value, 10));
      onDepartmentsSelected(departmentIds);
    } else if (option && !Array.isArray(option)) {
      onDepartmentsSelected([parseInt(option.value, 10)]);
    } else {
      onDepartmentsSelected([]);
    }
  };

  return (
    <AutoComplete
      suggestions={departments}
      isMulti={isMulti}
      value={selectedDepartments}
      placeholder={placeholder || "Select Department"}
      id="user-select"
      label={label}
      isLoading={selectedDepartmentsResult.loading || departmentsResult.loading}
      onInputChange={onInputChange}
      onValueChange={onValueChange}
    />
  );
}

export default DepartmentSelectorContainer;
