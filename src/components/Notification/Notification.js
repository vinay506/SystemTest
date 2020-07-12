import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import messages from '../Service/DailogBoxConstants';
import { ModalService } from '../Service/ModalService';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        position: 'absolute',
        top: 0
    },
}));
export default function Notifications() {
    const defaultState = { open: false, type: '', action: '' };
    const [alertData, setAlertData] = React.useState(defaultState)
    const [message, setMessage] = React.useState('');
    const classes = useStyles();

    const setAlert = (data) => {
        setAlertData(data);
        const message = messages[data.action];
        setMessage(message);
        setTimeout(() => {
            setAlertData(defaultState);
        }, 3000)
    }

 
    useEffect(() => {
        ModalService.getNotificationVisibility().subscribe(data => {
            if (data.type === 'ALERT') {
                setAlert(data);
            } else if (data.type === 'CONFIRMATION') {
                console.log('on confirmation')
            }
        });
    });

    return (
        <div style={{ display: (alertData.open && alertData.type === "ALERT") ? 'block' : 'none' }} className={classes.root} >
            <Alert onClose={() => { setAlertData(defaultState) }}>{message}</Alert>
        </div>

    );
}
