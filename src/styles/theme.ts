import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme {
    orderStatus?: {
      shipped?: string;
      pending?: string;
      canceled?: string;
    };
    zIndices?: {
      loadingSpinner?: number;
    };
    customPalette: {
      money: {
        main: string;
      };
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends CustomTheme {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThemeOptions extends CustomTheme {}
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e90ff',
    },
    secondary: {
      main: '#ff9900',
    },
    error: {
      main: red.A400,
    },
  },
  customPalette: {
    money: {
      main: 'green',
    },
  },
  orderStatus: {
    shipped: '#e6ffe6',
    pending: '#ffffe6',
    canceled: '#ffe6e6',
  },
  zIndices: {
    loadingSpinner: 1000,
  },
});

export default theme;
