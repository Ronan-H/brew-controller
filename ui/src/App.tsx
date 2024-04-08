
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
  ThemeConfig,
} from '@chakra-ui/react'
import TempControls from './components/TempControls'

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
    <ChakraBaseProvider theme={theme}>
      <TempControls />
    </ChakraBaseProvider>
  )
}
