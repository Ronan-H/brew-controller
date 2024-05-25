import { Box, Heading, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";

type SpinnerHeadingProps = {
    children: JSX.Element | string,
    includeSpinner: boolean,
};

export function SpinnerHeading(props: SpinnerHeadingProps) {
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

    // Avoid showing the spinner for a really brief amount of time by adding a delay before showing it
    useEffect(() => {
        if (props.includeSpinner) {
            const timeout = setTimeout(() => {
                setIsSpinnerVisible(true);
            }, 100);
    
            return () => clearTimeout(timeout);
        } else {
            setIsSpinnerVisible(false);
        }
    }, [props.includeSpinner]);

    return (
        <Box
            w='100%'
            display="grid"
            alignItems="center"
            justifyContent="center"
            gridTemplateColumns='1fr auto 1fr'
        >
            &nbsp; {/* empty grid cell for alignment*/}
            <Heading as="h3" size="lg">
                {props.children}
            </Heading>
            {isSpinnerVisible && <Spinner size="md" color="blue.500" thickness="4px" ml='0.5rem' />}
        </Box>
    );
}