import User from '../resources/User'

const INITIAL_STATE_STORE = {
    user: User.new(),
    token: '',
    loader: {
        isLoading: false,
        loading: 0
    }
}

const stateFunction = function (state = INITIAL_STATE_STORE, action) {
    let actualLoading = 0;
    switch (action.type) {

        /* Change the state key */
        case 'CHANGE_STATE' :
            return {...state, [action.name]: action.payload}

        /* Clear and back to the initial state (call by logout) */
        case 'RESET_STATE' :
            return INITIAL_STATE_STORE

        /* Clear the loader counter */
        case 'CLEAR_LOADER' :
            return {...state, loader: {isLoading: false, loading: 0}}

        /* ADd 1 to loader counter */
        case 'ADD_LOADER' :
            actualLoading = state.loader.loading + 1;
            return {...state, loader: {isLoading: (actualLoading > 0), loading: actualLoading}}

        /* Remove 1 to loader counter */
        case 'REMOVE_LOADER' :
            actualLoading = state.loader.loading - 1;
            return {...state, loader: {isLoading: (actualLoading > 0), loading: actualLoading}}
        default:
            return state
    }
}

export default stateFunction