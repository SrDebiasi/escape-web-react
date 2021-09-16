import React, {useEffect, useState} from 'react';
import User from '../../../resources/User'
import Schedule from "../../../resources/Schedule"
import {t} from '../../../plugins/i18nr'
import CircularProgress from '@material-ui/core/CircularProgress';
import AvTimerIcon from "@material-ui/icons/AvTimer";
import EventIcon from "@material-ui/icons/Event";
import {makeStyles} from "@material-ui/styles";
import moment from 'moment'
import {
    Card,
    CardContent,
    Divider,
    Grid, Typography
} from "@material-ui/core";
import Room from "../../../resources/Room";


const useStyles = makeStyles({
    paper: {
        backgroundColor: '#007bff',
    },
});


export default function Occupancy() {
    const classes = useStyles();
    const [schedules, setSchedules] = useState([]);
    const [loader, setLoader] = useState(true);
    const [availableTimetable, setAvailableTimetable] = useState(0);
    const [occupancy, setOccupancy] = useState('');

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

    /**
     * Search the activated rooms
     */
    function getRooms() {
        Room.get({
            params: {company_id: User.command('get.company').id, enable: true},
        }).then((response) => {
            let availableTimetable = 0
            response.data.forEach(room => {
                availableTimetable += room.timetables.length
            })
            setAvailableTimetable(availableTimetable)
            getSchedules()
        })
    }

    /**
     * Search the activated rooms
     */
    function calculate() {
        // Use the rule of three to calculate the occupancy rate
        let daysInMonth = moment().daysInMonth();
        //TODO calculate quantity by days*available hours, because some days are not working days
        let occupancy = ((schedules.length * 100) / (availableTimetable * daysInMonth)).toFixed(2).toString()
        setOccupancy(occupancy)
    }


    useEffect(() => {
        getRooms()
    }, []);

    useEffect(() => {
        calculate()
    }, [availableTimetable]);

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
                            <AvTimerIcon style={{fontSize: 40, color: 'white'}}/>
                        </Card>
                    </CardContent>
                </Grid>
                <Grid item xs className="pr-4 text-right">
                    <Grid item>
                        <Typography>{t('summary.occupancy.title')}</Typography>
                        {loader && <div><CircularProgress className="mr-3"/></div>}
                        {!loader && <Typography variant="h5">{occupancy}%</Typography>}
                    </Grid>
                </Grid>
            </Grid>
            <Divider/>
            <div className="p-2">
                <EventIcon style={{fontSize: 20}}/>
                <Typography variant="caption" className="pl-2">{t('summary.occupancy.footer')}</Typography>
            </div>
        </Card>
    );
}
