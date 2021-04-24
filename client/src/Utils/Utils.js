const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

export function createUser(newUser) {
    return fetch('/Users/Create', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            name: newUser.name,
            password: newUser.newPass,
            email: newUser.email
        })
    })
}

export function updateUser(email, user) {
    return fetch(`/Users/Update/${email}`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            _id: user._id,
            data: user.data,
            name: user.name,
        })
    })
}

export function getUser(email, password) {
    return fetch(`/Users/Get/${email}/${password}`)
}


export function isEmailValid(email) {
    return emailRegex.test(email)

}
