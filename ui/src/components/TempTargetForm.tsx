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
import { TargetType } from "./TempControls";

type TempTargetFormProps = {
    targetData: TargetType,
    onSubmit: (data: TargetType) => void,
};

export default function TempTargetForm(props: TempTargetFormProps) {
    const {
        handleSubmit,
        formState: { isDirty },
        control,
      } = useForm<TargetType>({
        defaultValues: props.targetData,
      });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <VStack spacing={8}>
                <SimpleGrid spacingY='2' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                    <LabelledField label='Vessel Target (°C)' field={
                        <Controller
                            name={'target_vessel_temp'}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { ref, ...restField } }) => (
                                <NumberInput {...restField} size='lg' w={'90px'} precision={1} step={0.5} min={0} max={30} isRequired>
                                    <NumberInputField ref={ref} name={restField.name} />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            )}
                        />
                    } />

                    <LabelledField label='Vessel Offset (°C)' field={
                        <Controller
                            name={'vessel_temp_offset'}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { ref, ...restField } }) => (
                                <NumberInput {...restField} size='lg' w={'90px'} precision={2} step={0.01} min={-10} max={10} isRequired>
                                    <NumberInputField ref={ref} name={restField.name} pattern="(-)?[0-9]*(.[0-9]+)?" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            )}
                        />
                    } />

                    <LabelledField label='Target Threshold (°C)' field={
                        <Controller
                            name={'vessel_temp_threshold'}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { ref, ...restField } }) => (
                                <NumberInput {...restField} size='lg' w={'90px'} precision={2} step={0.1} min={-3} max={+3} isRequired>
                                    <NumberInputField ref={ref} name={restField.name} pattern="(-)?[0-9]*(.[0-9]+)?" />
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
