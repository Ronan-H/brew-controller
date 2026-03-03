import {
    VStack,
    SimpleGrid,
    Heading,
    Divider,
    useToast,
} from "@chakra-ui/react";
import { LabelledBadge } from "./LabelledBadge";
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";
import TempTargetForm, { TempTargetFormPlaceholder } from "./TempTargetForm";
import { SpinnerHeading } from "./SpinnerHeading";
import { StatusFields } from "./StatusFields";
import { ErrorAlert } from "./ErrorAlert";

export type StatusType = {
    heater_on: boolean,
    vessel_temp: number,
    room_temp: number,
    last_update_epoch: number,
};

export type TargetType = {
    target_vessel_temp: number,
}

export type ErrorType = {
    message: string | null,
}

const HOST = `http://${process.env.REACT_APP_API_HOST}:5000`;
const STATUS_ENDPOINT = HOST + '/status';
const TARGET_ENDPOINT = HOST + '/target';
const ERROR_ENDPOINT = HOST + '/error';

export default function TempControls() {
    const queryClient = useQueryClient();
    const toast = useToast();

    const getStatus = useQuery({
        queryKey: ['tempStatus'],
        queryFn: (): Promise<StatusType> =>
            fetch(STATUS_ENDPOINT).then((res) =>
                res.json(),
            ),
        refetchInterval: 10000,
    });

    const getTarget = useQuery({
        queryKey: ['tempTarget'],
        queryFn: (): Promise<TargetType> =>
            fetch(TARGET_ENDPOINT).then((res) =>
                res.json(),
            ),
    });

    const putTarget = useMutation({
        mutationFn: (targetData: TargetType) => {
            return fetch(TARGET_ENDPOINT, {
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
            fetch(ERROR_ENDPOINT).then((res) =>
                res.json(),
            ),
            refetchInterval: 10000,
    });

    const deleteError = useMutation({
        mutationFn: () => {
            return fetch(ERROR_ENDPOINT, { method: 'DELETE' });
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

    const isQueryLoading = (query: UseQueryResult) => {
        return query.isLoading || query.isPending || query.isRefetching;
    }

    const isStatusLoading = isQueryLoading(getStatus);
    const isSettingsLoading = isQueryLoading(getTarget) || putTarget.isPending;

    return (
        <VStack spacing='5' m='5'>
            <Heading as='h2'>Brew Controller</Heading>
            <Divider />
            
            <SpinnerHeading includeSpinner={isStatusLoading}>
                Status
            </SpinnerHeading>

            <Divider />

            {(!getError.error && !getError.isPending && getError.data?.message) && (
                <ErrorAlert onClose={() => deleteError.mutate()}>
                    {getError.data.message}
                </ErrorAlert>
            )}

            {!getStatus.isPending && !getTarget.isPending ? <>
                <StatusFields status={getStatus.data} targetTemp={getTarget.data.target_vessel_temp} />
            </> : <StatusContentPlaceholder />}

            <Divider />

            <SpinnerHeading includeSpinner={isSettingsLoading}>
                Settings
            </SpinnerHeading>

            <Divider />

            {!getTarget.isPending ? <>
                <TempTargetForm
                    key={`temp-target-form-${getTarget.dataUpdatedAt}`}
                    targetData={getTarget.data}
                    isSubmissionPending={putTarget.isPending}
                    onSubmit={onSubmit}
                />
            </> : <TempTargetFormPlaceholder />}
        </VStack>
    );
}

function StatusContentPlaceholder() {
    return (
        <SimpleGrid spacingY='4' gridTemplateColumns='repeat(2, minmax(0, auto))'>
            <LabelledBadge label='Vessel' />
            <LabelledBadge label='Room' />
            <LabelledBadge label='Heater' />
            <LabelledBadge label='Updated' />
        </SimpleGrid>
    );
}