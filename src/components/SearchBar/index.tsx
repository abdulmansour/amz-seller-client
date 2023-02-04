import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { ChangeEvent, useEffect, useState } from 'react';

export interface SearchBarProps {
  handleSearch: (searchTerm: string) => void;
}

export default function SearchBar({ handleSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearchBar = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    handleSearch(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
      elevation={3}
    >
      <InputBase
        value={searchTerm}
        sx={{ ml: 1, flex: 1 }}
        placeholder="🔍 Search"
        onChange={handleOnChange}
      />
      {searchTerm && (
        <IconButton color="info" onClick={clearSearchBar}>
          <CancelIcon />
        </IconButton>
      )}
    </Paper>
  );
}
