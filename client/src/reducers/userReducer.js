const user = {};

const userReducer = (state = user, action) => {
    switch (action.type) {
        case "ADD_CARD":
            state = {
                ...state,
                cards: [...state.userData.cards, action.payload]
            }
            break;
        case "NEW_SESSION":
            state = action.payload
        default:
            break;
    }
    return state;
};
export default userReducer;
