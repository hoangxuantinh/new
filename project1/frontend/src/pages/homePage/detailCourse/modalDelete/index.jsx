/* eslint-disable react/prop-types */
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


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

const ModalConfirmDeleteCourse = ({close,classId,handleCancel}) => {
    return (
        <>
            <BootstrapDialog
                onClose={close}
                aria-labelledby="customized-dialog-title"
                open={open}
                sx={{marginBottom:25}}
            >
                <BootstrapDialogTitle id="customized-dialog-title" >
                    <Typography sx={{color:'red',fontWeight:'bold'}} align="center"  variant="h5">Are you sure want to cancel this course</Typography>

                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box>
                        <Stack spacing={2} sx={{width:'100%',display:'flex',justifyContent:'space-around'}} direction="row">
                            <Button variant="text" sx={{backgroundColor:'blue',color:'white',minWidth:'100px'}}
                                onClick={close}>Cancel</Button>
                            <Button onClick={() => {
                                handleCancel(classId);
                                close();
                            }}
                            variant="contained" sx={{backgroundColor:'red',minWidth:'50px'}}
                            >Confirm</Button>
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </BootstrapDialog>

        </>
    );
};

export default ModalConfirmDeleteCourse;
