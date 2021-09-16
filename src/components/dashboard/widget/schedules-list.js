import React, {useEffect, useState} from 'react';
import User from '../../../resources/User'
import Schedule from "../../../resources/Schedule"
import Room from "../../../resources/Room"

import {
    Button,
    // Button,
    Card,
    CardContent,
    CardHeader,
} from "@material-ui/core";

import {t} from '../../../plugins/i18nr'

import EnhancedTable from '../../../components/EnhancedTable'
import moment from "moment";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from '@material-ui/core/IconButton';
import {FilterAltIcon} from "@material-ui/data-grid";

export default function ScheduleList() {
    const [schedules, setSchedules] = useState([]);
    const [schedulesFiltered, setSchedulesFiltered] = useState([]);
    const [rooms, setRooms] = useState(null);
    const [loader, setLoader] = useState(false);

    /**
     * Refresh the data
     * @returns void
     */
    function getSchedules() {
        Schedule.get({
            params: {company_id: User.command('get.company').id, range: 'next7days'},
            loader: {data: loader, method: setLoader},
            supply: {data: schedules, method: setSchedules}
        }).then((response) => {
            let items = response.data
            items.sort((a, b) => parseInt(a.day.replaceAll('-', '')) - parseInt(b.day.replaceAll('-', '')))
            items = items.slice(0, 5)
            //use data.itens to apply filter by rooms
            setSchedules(items)
            setSchedulesFiltered(items)
        })
    }

    /**
     * Search the activated rooms
     */
    function getRooms() {
        Room.get({
            params: {company_id: User.command('get.company').id, enable: true},
            loader: {data: loader, method: setLoader},
            supply: {method: setRooms}
        })
    }

    /**
     * filter by room rooms
     */
    function filter(room) {
        let items = schedules;
        items = items.filter((item) => room ? item.timetable.room.id === room.id : true)
        setSchedulesFiltered(items)
    }


    useEffect(() => {
        getSchedules()
        getRooms()
    }, []);


    function formatDate({data, mask}) {
        return moment(data).format(mask)
    }

    const headers = [
        {name: t('room.labels.name'), sortable: false, field: 'name', width: 400, align: 'left'},
        {name: t('room.labels.phone'), sortable: false, field: 'phone', width: 400, align: 'left'},
        {name: t('room.labels.timetable'), sortable: false, field: 'timetable.start', width: 300, align: 'center'},
        {name: t('room.labels.room'), sortable: false, field: 'timetable.room.short_name', width: 300, align: 'left'},
        {
            name: t('room.labels.day'),
            sortable: false,
            field: 'day',
            width: 250,
            align: 'left',
            valueGetter: (item) => formatDate({data: item.day, mask: t('dates.date')})
        },
        {name: t('room.labels.quantity'), sortable: false, field: 'quantity', width: 300, align: 'center'},
    ];

    return (

        <Card>
            {loader && <LinearProgress/>}
            <CardContent className="p-0">
                <CardHeader title={t('widget.timetables-list.title')} titleTypographyProps={{variant: 'subtitle1'}}/>
                <div className="mx-3">
                    <EnhancedTable
                        select={'none'}
                        rows={schedulesFiltered}
                        columns={headers}
                        dense={true}
                        hideHeader={true}
                        hideFooter={true}/>
                </div>
                <div className="mx-3 my-1">
                    {rooms && rooms.map((room) => {
                        return (
                            <Button variant="contained"
                                    color="primary"
                                    size="small"
                                    className="mr-3"
                                    onClick={() => filter(room)}>{room.short_name}</Button>)
                    })}
                    {rooms &&
                    <IconButton variant="contained"
                                color="primary"
                                onClick={() => filter(null)}>
                        <FilterAltIcon/>
                    </IconButton>
                    }
                </div>
            </CardContent>
        </Card>
    );
}
