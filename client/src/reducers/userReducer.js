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
            break;
        case "SAVE_EMAIL":
            state = {
                ...state,
                email: action.payload
            }
            break;
        case "UPDATE_CARD":
            let newCard = action.payload;
            state = {
                ...state,
                data: {
                    cards: state.data.cards.map((card, i) => card.id === newCard.id ? {...card = newCard} : card)
                }
            }
            break;
        default:
            break;
    }
    return state;
};
export default userReducer;
