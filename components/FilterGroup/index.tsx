import { ChangeEvent, useEffect, useState } from "react";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FilterLabels } from "../../pages";
import { Typography } from "@mui/material";
import {
  FilterGroupContainer,
  FilterOption,
  FilterOptionCount,
  FilterOptionLabel,
} from "./styled";

export interface FilterOption {
  label: string;
  value: string;
  selected?: boolean;
  count: number;
}

export interface FilterGroupProps {
  filterLabel: string;
  filterOptions: Record<string, FilterOption>;
  handleFilterChange: (
    label: FilterLabels,
    options: Record<string, FilterOption>
  ) => void;
}

export default function FilterGroup({
  filterLabel,
  filterOptions,
  handleFilterChange,
}: FilterGroupProps) {
  const [options, setOptions] = useState(filterOptions);
  const [label, setLabel] = useState(filterLabel);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const _options = Object.entries(options)?.reduce((a, [key, option]) => {
      if (option.value === event.target.name) {
        option.selected = event.target.checked;
      }
      return { ...a, [key]: option };
    }, {} as Record<string, FilterOption>);

    handleFilterChange(filterLabel as FilterLabels, _options);
  };

  useEffect(() => {
    setOptions(filterOptions);
  }, [filterOptions]);

  return (
    <FilterGroupContainer>
      <FormControl
        sx={{
          m: 3,
          width: "14vw",
          margin: "0px",
        }}
      >
        <FormLabel>{label}</FormLabel>
        {options && (
          <FormGroup
            sx={{ maxHeight: "100vh", overflowY: "auto", flexWrap: "nowrap" }}
            onChange={(event) => console.log(event)}
          >
            {Object.values(options)
              .sort((a, b) => {
                return (
                  b.count - a.count ||
                  a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                );
              })
              .map(({ label, value, selected, count }) => {
                return (
                  <FormControlLabel
                    sx={{ height: "30px", overflow: "hidden" }}
                    key={value}
                    control={
                      <Checkbox
                        onChange={handleChange}
                        checked={selected}
                        name={value}
                      />
                    }
                    label={
                      <FilterOption>
                        <FilterOptionLabel>{`${label}`}</FilterOptionLabel>
                        <FilterOptionCount>{`(${count})`}</FilterOptionCount>
                      </FilterOption>
                    }
                  />
                );
              })}
          </FormGroup>
        )}
      </FormControl>
    </FilterGroupContainer>
  );
}
