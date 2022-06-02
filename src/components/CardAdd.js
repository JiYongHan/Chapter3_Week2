/*
  Author   : 한지용
  Date     : 2022-06-02
  File     : CardAdd.js
  Detail   : + 버튼 클릭시, 새로운 Card를 추가하기 위한 컴포넌트
           : useRef를 통해 DOM element에 접근하여 값 가져오기, 배열로 처리하는 부분이 좀 어려웠음
           : 수정시 필요한 데이터들을 정리해주지 않아 오류가 자주 발생했음, 정확하게 어떤 데이터들이 필요한지 분석하고 시작할 것
*/

import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addDictionaryHandler,
} from "../redux/modules/word_module";

const CardAdd = () => {
  const history = useHistory();
  // ref를 배열로 만들어서 한꺼번에 관리한다.
  const textRef = React.useRef([]);
  const dispatch = useDispatch();
  
  const addToDictionary = () => {
    const MakeListItem = {
      // 나중에 정렬할 때, 시간순으로 정리하기 위해서 Date쓰기
      timestamp : new Date().toString(),
      word: String(textRef.current[0].value),
      pronunciation: String(textRef.current[1].value),
      meaning: String(textRef.current[2].value),
      example: String(textRef.current[3].value),
      translation: String(textRef.current[4].value),
      is_Checked: false,
    };
    //console.log( "Card ADD : " + MakeListItem )
    dispatch( addDictionaryHandler( MakeListItem ) )
    // 끝나고 나면 이전 화면으로 돌아가기
    history.goBack();
  };
  return (
    <CardAddWrapper style={{}}>
      <CardAddTitle>단어 추가하기</CardAddTitle>
      <CardAddBody>
        <div>단어</div>
        {/* ref를 배열 형식으로 저장하려고 하니 그냥 current.value로 하지 않고 저렇게 배열로 저장할 수 있었다. */}
        {/* 지금 보니 그냥 ref를 각각 선언하고 해결하는 게 나았을까? */}
        <input type="text" ref={(item) => (textRef.current[0] = item)}/>
        <div>발음</div>
        <input tye="text" ref={(item) => (textRef.current[1] = item)}/>
        <div>의미</div>
        <input type="text" ref={(item) => (textRef.current[2] = item)}/>
        <div>예문</div>
        <input type="text" ref={(item) => (textRef.current[3] = item)}/>
        <div>해석</div>
        <input type="text" ref={(item) => (textRef.current[4] = item)}/>
        <button onClick={addToDictionary}>저장하기</button>
      </CardAddBody>
    </CardAddWrapper>
  );
};
const CardAddWrapper = styled.div`
    width: 20%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    margin: auto;
`;
const CardAddTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const CardAddBody = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    
    justify-content: center;
    & div{
        margin-bottom: 5px;
        font-weight: bold;
    }
    & input{
        margin-bottom: 20px;
        height: 40px;
        border-top-width: 0px;
        border-left-width: 0px;
        border-right-width: 0px;
        border-bottom-width: 1px;
        
        border-bottom: 1px solid green;
        font-size: 25px;
    }
    & input:focus{
        outline: 0;
        transition: border-bottom 500ms;
        border-bottom: 3px solid green;
    }
    & button{
        font-size: 15px;
        padding: 15px;
        width: 200px;
        margin: auto;
        cursor: pointer;
        background-color: green;
        color: white;
        border: none;
    }
`;

export default CardAdd;
