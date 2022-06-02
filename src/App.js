/*
  Author   : 한지용
  Date     : 2022-06-02
  File     : App.js
  Detail   : 각 컴포넌트들을 가져와서 Router 연결 및 useEffect를 사용한 Firebase DB 읽어오기
        Card componet     ( Card.js )     : Firebase DB에서 가져온 데이터를 출력하기 위한 컴포넌트
        CardEdit componet ( CardEdit.js ) : 클릭에 해당되는 Card 내용을 수정하기 위한 컴포넌트
        CardAdd componet ( CardEdit.js )  : + 버튼 클릭시, 새로운 Card를 추가하기 위한 컴포넌트
        word_module.js                    : Redux module, Firebase와 연동하기 위해 사용

  * 수정이 필요한 부분
  : 개인 프로젝트라도 Git으로 관리하는 습관을 기를 것
  : 컴포넌트를 효율적으로 나누기 구상
  : 아직 CSS 지식이 부족해서 windows size에 따라 반응형으로 동작하지 못하는 부분
  : css style을 한개로 통일할 것, styled-component를 썼다 jsx에서 style을 썼다하니 나중에 수정이 어렵다.
  : styled-components로 작성된 css 요소들을 분리된 파일로 관리할 것
  : App.css에서 Button을 animation을 통해 회전을 했으나, 첫 페이지 로딩시 회전해버린다.
    마우스 hover 상태에서만 되야하는데 수정이 필요함  
*/

import "./App.css";
import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadDictionaryHandler, searchDictionaryHandler } from "./redux/modules/word_module";

import Card from "./components/Card";
import CardAdd from "./components/CardAdd";
import CardEdit from "./components/CardEdit";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const searchRef = React.useRef(null);

  const searchWord = () => {

    console.log(searchRef.current.value);
    /*
    Search의 루틴은
    1. input 값을 전달 받은 후
    2. Firebase에서 query where를 통해 해당 값들을 찾고
    3. Redux state에 값을 반영하고
    4. 검색한 값을 뿌린다.
    5. 특정 버튼을 눌렀을 때 다시 load로 Firebase 에 접근해서 다 읽어오면 된다.
    # 어려워 했던 이유 
    : Firebase에서 Load는 한번만 이루어져야 한다고 생각했다. ( 사실 데이터가 방대하면 자주 부르는 것은 안 좋겠지..)
    : 차라리 Redux store를 두개로 관리해서 하나를 Searh 전용으로 두는 게 나았을까?
  */
    const search_word = searchRef.current.value;
    if( search_word === '' ){
      // 예외처리하기, 단어 검색시 공백이 들어오면 그냥 return으로 종료
      alert("단어를 입력하세요.");
      dispatch( loadDictionaryHandler() );
      return;
    }
    
    dispatch( searchDictionaryHandler( search_word ) );
    // 미들웨어로 보내고 나서는 input text를 다시 공백으로 바꿔줌
    searchRef.current.value = '';
  };

  const reloadDictionary = () => {
    dispatch( loadDictionaryHandler() );
  };

  React.useEffect(() => {
    dispatch(loadDictionaryHandler());
  }, []);

  return (
      <div className="App">
        <h2>영어 단어장</h2>
        <div style={{ 
          display: "flex",
          justifyContent:"center",
          alignItems:"center",
         }}>
          검색 :
          <input style={{ padding:"7px", marginLeft:"6px", marginRight:"6px" }}
            type="text"
            placeholder="단어를 입력하세요"
            ref={searchRef}
          ></input>
          <button style={{ padding:"5px", marginRight:"5px"}} onClick={searchWord}>검색</button>
          <button style={{ padding:"5px"}} onClick={reloadDictionary}>돌아가기</button>
        </div>
        <hr style={{ backgroundColor: "green", marginBottom: "35px" }} />
        <Wrap>
          <Route path="/" exact>
            <Card />
          </Route>
          <Route path="/add_word" exact>
            <CardAdd />
          </Route>
          {/* Parameter로 클릭된 해당 index를 넘겨주기 */}
          <Route path="/edit_word/:index_info" exact>
            <CardEdit />
          </Route>
          {/* <Route path="/search/:word" exact>
            <CardSearch />
          </Route> */}
        </Wrap>
        <AddButton
          className="AddButton"
          onClick={() => {
            // 추가 버튼은 추가 버튼 쪽으로만 이동할 수 있도록
            history.push("/add_word");
          }}
        >
          +
        </AddButton>
      </div>
  );
}

const Wrap = styled.div`
  max-width: 90vw;
  width: 1500px;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
`;

const AddButton = styled.button`
  position: fixed;
  // 위치를 고정으로 둔다.
  // 하지만, window 창이 줄어들었을 경우, 추가하기 버튼이 안 보인다.. 왜냐 위치를 고정했으니까
  // bottom과 right를 vh와 vw 비율로 주어 설정했다.
  bottom: 5vh;
  right: 5vw;

  width: 50px;
  height: 50px;
  border-radius: 25px;

  font-size: 40px;
  background-color: green;
  border: none;
  color: white;
  cursor: pointer;
  text-align: center;
  justify-content: center;

  // 왜 회전을 안할까
  // App.css에서 animation을 통해 회전을 했으나, 첫 페이지 로딩시 회전해버린다.
  // 마우스 hover 상태에서만 되야하는데 수정이 필요함  
`;

export default App;



