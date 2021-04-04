class Handler {
    constructor() {
        this._age = '';
    }

    setAge(age){
        this._age = age;
    }
    printAge(){
        console.log(`the age is: ${this._age}`)
    }
}

export default Handler;
