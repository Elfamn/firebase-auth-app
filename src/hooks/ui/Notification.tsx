import { Alert, AlertColor, Snackbar, Slide, SlideProps } from '@mui/material';
import { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  severity: AlertColor;
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const Notification = ({
  message,
  severity,
  open,
  onClose,
  autoHideDuration = 6000
}: NotificationProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
    onClose();
  };

  if (!message) return null;

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        elevation={6}
        variant="filled"
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            fontSize: '0.95rem'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;