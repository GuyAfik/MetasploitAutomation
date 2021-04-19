const user = {};

const userReducer = (state = user, action) => {
    switch (action.type) {
        case "ADD_CARD":
            state = {
                ...state,
                data: {cards: [...state.data.cards, action.payload]}
            }
            break;
        case "NEW_SESSION":
            state = action.payload
            if (!state.data.cards) {
                state = {...state, data: {cards: []}}
            }
        default:
            break;
    }
    return state;
};
export default userReducer;
