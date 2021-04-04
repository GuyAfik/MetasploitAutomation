
export function addCard(card) {
    return {
        type: 'ADD_CARD',
        payload: card
    }
}

export function newSession(user) {
    return {
        type: 'NEW_SESSION',
        payload: user
    }
}
