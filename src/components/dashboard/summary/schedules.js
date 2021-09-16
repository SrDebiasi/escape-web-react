import React, {useEffect, useState} from 'react';
import User from '../../../resources/User'
import Schedule from "../../../resources/Schedule"
import {t} from '../../../plugins/i18nr'
import CircularProgress from '@material-ui/core/CircularProgress';
import EventIcon from "@material-ui/icons/Event";
import {makeStyles} from "@material-ui/styles";

import {
    Card,
    CardContent,
    Divider,
    Grid, Typography
} from "@material-ui/core";


const useStyles = makeStyles({
    paper: {
        backgroundColor: '#007bff',
    },
});

export default function Schedules() {
    const classes = useStyles();
    const [schedules, setSchedules] = useState([]);
    const [loader, setLoader] = useState(true);

    /**
     * Refresh the data
     * @returns void
     */
    function getSchedules() {
        Schedule.get({
            params: {company_id: User.command('get.company').id, range: 'last7days'},
            loader: {method: setLoader}
        }).then((response) => {
            setSchedules(response.data)
        })
    }


    useEffect(() => {
        getSchedules()
    }, []);

    return (
        <Card className="mx-1 overflow-visible">
            <Grid container
                  spacing={2}
                  alignItems="center"
                  style={{minHeight: '120px'}}>
                <Grid item>
                    <CardContent className="p-0" style={{position: 'absolute', top: '-20px'}}>
                        <Card color="primary" className='m-2' style={{padding: 30}}
                              classes={{
                                  root: classes.paper,
                              }}>
                            <EventIcon style={{fontSize: 40, color: 'white'}}/>
                        </Card>
                    </CardContent>
                </Grid>
                <Grid item xs className="pr-4 text-right">
                    <Grid item>
                        <Typography>{t('summary.schedules.title')}</Typography>
                        {loader && <div><CircularProgress className="mr-3"/></div>}
                        {!loader && <Typography variant="h5">{schedules.length}</Typography>}
                    </Grid>
                </Grid>
            </Grid>
            <Divider/>
            <div className="p-2">
                <EventIcon style={{fontSize: 20}}/>
                <Typography variant="caption" className="pl-2">{t('summary.schedules.footer')}</Typography>
            </div>
        </Card>
    );
}