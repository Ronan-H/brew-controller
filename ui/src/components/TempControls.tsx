import {
    VStack,
    SimpleGrid,
    Heading,
    Divider,
    useToast,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    CloseButton,
} from "@chakra-ui/react";
import { LabelledBadge } from "./LabelledBadge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from '@chakra-ui/react'
import { SubmitHandler } from "react-hook-form";
import TempTargetForm from "./TempTargetForm";

export type StatusType = {
    heater_on: boolean,
    vessel_temp: number,
    room_temp: number,
};

export type TargetType = {
    target_vessel_temp: number,
    vessel_temp_threshold: number,
    vessel_temp_offset: number,
}

export type ErrorType = {
    message: string | null,
}

const host = `http://${process.env.REACT_APP_API_HOST}:5000`;
const statusEndpoint = host + '/status';
const targetEndpoint = host + '/target';
const errorEndpoint = host + '/error';

export default function TempControls() {
    const queryClient = useQueryClient();
    const toast = useToast();

    const getStatus = useQuery({
        queryKey: ['tempStatus'],
        queryFn: (): Promise<StatusType> =>
            fetch(statusEndpoint).then((res) =>
                res.json(),
            ),
            refetchInterval: 2000
    });

    const getTarget = useQuery({
        queryKey: ['tempTarget'],
        queryFn: (): Promise<TargetType> =>
            fetch(targetEndpoint).then((res) =>
                res.json(),
            ),
    });

    const putTarget = useMutation({
        mutationFn: (targetData: TargetType) => {
            return fetch(targetEndpoint, {
                method: 'PUT',
                body: JSON.stringify(targetData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tempTarget']});

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

    const getError = useQuery({
        queryKey: ['tempError'],
        queryFn: (): Promise<ErrorType> =>
            fetch(errorEndpoint).then((res) =>
                res.json(),
            ),
            refetchInterval: 2000
    });

    const deleteError = useMutation({
        mutationFn: () => {
            return fetch(errorEndpoint, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tempError']});

            toast({
                title: 'Error message cleared.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                colorScheme: 'blue',
                position: 'bottom',
            })
        },
    });

    const onSubmit: SubmitHandler<TargetType> = (data) => putTarget.mutate(data);
    
    if (getStatus.error || getTarget.error || putTarget.error) {
        return <p>Error: {String(getStatus.error || putTarget.error)}</p>;
    }

    return (
        <VStack spacing='5' m='5'>
            <Heading as='h2'>Brew Controller</Heading>
            <Divider />
            
            <Heading as='h3' size='lg'>
                Status
            </Heading>

            <Divider />

            {(!getError.error && !getError.isPending && getError.data?.message) && (
                <Alert status='error' w={''}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {getError.data?.message}
                        </AlertDescription>
                    </Box>
                    <CloseButton
                        alignSelf='flex-start'
                        position='relative'
                        right={-1}
                        top={-1}
                        onClick={() => deleteError.mutate()}
                    />
                </Alert>
            )}

            {!getStatus.isPending && !getTarget.isPending ? <>
                <SimpleGrid spacingY='4' gridTemplateColumns='repeat(2, minmax(0, auto))'>
                    <LabelledBadge
                        label='Vessel'
                        badgeText={`${getStatus.data.vessel_temp.toFixed(2)}°C`}
                        colorScheme={Math.abs(getStatus.data?.vessel_temp - getTarget.data?.target_vessel_temp) < 0.5 ? 'green' : 'red'}
                    />
                    <LabelledBadge
                        label='Room'
                        badgeText={`${getStatus.data.room_temp.toFixed(2)}°C`}
                        colorScheme={getStatus.data?.room_temp < getTarget.data?.target_vessel_temp ? 'green' : 'red'}
                    />
                    <LabelledBadge
                        label='Heater'
                        badgeText={getStatus.data.heater_on ? 'ON' : 'OFF'}
                        colorScheme={getStatus.data.heater_on ? 'cyan' : 'gray'}
                    />
                </SimpleGrid>
            </> : <Spinner size='lg' color='blue.500' thickness='4px' />}

            <Divider />

            <Heading as='h3' size='lg'>
                Settings
            </Heading>

            <Divider />

            {!(getTarget.isPending || putTarget.isPending) ? <>
                <TempTargetForm
                    key={`temp-target-form-${getTarget.dataUpdatedAt}`}
                    targetData={getTarget.data}
                    onSubmit={onSubmit}
                />
            </> : <Spinner size='lg' color='blue.500' thickness='4px' />}
        </VStack>
    );
}
