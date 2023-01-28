import { ChangeEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { FilterLabels } from "../../pages";

export interface FilterOption {
  label: string;
  value: string;
  selected?: boolean;
}

export interface FilterGroupProps {
  filterLabel: string;
  filterOptions: FilterOption[] | undefined;
  handleFilterChange: (
    label: FilterLabels,
    options: FilterOption[] | undefined
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
    const _options = options?.map((option) => {
      if (option.value === event.target.name) {
        option.selected = event.target.checked;
      }
      return option;
    });

    handleFilterChange(filterLabel as FilterLabels, _options);
  };

  useEffect(() => {
    setOptions(filterOptions);
  }, [filterOptions]);

  return (
    <Box sx={{ display: "flex" }}>
      <FormControl
        sx={{
          m: 3,

          width: "15vw",
          margin: "0px",
        }}
      >
        <FormLabel>{label}</FormLabel>
        <FormGroup
          sx={{ maxHeight: "100vh", overflowY: "auto", flexWrap: "nowrap" }}
          onChange={(event) => console.log(event)}
        >
          {options?.map(({ label, value, selected }) => {
            return (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={selected}
                    onChange={handleChange}
                    name={value}
                  />
                }
                label={label}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </Box>
  );
}
