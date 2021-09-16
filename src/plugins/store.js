import {combineReducers, createStore} from 'redux'
import stateReducers from '../store/stateReducers'

//Clear all storage
//window.localStorage.removeItem('store');

function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem('store', serializedStore);
    } catch (e) {
        console.log(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem('store');
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();
const reducers = combineReducers({data: stateReducers})
const store = createStore(reducers, persistedState);
store.subscribe(() => saveToLocalStorage(store.getState()));
store.dispatch({type: 'CLEAR_LOADER'})

export default store;