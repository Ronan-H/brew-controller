import { Button, VStack, Text, Badge, SimpleGrid, Flex, Heading, Divider, NumberInput, NumberInputField, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";

export default function TempControls() {
    return (
        <VStack spacing={8} m='8'>
            <Heading>Brew Controller</Heading>
            <Divider />
            
            <Heading as='h3' size='lg'>
                Status
            </Heading>

            <SimpleGrid spacingY='2' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                <Text fontSize="xl" fontWeight='bold' mr='2'>
                    Heater is:
                </Text>
                <Flex alignItems='center' justifyContent='center'>
                    <Badge variant='solid' colorScheme='blue' fontSize="xl">
                        ON
                    </Badge>
                </Flex>

                <Text fontSize="xl" fontWeight='bold' mr='2'>
                    Current room temp:
                </Text>
                <Flex alignItems='center' justifyContent='center'>
                    <Badge variant='solid' colorScheme='green' fontSize="xl">
                        16°C
                    </Badge>
                </Flex>
            </SimpleGrid>

            <Divider />

            <Heading as='h3' size='lg'>
                Settings
            </Heading>

            <SimpleGrid spacingY='2' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                <Flex alignItems='center'>
                    <Text fontSize="xl" fontWeight='bold' mr='2'>
                        Target vessel temp:
                    </Text>
                </Flex>
                <Flex alignItems='center' justifyContent='center' direction='column'>
                <NumberInput defaultValue={20} precision={1} step={0.5} min={0} max={30} isRequired>
                    <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Flex>
            </SimpleGrid>

            <Button colorScheme='blue'>Submit</Button>
        </VStack>
    );
}
