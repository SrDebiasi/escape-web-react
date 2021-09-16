import React, {useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Typography} from "@material-ui/core";
import Icon from '@material-ui/core/Icon';

import {useDispatch} from 'react-redux'

import {A, navigate} from "hookrouter";
import {resetState} from "../../store/actions";

export default function Dashboard(props) {
    const [drawer, setDrawer] = useState(false);

    const dispatch = useDispatch();

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawer(open);
    };

    function logout() {
        //Clear user
        dispatch(resetState())
        navigate("/login", true);
    }

    const list = () => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {[
                    {name: 'Dashboard', icon: 'home', to: '/dashboard'},
                    {name: 'Schedule', icon: 'calendar_today', to: '/schedule'},
                    {name: 'Room', icon: 'meeting_room', to: '/room'},
                ].map((route, index) => (
                    <ListItem button key={route.name} component={A} href={route.to}>
                        <ListItemIcon><Icon>{route.icon}</Icon></ListItemIcon>
                        <ListItemText primary={route.name}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <List>
                {[
                    {name: 'Profile', icon: 'person', to: '/profile'},
                    {name: 'Logout', icon: 'logout', to: '/logout', onclick: () => logout()},
                ].map((route, index) => (
                    <ListItem button key={route.name} onClick={route.onclick}>
                        <ListItemIcon><Icon>{route.icon}</Icon></ListItemIcon>
                        <ListItemText primary={route.name} style={{textDecoration: 'none'}}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    let title
    switch (window.location.pathname) {
        case '/room' :
            title = 'Room'
            break
        case '/schedule' :
            title = 'Schedules'
            break
        default :
            title = 'Dashboard'
            break
    }

    return (
        <div className="flexGrow: 1; w-100">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="flexGrow: 1; w-100"> {title} </Typography>
                    <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
                <Drawer anchor={"right"} open={drawer} onClose={toggleDrawer(false)}>
                    {list("right")}
                </Drawer>
            </AppBar>
            {props.children}
        </div>

    );
}

