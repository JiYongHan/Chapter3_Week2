/*
  Author   : 한지용
  Date     : 2022-06-02
  File     : CardEdit.js
  Detail   : 클릭에 해당되는 Card 내용을 수정하기 위한 컴포넌트
           : useSelector를 통해 Redux에 저장된 state 를 다 가져오기  
           : useRef를 통해 DOM element에 접근하여 값 가져오기, 배열로 처리하는 부분이 좀 어려웠음
           : 수정시 필요한 데이터들을 정리해주지 않아 오류가 자주 발생했음, 정확하게 어떤 데이터들이 필요한지 분석하고 시작할 것
*/

import React from "react";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { modifyDictionaryHander } from "../redux/modules/word_module";

const CardEdit = () => {
  const history = useHistory();
  // ref를 배열로 만들어서 한꺼번에 관리한다.
  const textRef = React.useRef([]);
  const list_index = useParams().index_info;
  const dispatch = useDispatch();
  const get_word_list = useSelector((state) => state.Module);
  
  const modifyToDictionary = () => {
    const modifyListItem = {
      id : get_word_list[ list_index ].id,
      timestamp: get_word_list[ list_index ].timestamp,
      word: textRef.current[0].value,
      pronunciation: textRef.current[1].value,
      meaning: textRef.current[2].value,
      example: textRef.current[3].value,
      translation: textRef.current[4].value,
      is_Checked: get_word_list[ list_index ].is_Checked,
    };
    // 선택된 것의 id와 수정된 값을 전달
    dispatch( modifyDictionaryHander( get_word_list[ list_index ].id, modifyListItem ) );
    history.goBack();
  };

  return (
    <CardEditWrapper style={{}}>
      <CardEditTitle>단어 수정하기</CardEditTitle>
      <CardEditBody>
        <div>단어</div>
        {/* input의 value는 변하지 않는 값을 넣을 때 쓰는 것, defaultValue는 값이 변할 때 쓸 수 있는 것 */}
        <input type="text" defaultValue={get_word_list[list_index].word} ref={(item) => (textRef.current[0] = item)} />
        <div>발음</div>
        <input tye="text" defaultValue={get_word_list[list_index].pronunciation} ref={(item) => (textRef.current[1] = item)} />
        <div>의미</div>
        <input type="text" defaultValue={get_word_list[list_index].meaning} ref={(item) => (textRef.current[2] = item)} />
        <div>예문</div>
        <input type="text" defaultValue={get_word_list[list_index].example} ref={(item) => (textRef.current[3] = item)} />
        <div>해석</div>
        <input type="text" defaultValue={get_word_list[list_index].translation} ref={(item) => (textRef.current[4] = item)} />
        <button onClick={ modifyToDictionary }>수정하기</button>
      </CardEditBody>
    </CardEditWrapper>
  );
};
const CardEditWrapper = styled.div`
  width: 20%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: auto;
`;
const CardEditTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const CardEditBody = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  justify-content: center;
  & div {
    margin-bottom: 5px;
    font-weight: bold;
  }
  & input {
    margin-bottom: 20px;
    height: 40px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;

    border-bottom: 1px solid green;
    font-size: 25px;
  }
  & input:focus {
    outline: 0;
    transition: border-bottom 500ms;
    border-bottom: 3px solid green;
  }
  & button {
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

export default CardEdit;
