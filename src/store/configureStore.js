import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import timerReducer from "./reducers/timerReducer";
// import otherReducer from './reducers/otherReducer';

const rootReducer = combineReducers({
  timer: timerReducer,
  // otherState: otherReducer
});

const configureStore = createStore(rootReducer, applyMiddleware(thunk));

export default configureStore;
