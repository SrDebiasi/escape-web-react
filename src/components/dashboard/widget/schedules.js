import React, {useEffect, useState} from 'react';
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


export default function Schedules() {
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

    /**
     * Refresh the data
     * @returns void
     */
    function getSchedules() {
        Schedule.get({
            params: {company_id: User.command('get.company').id, range: 'last7days'},
        }).then((response) => {
            let beginDate = moment().subtract(7, 'days');
            let endDate = moment();
            //fill the array 'x'
            while (beginDate.diff(endDate, 'days') < 0) {
                chart.labels.push(beginDate.format(t('dates.day-month')))
                chart.values.push(beginDate.clone())
                beginDate.add(1, 'days')
            }
            fillChart(response.data)
            setSchedules(response.data)
        })
    }


    /**
     * Search the activated rooms
     */
    function getRooms() {
        Room.get({
            params: {company_id: User.command('get.company').id, enable: true},
            supply: {method: setRooms}
        })
    }

    /**
     * Fill the Y axis
     * @returns void
     */
    function fillChart(items, room = null) {
        chart.datasets['0'].label = (room ? room.name : 'All rooms')
        chart.datasets['0'].data = []
        chart.values.forEach((day) => {
            chart.datasets['0'].data.push(items.filter(schedule => {
                return (schedule.day === day.format(t('database.date')))
                    && (room ? schedule.timetable.room.id === room.id : true)
            }).length)
        })
        setChart({...chart, chart})
        setLoaded(true)
    }

    useEffect(() => {
        getSchedules()
        getRooms()
        console.log(1)
    }, []);

    return (
        <Card>
            {!loaded && <LinearProgress/>}
            {loaded && (
                <Card color="primary" className='m-2' style={{padding: 10}}>
                    <Line options={options} data={chart}/>
                </Card>
            )}
            <CardContent className="p-0">
                <CardHeader title={t('widget.schedules.title')} titleTypographyProps={{variant: 'subtitle1'}}/>
                <CardHeader title={t('widget.schedules.subtitle')} titleTypographyProps={{variant: 'subtitle2'}}/>
            </CardContent>
            <div className="mx-3 my-1">
                {loaded && rooms && rooms.map((room) => {
                    return (
                        <Button variant="contained"
                                color="primary"
                                size="small"
                                key={room.id}
                                className="mr-3"
                                onClick={() => fillChart(schedules, room)}>{room.short_name}</Button>)
                })}
                {loaded && rooms &&
                <IconButton variant="contained"
                            color="primary"
                            onClick={() => fillChart(schedules, null)}>
                    <FilterAltIcon/>
                </IconButton>
                }
            </div>
        </Card>
    );
}

