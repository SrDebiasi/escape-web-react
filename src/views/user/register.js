import React, {useState} from 'react';

import User from '../../resources/User'
import {t} from '../../plugins/i18nr'

import 'react-toastify/dist/ReactToastify.css';

import {navigate} from 'hookrouter';
import {toast} from 'react-toastify';

import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import CompanyIcon from '@material-ui/icons/Business';
import LockIcon from '@material-ui/icons/Lock';
import {Col, Row} from "react-bootstrap";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField
} from "@material-ui/core";
import SimpleReactValidator from "simple-react-validator";

import {changeState} from '../../store/actions'
import {useDispatch} from "react-redux";

export default function Register() {

    const dispatch = useDispatch();
    const [data, setData] = useState({
            name: '',
            email: '',
            company: '',
            password: '',
            password_confirmation: ''
        }
    );

    const [validator, setValidator] = useState(new SimpleReactValidator({
        validators: {
            equals_password: {
                message: "The passwords doesn't matches",
                rule: (val, params, validator) => {
                    return val.password !== '' && val.password === val.password_confirmation
                },
            }
        }
    }))


    function inputChange(event) {
        setData({...data, [event.target.name]: event.target.value});
    }

    function login() {
        navigate('/login', true)
    }

    function onValidate(event) {
        if (!validator.fieldValid(event.target.name)) {
            validator.showMessageFor(event.target.name)
        }
        setValidator(validator);
        setData({...data}); //Force to update view
    }

    function register() {
        if (validator.allValid()) {
            User.save({
                loader: true,
                params: data
            }).then((response) => {
                if (response.status !== 200) {
                    console.log('opk')
                    toast.error(t('login.error'))
                    return
                }
                //Store the JWT Token
                dispatch(changeState('token', response.data.token))
                // toast.success(t('login.success'))

                //Store the authenticated user
                User.get().then((response) => {
                        dispatch(changeState('user', response.data))
                        //Redirect o to Dashboard
                        navigate("/dashboard", true);
                    }
                )
            }).catch((error) => {
                console.log('Login error ' + error)
                toast.error(t('login.error'))
            });
        } else {
            // turn on validation message and re-render
            validator.showMessages()
            setData({...data}); //Force to update view
            setValidator(validator);
        }

    }


    return (
        <Row className="justify-content-center w-100 align-items-center">
            <Col xs="12" sm="12" md="6" lg="6" xl="4">
                <Card className="text-center">
                    <CardHeader
                        title={t('account.labels.header')}>
                    </CardHeader>
                    <CardContent className="text-left">
                        <form noValidate autoComplete="off">
                            <Row className="mt-3">
                                <Col>
                                    <TextField
                                        label={t('account.labels.name')}
                                        name="name"
                                        type="text"
                                        className="w-100"
                                        value={data.name}
                                        onChange={inputChange}
                                        onBlur={onValidate}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {validator.message('name', data.name, User.validations().name)}
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <TextField
                                        label={t('account.labels.email')}
                                        name="email"
                                        type="text"
                                        className="w-100"
                                        value={data.email}
                                        onChange={inputChange}
                                        onBlur={onValidate}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {validator.message('email', data.email, User.validations().email)}
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <TextField
                                        label={t('account.labels.company')}
                                        name="company"
                                        type="text"
                                        className="w-100"
                                        value={data.company}
                                        onChange={inputChange}
                                        onBlur={onValidate}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CompanyIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {validator.message('company', data.company, User.validations().company)}
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <TextField
                                        label={t('account.labels.password')}
                                        name="password"
                                        type="password"
                                        className="w-100"
                                        value={data.password}
                                        onChange={inputChange}
                                        onBlur={onValidate}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {validator.message('password', data, User.validations().password)}
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <TextField
                                        label={t('account.labels.repeat_password')}
                                        name="password_confirmation"
                                        type="password"
                                        className="w-100"
                                        value={data.password_confirmation}
                                        onChange={inputChange}
                                        onBlur={onValidate}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {validator.message('password_confirmation', data, User.validations().password_confirmation)}
                                </Col>
                            </Row>

                        </form>

                        <Row className="text-center mt-4">
                            <Col>
                                <Button variant="contained" color="primary" size={'large'} onClick={register}>
                                    {t('account.create')}
                                </Button>
                            </Col>
                        </Row>
                        <Row className="text-center mt-3">
                            <Col>
                                <Button color="primary" onClick={login}>
                                    {t('common.login')}
                                </Button>
                            </Col>
                        </Row>
                    </CardContent>
                </Card>
            </Col>
        </Row>
    );
}
