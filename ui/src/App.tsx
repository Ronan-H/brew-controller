
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
  ThemeConfig,
} from '@chakra-ui/react'
import TempControls from './components/TempControls'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

const { Button, Badge, Heading, Divider, NumberInput, } = chakraTheme.components

const theme: ThemeConfig = extendBaseTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  components: {
    Button, Badge, Heading, Divider, NumberInput,
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraBaseProvider theme={theme}>
        <TempControls />
      </ChakraBaseProvider>
    </QueryClientProvider>
  )
}
