import {updateUser} from "../Utils/Utils";

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
            updateUser(state.email, state).then(res => {
                if (res.ok) {
                    console.log("user updated on server");
                } else {
                    console.log("user didnt update on server");
                }
            })
            break;
        default:
            break;
    }
    return state;
};
export default userReducer;
