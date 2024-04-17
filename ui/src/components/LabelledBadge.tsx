import { Badge } from "@chakra-ui/react";
import { LabelledField } from "./LabelledField";

type LabelledBadgeProps = {
    label: JSX.Element | string,
    badgeText: string,
    colorScheme?: string,
}

export function LabelledBadge(props: LabelledBadgeProps) {
    const badge = (
        <Badge
            variant='outline'
            colorScheme={props.colorScheme ?? 'cyan'}
            fontSize="2xl"
            pl='6px'
            pr='6px'
            width={'100%'}
            textAlign={'center'}
        >
            {props.badgeText}
        </Badge>
    );

    return (
        <LabelledField label={props.label} field={badge} />
    );
}
