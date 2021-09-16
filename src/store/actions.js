const changeState = (name, e) => {
    return {type: 'CHANGE_STATE', payload: e, name: name}
}
const resetState = () => {
    return {type: 'RESET_STATE'}
}
const addLoader = (name, e) => {
    return {type: 'ADD_LOADER', payload: e}
}
const removeLoader = (name, e) => {
    return {type: 'REMOVE_LOADER', payload: e}
}
const clearLoader = (name, e) => {
    return {type: 'CLEAR_LOADER', payload: e}
}

export {changeState, addLoader, resetState, removeLoader, clearLoader}