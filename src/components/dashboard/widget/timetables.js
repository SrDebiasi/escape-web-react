import React, {useEffect, useRef, useState} from 'react';
import User from '../../../resources/User'
import Schedule from "../../../resources/Schedule"
import LinearProgress from '@material-ui/core/LinearProgress';
import {
    Button,
    // Button,
    Card,
    CardContent,
    CardHeader
} from "@material-ui/core";

import {t} from '../../../plugins/i18nr'

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


export default function Timetables() {
    const timetables = useRef({'items': []});
    const schedules = useRef({'items': []});
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
     * Search the activated rooms
     */
    function getRooms() {
        Room.get({
            params: {company_id: User.command('get.company').id, enable: true},
        }).then((response) => {
            setRooms(response.data)
            let times = []
            response.data.forEach((item) => {
                //fill all the times
                item.timetables.forEach((timetable) => {
                    times.push({start: timetable.start, name: timetable.start, value: 0})
                })
                //must not repeat the times
                times = [...new Map(times.map(item => [item['start'], item])).values()];
                //sort times by start time
                times.sort((a, b) => parseInt(a.start.replace(':', '')) - parseInt(b.start.replace(':', '')))
            })
            chart.labels = times.map(timetable => timetable.start)
            timetables.current.items = times
            getSchedules()
            setChart({...chart, chart})
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
            schedules.current.items = response.data
            fillChart()
        })
    }

    /**
     * Fill the Y axis
     * @returns void
     */
    function fillChart(room = null) {
        chart.datasets['0'].label = (room ? room.name : 'All rooms')
        chart.datasets['0'].data = []
        timetables.current.items.forEach((timetable) => {
            chart.datasets['0'].data.push(schedules.current.items.filter(schedule => {
                return (schedule.timetable.start === timetable.start) && (room ? schedule.timetable.room.id === room.id : true)
            }).length)
        })
        setChart({...chart, chart})
        setLoaded(true)
    }

    useEffect(() => {
        getRooms()
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
                <CardHeader title={t('widget.timetables.title')} titleTypographyProps={{variant: 'subtitle1'}}/>
                <CardHeader title={t('widget.timetables.subtitle')} titleTypographyProps={{variant: 'subtitle2'}}/>
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

