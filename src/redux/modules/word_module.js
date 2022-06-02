/*
  Author   : 한지용
  Date     : 2022-06-02
  File     : word_module.js
  Detail   : Redux module, Firebase와 연동하기 위해 사용
      * Action Creators
          loadModule( word_item )
                       : Load Redux State 
          createModule(word_item)
                      : Create Redux State
          updateModule( word_list_index, word_item )
                      : Update Redux State 
          deleteModule( word_list_index )
                     : Delete Redux State
          doneModule( word_list_index, word_state )
                       : Redux State 내의 is_Check의 Boolean값을 수정
          searchModule( searh_word )
                      : Firebase 내 일치하는 단어를 찾기
      
      * Middlewares
          loadDictionaryHandler()
             : Firebase의 모든 DB 정보를 가져온 후, reducer에 값을 갱신하는 Middleware 함수
               가져온 DB 정보를 내림차순 시간순으로 정렬
          addDictionaryHandler( word_item )
              : 추가되는 데이터를 Firebase에 추가 후, reducer에 값을 갱신하는 Middleware 함수
          modifyDictionaryHander( word_item_id, word_item )
            : 수정될 id를 Firebase에서 조회 후, 데이터를 수정하는 Middleware 함수
          deleteDictionaryHander( word_item_id )
            : 삭제될 id를 Firebase에서 조회 후, 삭제하는 Middleware 함수
          doneDictionaryHandler( word_item_id, word_item_state )
            : 수정할 is_Check에 해당하는 id를 Firebase에 조회 후, boolean을 변경하는 Middleware 함수
          searchDictionaryHandler( word_item )
            : 검색할 단어를 Firebase에 조회 후, reducer를 통해 조회한 내용이 있을 경우 state를 반환하고 그렇지 않으면 alert를 띄움


*/

// word_module.js
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy, query, where } from "firebase/firestore";

// Actions
const LOAD = "wordmodule/LOAD";
const CREATE = "wordmodule/CREATE";
const UPDATE = "wordmodule/UPDATE";
const DELETE = "wordmodule/DELETE";
const DONE = "wordmodule/DONE";
const SEARCH = "wordmodule/SEARCH";

// 잊지 말 것, firebase에 저장되었다고 해서 redux의 state가 변경되는 것은 아니다.
// reducer에서 처리해줄 것
// Action -> Action Creator -> Reducer

const initList = [];

// Action Creators
export function loadModule( word_item ) {
  return { type: LOAD, word_item : word_item };
}
// 추가시 Action creator
export function createModule(word_item) {
  return { type: CREATE, word_item: word_item };
}
// 수정시 Action creator
export function updateModule( word_list_index, word_item ) {
  return { type: UPDATE, word_list_index : word_list_index, word_item: word_item };
}

// 삭제 클릭 시, Action creator
export function deleteModule( word_list_index ){
  return { type : DELETE, word_list_index : word_list_index };
}

// 체크 클릭 시, Action creator
export function doneModule( word_list_index, word_state ){
  return { type : DONE, word_list_index : word_list_index, word_state: word_state };
}

export function searchModule( searh_word ){
  return { type : SEARCH, searh_word : searh_word };
}

// Middeware
export const loadDictionaryHandler = () => {
  return async function ( dispatch ){
    // 시간순으로 정렬해서 가장 최근에 입력된 것이 앞에 나올 수 있도록 하자
    // 정렬할 떄 query를 import하고 query로 묶어줄 것
    // timestamp에 date 을 넣어놨기 떄문에 가능한 것
    // 정렬을 하지 않으면 임의로 생성된 id값으러 정렬되어 넘어온다.
    const items = await getDocs( query( collection( db, "my_dictionary" ), orderBy("timestamp", "desc") ));

    let dictionary_list = [];
    items.forEach( ( doc ) => {
      dictionary_list.push( { id: doc.id, ...doc.data() });
    });

    dispatch( loadModule( dictionary_list ) );
  }
}

export const addDictionaryHandler = ( word_item ) => {
  return async function ( dispatch ){
    const docRef = await addDoc( collection( db, "my_dictionary" ), word_item );
    // spread 연산으로 모든 item을 다 넣어준다.
    //console.log( Array.isArray( word_item ));
    const word_data = { id: docRef.id, ...word_item };

    dispatch( createModule( word_data ) );
  }
}

export const modifyDictionaryHander = ( word_item_id, word_item ) => {
  return async function ( dispatch, getState ){
    const docRef = doc( db, "my_dictionary", word_item_id );
    await updateDoc( docRef, { ...word_item } );
    const word_list = getState().Module;
    const word_index = word_list.findIndex( (item ) => {
      return item.id === word_item_id;
    });
    
    dispatch( updateModule( word_index, word_item ) );
  }
}

export const deleteDictionaryHander = ( word_item_id ) => {
  return async function ( dispatch, getState ){
    const docRef = doc( db, "my_dictionary", word_item_id );
    await deleteDoc( docRef );
    const word_list = getState().Module;
    const word_index = word_list.findIndex( (item ) => {
      // id가 일치하는 것만 반환해서 지운다.
      return item.id === word_item_id;
    });

    dispatch( deleteModule( word_index ) );
  }
}

export const doneDictionaryHandler = ( word_item_id, word_item_state ) => {
  return async function ( dispatch, getState ){
    const docRef = doc( db, "my_dictionary", word_item_id );
    // is_Checked 속성은 계속 바껴야하니까 ! 연산으로 계속 바꿔준다.
    await updateDoc( docRef, { is_Checked: !word_item_state } );
    
    const word_list = getState().Module;
    const word_index = word_list.findIndex( (item ) => {
      return item.id === word_item_id;
    });
    
    dispatch( doneModule( word_index, word_item_state ) );
  }
}

export const searchDictionaryHandler = ( word_item ) => {
  return async function(dispatch){
    const docRef = collection( db, "my_dictionary");
    const list_query = query( docRef, where("word", "==", word_item ));
    const snapshot = await getDocs( list_query );
    let dictionary_list = [];
    console.log( snapshot );
    snapshot.forEach( (doc) => {
      console.log( doc.id, doc.data() );
      dictionary_list.push( { id: doc.id, ...doc.data() });
    });
    
    dispatch( searchModule( dictionary_list ) );
  };
};
// Reducer
export default function reducer(state = initList, action = {}) {
  switch (action.type) {
    // do reducer stuff
    case LOAD: {
      // const return_word_list = [ ...action.word_item ];      
      return action.word_item;
    }

    case CREATE: {
      let new_word_list = [];
      // word_item은 dictionary이지 배열이 아니다.
      new_word_list.push(
        {
          id: action.word_item.id,
          word: action.word_item.word,
          timestamp: action.word_item.timestamp,
          pronunciation : action.word_item.pronunciation,
          example : action.word_item.example,
          translation : action.word_item.translation,
          meaning : action.word_item.meaning,
          is_Checked: action.word_item.is_Checked,
        }
      );
      // 빈 배열에 key, value를 채워넣은 dictionary를 만든 후, spread로 값을 넣자
      // 다른 방법이 없을까..
      const return_new_list = [ ...state, ...new_word_list ];      
      //const new_word_item = state;
      return return_new_list;
    }
    
    case UPDATE: {
      console.log( action.word_list_index, action.word_item );
      const update_content = action.word_item;
      const update_index = Number( action.word_list_index );
      
      const new_word_list = state.map( ( item, index ) => {
        return ( index === update_index ) ? update_content : item;
      });
      
      return new_word_list;
    }

    case DELETE:{
      const delete_index = Number( action.word_list_index );
      const return_word_list = state.filter( ( item, index ) => {
        //필터로 index가 일치하지 않는 것만 return한다.
        return delete_index !== index;
      });
      
      return return_word_list;
    }

    case DONE:{
      const update_index = Number( action.word_list_index );
      const return_word_list = state.map( ( item, index ) => {
        if ( index === update_index ){
          // console.log( item.is_Checked );
          item.is_Checked = !item.is_Checked;
          return item;
        } else{
          return item;
        }
      });
      
      return return_word_list;
    }

    case SEARCH:{
      console.log( action.searh_word.length );
      if( action.searh_word.length === 0 ){
        alert("찾는 단어가 없습니다.");
        return state;
      }
      console.log( action.searh_word );
      return action.searh_word;
    }
    default:
      return state;
  }
}
