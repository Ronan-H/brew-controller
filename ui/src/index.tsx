import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
  ThemeConfig,
} from '@chakra-ui/react'
import { QueryClient, QueryClientProvider  } from '@tanstack/react-query';
import TempControls from './components/TempControls';

const queryClient = new QueryClient();

const { Button, Badge, Heading, Divider, NumberInput, Spinner, Alert } = chakraTheme.components;

const theme: ThemeConfig = extendBaseTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  components: {
    Button, Badge, Heading, Divider, NumberInput, Spinner, Alert
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraBaseProvider theme={theme}>
        <TempControls />
      </ChakraBaseProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
