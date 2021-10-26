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

export function saveEmail(email) {
    return {
        type: 'SAVE_EMAIL',
        payload: email
    }
}

export function updateCard(card) {
    return {
        type: 'UPDATE_CARD',
        payload: card
    }
}
