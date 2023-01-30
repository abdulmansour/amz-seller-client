import { Box, Paper, styled, Typography } from "@mui/material";

export const FilterGroupContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  padding: "5px",
}));

export const FilterOption = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
}));

export const FilterOptionLabel = styled(Typography)(({ theme }) => ({}));

export const FilterOptionCount = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  display: "inline",
  fontSize: "12px",
}));
