import { Alert, AlertIcon, Box, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";

type ErrorAlertProps = {
    children: React.ReactNode;
    onClose: () => void;
};

export function ErrorAlert(props: ErrorAlertProps) {
    const { children, onClose } = props;

    return (
        <Alert status='error' w={''}>
            <AlertIcon />
            <Box>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {children}
                </AlertDescription>
            </Box>
            <CloseButton
                alignSelf='flex-start'
                position='relative'
                right={-1}
                top={-1}
                onClick={onClose}
            />
        </Alert>
    );
}