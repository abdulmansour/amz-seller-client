import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from '../src/styles/theme';

export const withMuiTheme = (Story) => (
  <EmotionThemeProvider theme={theme}>
    <CssBaseline />
    <Story />
  </EmotionThemeProvider>
);

export const decorators = [withMuiTheme];
