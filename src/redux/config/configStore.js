import { createStore, combineReducers, applyMiddleware } from "redux";
// 밑줄이 쳐져 있다고 해서 못 쓰는 거 아니다.
import thunk from "redux-thunk";
import Module from "../modules/word_module";

// Reducer을 다 묶어둔 것을 root reducer라 한다.
// reducer를 다 묶기 위해서는 combineReducers를 사용
// 여기에는 key : value가 들어가야한다.
// 여기서 bucket은 module 명이다.
const rootReducer = combineReducers( { Module : Module } );

const middlewares = [ thunk ];
const enhancer = applyMiddleware( ...middlewares );

// store를 만들 때, enhancer도 같이 넣는다.
const configStore = createStore( rootReducer, enhancer );

export default configStore;