/* eslint-disable react/jsx-key */
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import classApi from '../../../api/classApi';
import { useHistory } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
}));
const useStyles = makeStyles({
    container: {
        '&:hover': {
            cursor: 'pointer',
            zoom: '1.1',
            transition: 'background 1s, color 1s',
            backgroundColor: 'greenYellow'
        },
        overflow: 'hidden'

    },
    left: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        height: '168px'
    }
});

const ContentHomePage = () => {
    const classes = useStyles();
    const history = useHistory();
    const [ loading,setLoading ] = useState(true);
    const [ maxSize,setMaxSize ] = useState(true);
    const [ total,setTotal ] = useState(null);

    const [filter,setFilter] = useState({
        offset: 0,
        limit: 9,
        total: 28
    });
    const [ classList,setclassList ] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const params = queryString.stringify(filter);
            const data = await classApi.loadMore(params);
            const { records,pagination } = data;
            setTotal(pagination.total);
            setTimeout(() => {
                setLoading(false);
            },500);
            setclassList([...classList].concat(records));
        };
        fetchUser();
    }, [filter]);


    const handleShowMore = async () => {
        if(classList.length === total) {
            setMaxSize(false);
        }
        setFilter({...filter,
            offset: classList.length,
            limit: 3
        });

    };
    const courseDetail = (id) => {
        history.push(`/course/${id}`);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ flexGrow: 1,marginTop: '32px' }}>
                <Grid container spacing={4}>
                    {!loading && classList.map((element) => (
                        <Grid item={true} xs={4} key={element.id} onClick={() => courseDetail(element.id)}  >
                            <Item className={classes.container}>
                                <img src={`http://localhost:8000/images/${element.avatar}`} className={classes.left}></img>
                                <Typography>{element.name}</Typography>
                                {element.days.map((day) => (
                                    <Box key={Math.random() * 100} sx={{ display:'block',textAlign:'center' }} >{day.dayName} {day.times.map((time) => (
                                        <Typography key={time.timeStart}>{`${time.timeStart}-${time.timeEnd}`}</Typography>
                                    ))}</Box>
                                ))}
                            </Item>
                        </Grid>
                    ))}
                    { loading && Array.from('123456').map((item,index)=> (
                        <Grid  item={true} xs={4} key={index}  >
                            <Item className={classes.container}>
                                <Skeleton variant="rectangular" key={item} width={346} height={180} />
                                <Skeleton width="100%" />
                                <Skeleton width="60%" />
                            </Item>
                        </Grid>
                    ))}
                </Grid>
                {maxSize && (
                    <Box sx={{ margin:'16px auto  0 auto ', width: '200px' }}>
                        <Button
                            onClick={handleShowMore}
                            variant="outlined" color="success">Các Khóa Học Khác...
                        </Button>
                    </Box>
                )}

            </Box>

        </Container>
    );
};

export default ContentHomePage;
