import { Flex, Text } from "@chakra-ui/react";

type LabelledFieldProps = {
    label: JSX.Element | string,
    field: JSX.Element | string,
}

export function LabelledField(props: LabelledFieldProps) {
    return (
        <>
            <Flex alignItems='center' alignContent='center'>
                <Text fontSize="xl" mr='4' fontWeight={'bold'}>
                    {props.label}
                </Text>
            </Flex>
            <Flex alignItems='center' justifyContent='center'>
                {props.field}
            </Flex>
        </>
    );
}
