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
  count?: number;
}

export interface FilterGroupProps {
  filterLabel: string;
  filterOptions: Record<string, FilterOption>;
  handleFilterChange: (
    label: FilterLabels,
    options: Record<string, FilterOption>,
    isCheckedAction: boolean
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

    handleFilterChange(
      filterLabel as FilterLabels,
      _options,
      event.target.checked
    );
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
        {options && (
          <FormGroup
            sx={{ maxHeight: "100vh", overflowY: "auto", flexWrap: "nowrap" }}
            onChange={(event) => console.log(event)}
          >
            {Object.values(options).map(({ label, value, selected, count }) => {
              return (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      onChange={handleChange}
                      // checked={selected}
                      name={value}
                    />
                  }
                  label={`${label} ${count ? `(${count})` : ""}`}
                />
              );
            })}
          </FormGroup>
        )}
      </FormControl>
    </Box>
  );
}
