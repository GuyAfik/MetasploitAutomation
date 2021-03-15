const initialState = {
    isOpen: false
};

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
