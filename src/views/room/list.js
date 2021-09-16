import React, {useState, useEffect} from 'react';
import User from '../../resources/User'
import Room from "../../resources/Room"
import {makeStyles} from '@material-ui/core/styles';

import {
    Button,
    Card,
    CardContent,
    CardHeader
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl"
import Modal from '@material-ui/core/Modal';
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import Search from '@material-ui/icons/Search'
import Input from "@material-ui/core/Input"
// Table
// import {DataGrid} from '@material-ui/data-grid';
// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableContainer from '@material-ui/core/TableContainer'
// import TableHead from '@material-ui/core/TableHead'
// import TableRow from '@material-ui/core/TableRow'
// import Paper from '@material-ui/core/Paper'
import {t} from '../../plugins/i18nr'

import EnhancedTable from '../../components/EnhancedTable'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import AddIcon from '@material-ui/icons/Add'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import ImageIcon from '@material-ui/icons/Image'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import {Col, Row} from "react-bootstrap";
import RoomSave from "./save";


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 300,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function RoomView() {
    const classes = useStyles();
    const [rooms, setRooms] = useState([]);
    const [openDial, setOpenDial] = useState(false);
    const [select, setSelect] = useState([]);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalRoom, setModalRoom] = useState(false);
    const [modalStyle] = useState(getModalStyle);

    const handleOpen = () => {
        setOpenDial(true);
    };

    const handleClose = () => {
        setOpenDial(false);
    };

    const addRoom = () => {
        setModalRoom(true)
    };

    const closeModalRoom = () => {
        setModalRoom(false)
    };

    const editRoom = () => {
        setModalRoom(true)
    };

    const showModalDelete = () => {
        setModalDelete(true)
    };

    const closeModalDelete = () => {
        setModalDelete(false)
    };

    const deleteRoom = () => {
        setModalDelete(false)
        destroy()
    };

    const showModalTimetable = (e) => {
        console.log('open timetables')
        e.stopPropagation();
        return
    };

    /**
     * Refresh the data
     * @returns void
     */
    function refresh() {
        Room.get({
            params: {company_id: User.command('get.company').id},
            loader: true,
        }).then((response) => {
            //After refresh, clean all the selected values
            setSelect([])
            setRooms(response.data);
        })
    }

    /**
     * Delete the resource (plus refresh the table)
     * @returns void
     */
    function destroy() {
        Room.delete({
            params: {id: select[0]},
        }).then(() => {
            refresh()
            setSelect([])
        })
    }

    useEffect(() => {
        refresh()
    }, []);

    useEffect(() => {
    }, [select]);

    const headers = [
        {name: t('room.labels.name'), sortable: false, field: 'name', width: 300, align: 'left'},
        {
            name: t('room.labels.active'), field: 'enable', width: 200, align: 'center',
            valueGetter: (row) => t('boolean.' + row.enable)
        },
        {
            name: t('room.labels.timetable'),
            field: 'timetable',
            width: 100,
            align: 'center',
            icon: (<CalendarIcon onClick={showModalTimetable}/>)
        },
        {name: t('room.labels.image'), field: 'image', width: 100, align: 'center', icon: (<ImageIcon/>)}
    ];

    const clickTable = function (event, row, selected) {
        setSelect(selected)
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-stretch'}}>

            <Card className="mx-4 mt-3">
                <CardContent className="p-0">
                    <CardHeader title={t('common.summary')} titleTypographyProps={{variant: 'subtitle1'}}>
                    </CardHeader>
                    <CardContent className="px-3 py-0 pb-3">
                        {t('room.summary', {activeRooms: 1})}
                    </CardContent>
                </CardContent>
            </Card>
            <Card elevation={1} className="mx-4 mt-3 fill-height">
                <CardContent>
                    <FormControl className="w-100">
                        <InputLabel htmlFor="search-field">Search</InputLabel>
                        <Input
                            id="search-field"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton>
                                        <Search/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <div className="mt-3 fill-height">
                        {/*<DataGrid hideFooter={true} rows={rows} columns={headers} pageSize={5} checkboxSelection/>*/}
                        <EnhancedTable select={'single'} rows={rooms} columns={headers} click={clickTable}/>

                    </div>
                </CardContent>
            </Card>
            <SpeedDial
                ariaLabel="openIcon"
                icon={select > 0 ? <EditIcon/> : <AddIcon/>}
                className={'pl-4'}
                onClose={handleClose}
                onOpen={handleOpen}
                open={openDial}
                direction={'right'}
                onClick={select > 0 ? editRoom : addRoom}
                style={{position: 'fixed', bottom: 15}}
            >
                {select > 0 ? (<SpeedDialAction
                    key={t('common.edit')}
                    icon={<DeleteIcon/>}
                    tooltipTitle={t('common.are_you_sure')}
                    onClick={showModalDelete}
                />) : ''}

            </SpeedDial>
            <Modal
                open={modalDelete}
                onClose={closeModalDelete}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                <Card elevation={1} style={modalStyle} className={classes.paper}>
                    <CardContent>
                        <CardHeader
                            title={t('common.are_you_sure')}>
                        </CardHeader>
                    </CardContent>
                    <Row>
                        <Col>
                            <Button variant="contained" color="secondary" onClick={deleteRoom} className={'mr-5'}>
                                {t('common.delete')}
                            </Button>
                            <Button variant="contained" color="primary" onClick={closeModalDelete}>
                                {t('common.cancel')}
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Modal>

                    <RoomSave
                        open={modalRoom}
                        closeModal={closeModalRoom}
                        id={select[0]}
                    />
        </div>


    );
}