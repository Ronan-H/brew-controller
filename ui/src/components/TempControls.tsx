import { Button, VStack, Text, Badge, SimpleGrid, Flex, Heading, Divider, NumberInput, NumberInputField, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import { LabelledBadge } from "./LabelledBadge";
import { LabelledField } from "./LabelledField";

export default function TempControls() {
    return (
        <VStack spacing={8} m='8'>
            <Heading>Brew Controller</Heading>
            <Divider />
            
            <Heading as='h3' size='lg'>
                Status
            </Heading>

            <SimpleGrid spacingY='3' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                <LabelledBadge label='Heater is:' badgeText='ON' />
                <LabelledBadge label='Current room temp:' badgeText='16°C' />
            </SimpleGrid>

            <Divider />

            <Heading as='h3' size='lg'>
                Settings
            </Heading>

            <SimpleGrid spacingY='2' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                <LabelledField label='Target vessel temp:' field={
                    <NumberInput defaultValue={20} precision={1} step={0.5} min={0} max={30} isRequired>
                    <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                } />
            </SimpleGrid>

            <Button colorScheme='cyan'>Submit</Button>
        </VStack>
    );
}
