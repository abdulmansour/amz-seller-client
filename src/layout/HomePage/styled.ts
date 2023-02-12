import { Backdrop, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Paper)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px;
  width: 100%;
  height: 600px;
`;

export const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  overflowY: 'auto',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    height: 'fit-content',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '10px',
  },
  width: '300px',

  fontWeight: 500,
}));

export const FiltersRow = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const MapSectionContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 10px;
  width: 100%;
`;

export const MobileFiltersContainer = styled(Backdrop)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: theme.zIndices?.loadingSpinner,
}));

export const MobileFiltersXContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: theme.zIndices?.loadingSpinner,
  paddingInline: '5px',
}));
