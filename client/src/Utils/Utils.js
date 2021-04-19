const axios = require('axios');
const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

export function print(str) {
    console.log(str);
}

export function createUser(newUser) {
    return fetch('/Users/Create', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            name: newUser.name,
            password: newUser.newPass,
            email: newUser.email
        })
    })
}

export async function getUser(email, password) {
    let res = await axios.get(`/Users/Get/${email}/${password}`);
    console.log(`The User is: ${JSON.stringify(res.data)}`);
    return res.data;
}


export function isEmailValid(email) {
    return emailRegex.test(email)

}
