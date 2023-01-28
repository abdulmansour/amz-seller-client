import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const VerticalContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const HomePageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const FiltersContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding: 10px;
  gap: 30px;
  max-height: 60vh;
  overflow-y: auto;
`;

export const MainContainer = styled(Box)`
  display: flex;
  flex-direction: row;
`;
