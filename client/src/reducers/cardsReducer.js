const initialState = {
    cards: []
};

const cardReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_CARD":
            state = {
                ...state,
                cards: [...state.cards, action.payload]
            }
            break;
        default:
            break;
    }
    return state;
};
export default cardReducer;
