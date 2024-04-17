import { Flex, Text } from "@chakra-ui/react";

type LabelledFieldProps = {
    label: JSX.Element | string,
    field: JSX.Element | string,
}

export function LabelledField(props: LabelledFieldProps) {
    return (
        <>
            <Text fontSize="xl" mr='3'>
                {props.label}
            </Text>
            <Flex alignItems='center' justifyContent='center'>
                {props.field}
            </Flex>
        </>
    );
}
