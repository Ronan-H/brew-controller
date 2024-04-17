import {
    VStack,
    SimpleGrid,
    Heading,
    Divider,
    useToast,
} from "@chakra-ui/react";
import { LabelledBadge } from "./LabelledBadge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from '@chakra-ui/react'
import { SubmitHandler } from "react-hook-form";
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
    const toast = useToast();

    const getStatus = useQuery({
        queryKey: ['tempStatus'],
        queryFn: (): Promise<GetStatusResponseType> =>
            fetch(statusEndpoint).then((res) =>
                res.json(),
            ),
            // refetchInterval: 3000
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

            toast({
                title: 'Target updated successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                colorScheme: 'blue',
                position: 'bottom',
            })
        },
    });

    const onSubmit: SubmitHandler<PutTargetPayloadType> = (data) => putTarget.mutate(data);
    
    if (getStatus.error || putTarget.error) {
        return <p>Error: {String(getStatus.error || putTarget.error)}</p>;
    }

    return (
        <VStack spacing='5' m='5'>
            <Heading>Brew Controller</Heading>
            <Divider />
            
            <Heading as='h3' size='lg'>
                Status
            </Heading>

            {!getStatus.isPending ? <>
                <SimpleGrid spacingY='3' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                    <LabelledBadge
                        label='Vessel temp:'
                        badgeText={`${getStatus.data.vessel_temp.toFixed(2)}°C`}
                        colorScheme={Math.abs(getStatus.data?.vessel_temp - getStatus.data?.target_vessel_temp) < 0.5 ? 'green' : 'red'}
                    />
                    <LabelledBadge
                        label='Room temp:'
                        badgeText={`${getStatus.data.room_temp.toFixed(2)}°C`}
                        colorScheme={getStatus.data?.room_temp < getStatus.data?.target_vessel_temp ? 'green' : 'red'}
                    />
                    <LabelledBadge
                        label='Heater is:'
                        badgeText={getStatus.data.heater_on ? 'ON' : 'OFF'}
                        colorScheme={getStatus.data.heater_on ? 'cyan' : 'gray'}
                    />
                </SimpleGrid>
            </> : <Spinner size='lg' color='blue.500' thickness='4px' />}

            <Divider />

            <Heading as='h3' size='lg'>
                Settings
            </Heading>

            {!(getStatus.isPending || putTarget.isPending) ? <>
                <TempTargetForm
                    key={`temp-target-form-${getStatus.dataUpdatedAt}`}
                    targetData={getStatus.data}
                    onSubmit={onSubmit}
                />
            </> : <Spinner size='lg' color='blue.500' thickness='4px' />}
        </VStack>
    );
}
