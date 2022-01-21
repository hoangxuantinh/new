/* eslint-disable react/prop-types */
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import FormAddTime from '../formAdd';
import FormEditTime from '../formEditTime';

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    }
}));

const ModalAddTime = ({open,close,submit,timeCurrent,edit,update,setEdit}) => {
    return (
        <>
            <BootstrapDialog
                onClose={close}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={close} >
                    {edit ? 'Update Time' : 'Create New Times'}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {edit ? <FormEditTime setEdit={setEdit} update={update} timeCurrent={timeCurrent}/> : <FormAddTime submit={submit}  edit={edit}  close={close}/>}
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </BootstrapDialog>

        </>
    );
};

export default ModalAddTime;
