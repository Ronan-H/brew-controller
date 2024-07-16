import { Box, Heading, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";

type SpinnerHeadingProps = {
    children: JSX.Element | string,
    includeSpinner: boolean,
};

export function SpinnerHeading(props: SpinnerHeadingProps) {
    const [timestampSpinnerShown, setTimestampSpinnerShown] = useState(0);
    const isSpinnerVisible = (timestampSpinnerShown > 0);

    // Avoid showing the spinner for a really brief amount of time
    useEffect(() => {
        if (props.includeSpinner) {
            setTimestampSpinnerShown(Date.now());
        } else {
            const timeShown = Date.now() - timestampSpinnerShown;
            const MIN_SHOW_TIME = 500;
            const extraShowTime = MIN_SHOW_TIME - timeShown;

            if (extraShowTime > 0) {
                const timeout = setTimeout(() => {
                    setTimestampSpinnerShown(0);
                }, extraShowTime);
            
                return () => clearTimeout(timeout);
            }
            
            setTimestampSpinnerShown(0);
        }
    }, [props.includeSpinner, timestampSpinnerShown]);

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