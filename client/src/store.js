import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
import userReducer from "./reducers/userReducer"
import sideDrawerReducer from "./reducers/sideDrawerReducer";
import modalsReducer from "./reducers/modalsReducer";
import thunk from "redux-thunk";
import awsReducer from "./reducers/awsReducer";


export default createStore(combineReducers({userReducer, sideDrawerReducer, modalsReducer, awsReducer}),
    {},
    applyMiddleware(logger, thunk));
