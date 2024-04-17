import {
    Button,
    VStack,
    SimpleGrid,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
} from "@chakra-ui/react";
import { LabelledField } from "./LabelledField";
import { Controller, useForm } from "react-hook-form";
import { PutTargetPayloadType } from "./TempControls";

type TempTargetFormProps = {
    targetData: PutTargetPayloadType,
    onSubmit: (data: PutTargetPayloadType) => void,
};

export default function TempTargetForm(props: TempTargetFormProps) {
    const {
        handleSubmit,
        formState: { isDirty },
        control,
      } = useForm<PutTargetPayloadType>({
        defaultValues: props.targetData,
      });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <VStack spacing={8}>
                <SimpleGrid spacingY='2' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                    <LabelledField label='Target vessel temp:' field={
                        <Controller
                            name={'target_vessel_temp'}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { ref, ...restField } }) => (
                                <NumberInput {...restField} precision={1} step={0.5} min={0} max={30} isRequired>
                                <NumberInputField ref={ref} name={restField.name} />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            )}
                        />
                    } />

                    <LabelledField label='Heater threshold:' field={
                        <Controller
                            name={'vessel_temp_threshold'}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { ref, ...restField } }) => (
                                <NumberInput {...restField} precision={1} step={0.1} min={0} max={3} isRequired>
                                <NumberInputField ref={ref} name={restField.name} />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            )}
                        />
                    } />
                </SimpleGrid>

                <Button colorScheme='cyan' type='submit' isDisabled={!isDirty}>Submit</Button>
            </VStack>
        </form>
    );
}
