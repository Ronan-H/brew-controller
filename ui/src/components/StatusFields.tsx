import { SimpleGrid } from "@chakra-ui/react"
import { LabelledBadge } from "./LabelledBadge";
import { StatusType } from "./TempControls";

type StatusFieldsProps = {
    status: StatusType;
    targetTemp: number;
};

const UPDATE_STALE_THRESHOLD_MS = 60000;

export function StatusFields(props: StatusFieldsProps) {
    const { status, targetTemp } = props;
    const { heater_on, vessel_temp, room_temp, last_update_epoch } = status;

    return (
        <SimpleGrid spacingY='4' gridTemplateColumns='repeat(2, minmax(0, auto))'>
            <LabelledBadge
                label='Vessel'
                badgeContent={`${vessel_temp.toFixed(1)}°C`}
                colorScheme={Math.abs(vessel_temp - targetTemp) < 0.5 ? 'green' : 'red'}
            />
            <LabelledBadge
                label='Room'
                badgeContent={`${room_temp.toFixed(1)}°C`}
                colorScheme={room_temp < targetTemp ? 'green' : 'red'}
            />
            <LabelledBadge
                label='Heater'
                badgeContent={heater_on ? 'ON' : 'OFF'}
                colorScheme={heater_on ? 'blue' : 'gray'}
            />
            <LabelledBadge
                label='Updated'
                badgeContent={new Date(
                    last_update_epoch * 1000)
                    .toLocaleTimeString('en-GB', {
                        hourCycle: 'h23',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }
                colorScheme={
                    (Date.now() - last_update_epoch * 1000 < UPDATE_STALE_THRESHOLD_MS) ? 'blue' : 'red'
                }
            />
        </SimpleGrid>
    )
}