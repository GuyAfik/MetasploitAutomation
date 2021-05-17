const initialState = {
    isOpen: false
};
/**
 * reducer the handles the state of the side drawer(create new pentest).
 * @param state - opened or closed
 * @param action
 * @returns {{isOpen: boolean}}
 */
const sideDrawerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "OPEN":
            state = {
                ...state,
                isOpen: true
            }
            break;
        case "CLOSE":
            state = {
                ...state,
                isOpen: false
            }
            break;
        default:
            break;
    }
    return state;
};
export default sideDrawerReducer;
