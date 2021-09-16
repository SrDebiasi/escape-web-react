import React, {useState} from 'react';

import User from '../../resources/User'
import {t} from '../../plugins/i18nr'

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {navigate} from 'hookrouter';

import {changeState} from '../../store/actions'
import {useDispatch} from "react-redux";

import PersonIcon from '@material-ui/icons/Person';
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
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";

function Login() {


    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const [loader, setLoader] = useState(false);

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

    const dispatch = useDispatch();

    function inputChange(event) {
        setData({...data, [event.target.name]: event.target.value});
    }

    function keyDown(event) {
        if (event.key === 'Enter') login()
    }

    function login(event) {
        if (validator.allValid()) {
            User.save({
                append: '/login',
                loader: {data: loader, method: setLoader},
                params: {email: data.email, password: data.password}
            }).then((response) => {
                if (response.status !== 200) {
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
            validator.showMessages()
            setData({...data}); //Force to update view
            setValidator(validator);
        }
    }

    function register() {
        navigate('/register', true)
    }

    return (
        <Row className="justify-content-center w-100 align-items-center">
            <Col xs="12" sm="12" md="6" lg="5" xl="4">
                <Card className="text-left">
                    {loader && <LinearProgress/>}
                    <CardHeader className="text-center" title={t('login.welcome')}/>
                    <CardContent>
                        <form noValidate autoComplete="off">
                            <Row>
                                <Col>
                                    <Grid container spacing={1} alignItems="flex-end">
                                        <Grid item>
                                            <PersonIcon/>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                label={t('common.email')}
                                                name="email"
                                                type="text"
                                                className="w-100"
                                                value={data.email}
                                                onChange={inputChange}
                                                onKeyDown={keyDown}
                                            />

                                        </Grid>
                                    </Grid>
                                    <div className="login-error-message">
                                        {validator.message('email', data.email, 'required')}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Grid container spacing={1} alignItems="flex-end">
                                        <Grid item>
                                            <LockIcon/>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                label={t('common.password')}
                                                name="password"
                                                type="password"
                                                className="w-100"
                                                value={data.password}
                                                onChange={inputChange}
                                                onKeyDown={keyDown}
                                            />
                                        </Grid>
                                    </Grid>
                                    <div className="login-error-message">
                                        {validator.message('password', data.password, 'required')}
                                    </div>
                                </Col>
                            </Row>
                        </form>

                        <Row className="mt-4 text-center">
                            <Col>
                                <Button variant="contained" color="primary" size={'large'} onClick={login}>
                                    {t('common.login')}
                                </Button>
                            </Col>
                        </Row>
                        <Row className="mt-3 text-center">
                            <Col>
                                <Button color="primary" onClick={register}>
                                    {t('account.create')}
                                </Button>
                            </Col>
                        </Row>
                    </CardContent>
                </Card>
            </Col>
        </Row>
    );
}

export default Login
