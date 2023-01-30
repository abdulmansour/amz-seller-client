import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

export const VerticalContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const HomePageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const FiltersContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding: 10px;
  gap: 30px;
  min-height: 60vh;
  width: 15vh;
  width: 20vw;
  overflow-y: auto;
`;

export const MainContainer = styled(Paper)`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
