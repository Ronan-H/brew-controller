import {
    Button,
    VStack,
    SimpleGrid,
    Heading,
    Divider,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
} from "@chakra-ui/react";
import { LabelledBadge } from "./LabelledBadge";
import { LabelledField } from "./LabelledField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from '@chakra-ui/react'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TempTargetForm from "./TempTargetForm";

export type GetStatusResponseType = {
    heater_on: boolean,
    room_temp: number,
    target_vessel_temp: number,
    vessel_temp: number,
    vessel_temp_threshold: number,
};

export type PutTargetPayloadType = {
    target_vessel_temp: number,
    vessel_temp_threshold: number,
}

const host = 'http://localhost:5000';
const statusEndpoint = host + '/status';
const targetEndpoint = host + '/target';

export default function TempControls() {
    const queryClient = useQueryClient();

    const getStatus = useQuery({
        queryKey: ['tempStatus'],
        queryFn: (): Promise<GetStatusResponseType> =>
            fetch(statusEndpoint).then((res) =>
                res.json(),
            ),
    });

    const putTarget = useMutation({
        mutationFn: (targetData: PutTargetPayloadType) => {
            return fetch(targetEndpoint, {
                method: 'PUT',
                body: JSON.stringify(targetData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tempStatus']});
        },
    });

    const onSubmit: SubmitHandler<PutTargetPayloadType> = (data) => putTarget.mutate(data);
    
    if (getStatus.isPending || putTarget.isPending) {
        return <Spinner />;
    }

    if (getStatus.error || putTarget.error) {
        return <p>Error: {String(getStatus.error || putTarget.error)}</p>;
    }

    return (
        <VStack spacing={8} m='8'>
            <Heading>Brew Controller</Heading>
            <Divider />
            
            <Heading as='h3' size='lg'>
                Status
            </Heading>

            <SimpleGrid spacingY='3' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                <LabelledBadge label='Heater is:' badgeText={getStatus.data.heater_on ? 'ON' : 'OFF'} />
                <LabelledBadge label='Current room temp:' badgeText={`${getStatus.data.room_temp.toFixed(1)}°C`} />
            </SimpleGrid>

            <Divider />

            <Heading as='h3' size='lg'>
                Settings
            </Heading>

            <TempTargetForm key={`temp-target-form-${getStatus.dataUpdatedAt}`} targetData={getStatus.data} onSubmit={onSubmit} />
        </VStack>
    );
}
