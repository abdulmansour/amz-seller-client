import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SalesCardsContainer = styled(Paper)(({}) => ({
  display: 'flex',
}));

export const VerticalContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 10px;
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
  gap: 1vh;
  max-height: 60vh;
  width: 15vw;
  overflow-y: auto;
`;

export const MainContainer = styled(Paper)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding-block: 10px;
`;
