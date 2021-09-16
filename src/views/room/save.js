import React, {useEffect, useState} from 'react';
import Room from "../../resources/Room"

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    FormControlLabel,
    Switch,
    Slider,
    FormHelperText,
    MenuItem
} from "@material-ui/core";
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import {t} from '../../plugins/i18nr'
import {Col, Row} from "react-bootstrap";
import SimpleReactValidator from "simple-react-validator";

import Grid from "@material-ui/core/Grid";
import {toast} from "react-toastify";

export default function RoomSave(props) {
    const modal = props.open;
    const [data, setData] = useState(Room.new())
    const [validator, setValidator] = useState(new SimpleReactValidator())
    // const classes = useStyles();

    const scheduleType = [
        {'value': 1, 'text': t('room.labels.ticket'), 'hint': t('room.labels.ticket_hint')},
        {'value': 2, 'text': t('room.labels.room'), 'hint': t('room.labels.room_hint')},
    ];

    function inputChange(event) {
        setData({...data, [event.target.name]: event.target.value});
    }

    function switchChange(event) {
        setData({...data, [event.target.name]: event.target.checked});
    }

    function slideChange(event, value, name) {
        setData({...data, [name]: value});
    }

    function onValidate(event) {
        if (!validator.fieldValid(event.target.name)) {
            validator.showMessageFor(event.target.name)
        }
        setValidator(validator);
        setData({...data}); //Force to update view
    }


    const closeModal = () => {
        props.closeModal()
    };

    /**
     * Refresh the data
     * @returns void
     */
    function refresh() {
        if (props.id)
            Room.show({
                params: {id: props.id},
                loader: true
            }).then((response) => {
                //After refresh, clean all the selected values
                console.log(response.data)
                setData(response.data)
            })
    }

    /**
     * Refresh the data
     * @returns void
     */
    function save() {
        if (validator.allValid()) {
            Room.save({
                params: data,
            }).then(() => {
                toast.success(t('message.save.success'))
                closeModal()
            });
        } else {
            // turn on validation message and re-render
            validator.showMessages()
            setData({...data}); //Force to update view
            setValidator(validator);
            toast.error(t('form.invalid_fields'))
        }
    }

    useEffect(() => {
        if (modal) {
            //Open modal
            setData(Room.new())
            console.log('modal ' + modal)
            refresh()
        }
    }, [props.id, modal]);

    return (

        <Modal
            open={modal}
            onClose={closeModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Row className="justify-content-center w-100 align-items-center">
                <Col xs="12" sm="12" md="10" lg="8" xl="7">
                    <Card className="mt-3 px-3">
                        <CardContent className="p-0">
                            <Grid container
                                  justify="flex-start"
                                  alignItems="center"
                                  spacing={2}
                                  className={'mt-3'}
                            >
                                <Grid item spacing={2} sm xs>
                                    <CardHeader title={props.id === undefined ? t('room.add') : t('room.edit')}
                                                titleTypographyProps={{variant: 'h5'}}>
                                    </CardHeader>
                                </Grid>
                                <Grid item spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.enable} color="primary"
                                                onChange={switchChange}
                                                value={data.enable}
                                                name="enable"/>
                                        }
                                        label="Enable"
                                    />
                                </Grid>
                            </Grid>
                            <CardContent className="px-3 py-0 pb-3">
                                <form noValidate autoComplete="off">
                                    <Row className="mt-3">
                                        <Col>
                                            <TextField
                                                label={t('room.labels.name')}
                                                name="name"
                                                type="text"
                                                className="w-100"
                                                value={data.name}
                                                onChange={inputChange}
                                                onBlur={onValidate}
                                                InputLabelProps={{shrink: !!data.name}}
                                            />
                                            {validator.message('name', data.name, Room.validations().name)}
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col>
                                            <TextField
                                                label={t('room.labels.short_name')}
                                                name="short_name"
                                                type="text"
                                                className="w-100"
                                                value={data.short_name}
                                                onChange={inputChange}
                                                onBlur={onValidate}
                                                InputLabelProps={{shrink: !!data.short_name}}
                                            />
                                            {validator.message('short_name', data.short_name, Room.validations().short_name)}
                                        </Col>
                                        <Col>
                                            <TextField
                                                label={t('room.labels.schedule_types')}
                                                name="schedule_types"
                                                select
                                                value={data.schedule_type}
                                                onChange={inputChange}
                                                onBlur={onValidate}
                                                helperText={data.schedule_type ? scheduleType.find(option => option.value === data.schedule_type).hint : ''}
                                            >
                                                {scheduleType.map((option) => (
                                                    <MenuItem key={option.value}
                                                              value={option.value}
                                                              selected={data.schedule_type === option.value}>
                                                        {option.text}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Col>
                                    </Row>

                                    <Row className="px-3 py-5">
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <Typography gutterBottom>{t('room.labels.play_time')}</Typography>
                                            </Grid>
                                            <Grid item sm>
                                                <Slider
                                                    defaultValue={1}
                                                    valueLabelDisplay="auto"
                                                    valueLabelDisplay="on"
                                                    name="play_time"
                                                    value={data.play_time}
                                                    step={1}
                                                    min={15}
                                                    max={120}
                                                    marks
                                                    onChange={(event, value) => slideChange(event, value, 'play_time')}
                                                />
                                            </Grid>
                                        </Grid>
                                        <FormHelperText>{t('room.labels.play_time_hint')}</FormHelperText>
                                    </Row>

                                    <Row className="px-3">
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <Typography gutterBottom>{t('room.labels.vacancies')}</Typography>
                                            </Grid>
                                            <Grid item sm>
                                                <Slider
                                                    defaultValue={1}
                                                    valueLabelDisplay="auto"
                                                    valueLabelDisplay="on"
                                                    name="vacancies"
                                                    value={data.vacancies}
                                                    step={1}
                                                    min={1}
                                                    max={20}
                                                    marks
                                                    onChange={(event, value) => slideChange(event, value, 'vacancies')}
                                                />
                                            </Grid>
                                        </Grid>
                                        <FormHelperText>{t('room.labels.vacancies_hint')}</FormHelperText>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <CurrencyTextField
                                                label={t('room.labels.room_price')}
                                                name="room_price"
                                                variant="standard"
                                                value={data.room_price}
                                                currencySymbol={t('currency.prefix')}
                                                minimumValue="0"
                                                outputFormat="string"
                                                decimalCharacter={t('currency.decimal')}
                                                digitGroupSeparator={t('currency.thousands')}
                                                onChange={inputChange}
                                                onBlur={onValidate}
                                            />
                                            <FormHelperText>{t('room.labels.room_price_hint')}</FormHelperText>
                                            {validator.message('room_price', data.room_price, Room.validations().room_price)}
                                        </Col>
                                        <Col>
                                            <CurrencyTextField
                                                label={t('room.labels.ticket_price')}
                                                name="ticket_price"
                                                variant="standard"
                                                value={data.ticket_price}
                                                currencySymbol={t('currency.prefix')}
                                                minimumValue="0"
                                                outputFormat="string"
                                                decimalCharacter={t('currency.decimal')}
                                                digitGroupSeparator={t('currency.thousands')}
                                                onChange={inputChange}
                                                onBlur={onValidate}
                                            />
                                            <FormHelperText>{t('room.labels.ticket_price_hint')}</FormHelperText>
                                            {validator.message('ticket_price', data.ticket_price, Room.validations().ticket_price)}
                                        </Col>
                                    </Row>

                                </form>

                                <Grid container
                                      direction="row"
                                      justify="flex-end"
                                      alignItems="center"
                                      spacing={2}
                                      className={'mt-4'}
                                >
                                    <Grid item spacing={2}>
                                        <Button variant="contained" onClick={closeModal}>
                                            {t('common.close')}
                                        </Button>
                                    </Grid>
                                    <Grid item spacing={2}>
                                        <Button variant="contained" color="primary"
                                            // className={classes.status}
                                                onClick={save}>
                                            {t('common.save')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </CardContent>
                    </Card>
                </Col>
            </Row>
        </Modal>

    );
}