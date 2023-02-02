import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import theme from '../src/styles/theme';

export const withMuiTheme = (Story) => (
  <EmotionThemeProvider theme={theme}>
    <Story />
  </EmotionThemeProvider>
);

export const decorators = [withMuiTheme];
