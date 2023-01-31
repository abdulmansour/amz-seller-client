import Checkbox from '@mui/material/Checkbox';
import { FilterLabels } from '@pages/index';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  FilterContainer,
  FilterFormControl,
  FilterFormControlLabel,
  FilterFormGroup,
  FilterFormLabel,
  FilterOption,
  FilterOptionCount,
  FilterOptionLabel,
} from './styled';

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
    <FilterContainer>
      <FilterFormControl>
        <FilterFormLabel>{filterLabel}</FilterFormLabel>
        {options && (
          <FilterFormGroup>
            {Object.values(options)
              .sort((a, b) => {
                return (
                  b.count - a.count ||
                  a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                );
              })
              .map(({ label, value, selected, count }) => {
                return (
                  <FilterFormControlLabel
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
          </FilterFormGroup>
        )}
      </FilterFormControl>
    </FilterContainer>
  );
}
