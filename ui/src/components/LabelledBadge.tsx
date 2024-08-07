import { Badge } from "@chakra-ui/react";
import { LabelledField } from "./LabelledField";

type LabelledBadgeProps = {
    label: JSX.Element | string,
    badgeContent?: JSX.Element | string,
    colorScheme?: string,
}

export function LabelledBadge(props: LabelledBadgeProps) {
    const extraProps = props.badgeContent ? {} : {
        // Expand empty badge to the size of the biggest badge when the status is loaded
        w: '84.02px',
        h: '36px',
    };

    const badge = (
        <Badge
            variant='outline'
            colorScheme={props.colorScheme ?? 'blue'}
            fontSize="2xl"
            pl='6px'
            pr='6px'
            width={'100%'}
            textAlign={'center'}
            {...extraProps}
        >
            {props.badgeContent || ''}
        </Badge>
    );

    return (
        <LabelledField label={props.label} field={badge} />
    );
}
