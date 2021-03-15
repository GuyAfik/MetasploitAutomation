import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
import cardsReducer from "./reducers/cardsReducer"
import sideDrawerReducer from "./reducers/sideDrawerReducer";
import newUserModalReducer from "./reducers/newUserModalReducer";


export default createStore(combineReducers({cardsReducer, sideDrawerReducer, newUserModalReducer}),
    {},
    applyMiddleware(logger));
