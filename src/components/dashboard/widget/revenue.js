import React, {useEffect, useRef, useState} from 'react';
import User from '../../../resources/User'
import Schedule from "../../../resources/Schedule"
import LinearProgress from '@material-ui/core/LinearProgress';
import {
    Button,
    Card,
    CardContent,
    CardHeader
} from "@material-ui/core";

import {t} from '../../../plugins/i18nr'

import moment from "moment";
import {Line} from 'react-chartjs-2';
import Room from "../../../resources/Room";
import IconButton from "@material-ui/core/IconButton";
import {FilterAltIcon} from "@material-ui/data-grid";

const options = {
    responsive: true,
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                beginAtZero: true,
                min: 0,
            }
        }]
    },
}


export default function Revenue() {
    const days = useRef({items: []});
    const [schedules, setSchedules] = useState([]);
    const [rooms, setRooms] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const [chart, setChart] = useState({
        labels: [],
        values: [],
        datasets: [
            {
                label: 'All rooms',
                lineTension: 0.2,
                backgroundColor: 'rgb(0,123,255)',
                borderColor: 'rgba(0,123,255,1)',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointHoverRadius: 10,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 3,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],
            },
        ],
    })


    useEffect(() => {
        getRooms()
    }, []);

    useEffect(() => {
        fillChart()
    }, [schedules])

    /**
     * Fill the Y axis
     * @returns void
     */
    function fillChart(room = null) {
        chart.datasets['0'].label = (room ? room.name : 'All rooms')
        chart.datasets['0'].data = []
        days.current.items.forEach((day) => {
            let dailySchedules = schedules.filter(schedule => {
                return (schedule.day === day.date.format(t('database.date')))
                    && (room ? schedule.timetable.room.id === room.id : true)
            })
            day.value = 0
            if (dailySchedules.length > 0)
                chart.datasets['0'].data.push(parseFloat(dailySchedules.reduce(
                    (sum, schedule) => ({
                        payment_value: parseFloat(sum.payment_value) + parseFloat(schedule.payment_value)
                    })
                ).payment_value))
        })
        setChart({...chart, chart})
        setLoaded(true)
    }

    /**
     * Search the activated rooms
     */
    function getRooms() {
        Room.get({
            params: {company_id: User.command('get.company').id, enable: true},
        }).then((response) => {
            setRooms(response.data)
            getSchedules()
        })
    }

    /**
     * Refresh the data
     * @returns void
     */
    function getSchedules() {
        Schedule.get({
            params: {company_id: User.command('get.company').id, range: 'last7days'},
        }).then((response) => {
            let beginDate = moment().startOf('month');
            let endDate = moment().endOf("month");
            //fill the array
            let arDays = []
            arDays.push({date: beginDate.clone(), name: beginDate.format(t('dates.day')), value: []})
            while (beginDate.format('DD-MM-YYYY') !== endDate.format('DD-MM-YYYY')) {
                arDays.push({
                    date: beginDate.add(1, 'days').clone(),
                    name: beginDate.format(t('dates.day')),
                    value: []
                })
            }
            chart.labels = arDays.map(day => day.name)
            setChart({...chart, chart})
            days.current.items = arDays
            setSchedules(response.data)
        })
    }


    return (
        <Card>
            {!loaded && <LinearProgress/>}
            {loaded && (
                <Card color="primary" className='m-2' style={{padding: 10}}>
                    <Line options={options} data={chart}/>
                </Card>
            )}
            <CardContent className="p-0">
                <CardHeader title={t('widget.revenue.title')} titleTypographyProps={{variant: 'subtitle1'}}/>
                <CardHeader title={t('widget.revenue.subtitle')} titleTypographyProps={{variant: 'subtitle2'}}/>
            </CardContent>
            <div className="mx-3 my-1">
                {loaded && rooms && rooms.map((room) => {
                    return (
                        <Button variant="contained"
                                color="primary"
                                size="small"
                                key={room.id}
                                className="mr-3"
                                onClick={() => fillChart(room)}>{room.short_name}</Button>)
                })}
                {loaded && rooms &&
                <IconButton variant="contained"
                            color="primary"
                            onClick={() => fillChart(null)}>
                    <FilterAltIcon/>
                </IconButton>
                }
            </div>
        </Card>
    );
}

