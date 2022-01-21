const configScronJob = {
    autoSendMail: {
        frequency: '* * * * *',
        handler: 'handlers/autoSendMail'
    }

};
export default configScronJob;
