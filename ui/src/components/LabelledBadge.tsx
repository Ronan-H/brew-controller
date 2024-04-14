import { Badge } from "@chakra-ui/react";
import { LabelledField } from "./LabelledField";

type LabelledBadgeProps = {
    label: JSX.Element | string,
    badgeText: string,
    colorScheme?: string,
}

export function LabelledBadge(props: LabelledBadgeProps) {
    const badge = (
        <Badge variant='outline' colorScheme={props.colorScheme ?? 'cyan'} fontSize="xl">
            {props.badgeText}
        </Badge>
    );

    return (
        <LabelledField label={props.label} field={badge} />
    );
}
