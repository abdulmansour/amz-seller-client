import { ChangeEvent, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";

export interface SearchBarProps {
  handleSearch: (e: any) => void;
}

export default function SearchBar({ handleSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearchBar = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      elevation={6}
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
