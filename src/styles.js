import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {green} from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
        success: {
            light: '#335610',
            main: '#335610',
            dark: '#335610',
        },
    },
    status: {
        backgroundColor: green[500],
        alignSelf: 'stretch',
    },
});


const useStyles = makeStyles((theme) => ({
    status: {
        backgroundColor: green[500],
        color: 'white'
    },
}));

export {theme, useStyles};