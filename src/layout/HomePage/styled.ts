import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Paper)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding-block: 10px;
  width: 100%;
  height: 800px;
`;

export const FiltersContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 5px;
  overflow-y: auto;
  height: 100%;
`;

export const FiltersRow = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const MapSectionContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 10px;
  width: 100%;
`;

export const HomePageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;
