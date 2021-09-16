import React from "react";
import {useSelector} from "react-redux";

import 'styled-components'

import './plugins/axios';
import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import './classes'

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {navigate, useRoutes} from "hookrouter";
import routes from "./routes";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Container} from "react-bootstrap";

function App() {
    const routeResult = useRoutes(routes);
    const state = useSelector(state => state.data);


    let open = ['/login', '/register']

    if (!state.user.id && !open.includes(window.location.pathname)) {
        navigate('/login', true)
    }

    //Default url if logged in
    open.push('/')
    if (state.user.id && open.includes(window.location.pathname)) {
        navigate('/dashboard', true)
    }

    return (
        <Container fluid className="h-100 d-flex">
            {/*<div className="d-flex h-100 justify-content-center">*/}
            {/*{routeResult || <NoPageFound />}*/}

            {routeResult}
            <Backdrop open={state.loader.isLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <ToastContainer/>
        </Container>
    );
}

export default App


/*
import {ThemeProvider} from "styled-components";
import {lightTheme, darkTheme} from "./theme";
import GlobalTheme from "./globals";
import styled from "styled-components";
*/

// function App() {
//     //const [theme, setTheme] = useState("dark");
//
//     /*const toggleTheme = () => {
//         if (theme === "light") {
//             window.localStorage.setItem("theme", "dark");
//             setTheme("dark");
//         } else {
//             window.localStorage.setItem("theme", "light");
//             setTheme("light");
//         }
//     };*/
//
//     // useEffect(() => {
//     //     const localTheme = window.localStorage.getItem("theme");
//     //     localTheme && setTheme(localTheme);
//     // }, []);
//
//     return (
//         <div className="container d-flex h-100 justify-content-center">
//             <Provider store={createStore(reducers)}>
//
//                 <LoginForm/>
//             </Provider>
//         </div>
//     );
// }

//
// function mapStateToProps(state) {
//     return {user: state.user.value}
// }
//
// export default connect(mapStateToProps)(App)
