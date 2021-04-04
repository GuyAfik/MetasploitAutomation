const axios = require('axios');
const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

export function print(str) {
    console.log(str);
}

export function createUser(newUser) {
    let mockUser = {
        "first_name": "Guy",
        "last_name": "Afik",
        "username": "Great10",
        "password": "12345678",
        "email": "guyafik423468@gmail.com"
    }
    // return axios.post('/Users/Create', {
    //     // name: newUser.name,
    //     // password: newUser.newPass,
    //     // email: newUser.email
    //
    // });
    return axios.post('/Users/Create', mockUser);
}

export async function getUser(email, password) {
    let res = await axios.get(`/Users/Get/${email}/${password}`);
    console.log(`The User is: ${res.data}`);
    return res.data;
}


export function isEmailValid(email) {
    return emailRegex.test(email)

}
