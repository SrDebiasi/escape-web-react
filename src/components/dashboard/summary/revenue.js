import React, {useEffect, useState} from 'react';
import User from '../../../resources/User'
import Schedule from "../../../resources/Schedule"
import {t} from '../../../plugins/i18nr'
import CircularProgress from '@material-ui/core/CircularProgress';
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import EventIcon from "@material-ui/icons/Event";
import {makeStyles} from "@material-ui/styles";
import {
    Card,
    CardContent,
    Divider,
    Grid, Typography
} from "@material-ui/core";
import {currency} from '../../../filters/filters'

const useStyles = makeStyles({
    paper: {
        backgroundColor: '#007bff',
    },
});


export default function Revenue() {
    const classes = useStyles();
    const [loader, setLoader] = useState(true);
    const [revenue, setRevenue] = useState('');

    /**
     * Refresh the data
     * @returns void
     */
    function getSchedules() {
        Schedule.get({
            params: {company_id: User.command('get.company').id, range: 'last7days'},
            loader: {method: setLoader}
        }).then((response) => {
            let revenue = parseFloat(response.data.reduce((sum, schedule) => ({
                payment_value: parseFloat(sum.payment_value) + parseFloat(schedule.payment_value)
            })).payment_value).toFixed(2).toString()
            setRevenue(currency(revenue)) // apply mask
        })
    }

    useEffect(() => {
        getSchedules()
    }, []);

    return (
        <Card className="overflow-visible">
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
                            <AttachMoneyIcon style={{fontSize: 40, color: 'white'}}/>
                        </Card>
                    </CardContent>
                </Grid>
                <Grid item xs className="pr-4 text-right">
                    <Grid item>
                        <Typography>{t('summary.revenue.title')}</Typography>
                        {loader && <div><CircularProgress className="mr-3"/></div>}
                        {!loader && <Typography variant="h5">{revenue}</Typography>}
                    </Grid>
                </Grid>
            </Grid>
            <Divider/>
            <div className="p-2">
                <EventIcon style={{fontSize: 20}}/>
                <Typography variant="caption" className="pl-2">{t('summary.revenue.footer')}</Typography>
            </div>
        </Card>
    );
}
