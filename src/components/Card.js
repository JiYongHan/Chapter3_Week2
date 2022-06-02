/*
  Author   : 한지용
  Date     : 2022-06-02
  File     : Card.js
  Detail   : Firebase DB에서 가져온 데이터를 출력하기 위한 컴포넌트
           : useSelector를 통해 Redux에 저장된 state 를 다 가져오기  
*/

import React from "react";
import { DoneOutline, PostAddOutlined, Close } from "@material-ui/icons";
import { Done } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  deleteDictionaryHander,
  doneDictionaryHandler,
} from "../redux/modules/word_module";
import styled from "styled-components";

const Card = (props) => {
  // Redux의 state값 전부 가져오기
  const word_list = useSelector((state) => state.Module);
  const dispatch = useDispatch();
  const history = useHistory();
  
  // load할 때는 정렬된 걸 가지고 오지만 create 후에는 정렬된 것을 가지고 오지 않기 때문에 sort를 추가해주었다.
  const ordered_List = word_list.sort( ( a, b ) => new Date( b.timestamp ) - new Date( a.timestamp ) );
  // 컴포넌트가 렌더링 될 때마다 로드를 해주니 기존 아이템의 개수와 맞지 않게 되었다.
  // 로드는 최상위 컴포넌트에서 불러주자
  // React.useEffect(() => {
  //   dispatch(loadDictionaryHandler());
  // }, []);
  
  return (
    <>
      {ordered_List.map((item, index) => {
          return (
          // 일부러 그냥 key는 고유 ID를 주었다. 
          // key가 동일할 경우, 동일한 DOM element를 보여주기 때문에
          // 유일 키인 id를 넣어주기
          // https://velog.io/@jigom/TIL-c8f8kz43
          <CardWrapper isChecked={ item.is_Checked } key={item.id}>
            <CardTitleWrapper>
              <div className="Card-Name">{item.word}</div>
              <div className="Card-ButtonIcons">
                {/* 삼항 연산자로 리액트 요소를 생성할 수 있다는 것을 처음 알았다. 단순히 값만 비교해서 넘겨줄 수 있는 줄 */}
                {/* 생각해보면 삼항 연산자도 함수라고 생각하고 처리하면 일반 map을 돌리는 것과 다를 것 없다. */}
                {/* 뭔가 한줄로 해결할 수 있는 방법이 없을까? 지저분해보인다 */}
                { item.is_Checked ? (
                  <DoneOutline key={ item.id }
                    onClick={() =>
                      dispatch(doneDictionaryHandler( item.id, item.is_Checked ))
                    }
                    className="Card-Icon-done"
                    style={{
                      cursor: "pointer",
                      color: "white",
                      fontSize: "25px",
                    }}
                  />
                ) : (
                  <Done key={ item.id }
                    onClick={() =>
                      dispatch(doneDictionaryHandler( item.id, item.is_Checked ))
                    }
                    className="Card-Icon-done"
                    style={{
                      cursor: "pointer",
                      color: "green",
                      fontSize: "25px",
                    }}
                  />
                )}
               
                <PostAddOutlined
                  onClick={() => {
                    history.push(`/edit_word/${index}`);
                  }}
                  className="Card-Icon-edit"
                  style={{
                    cursor: "pointer",
                    color: item.is_Checked ? "white" : "green",
                    fontSize: "25px",
                  }}
                />
                <Close
                  onClick={() => {
                    dispatch(deleteDictionaryHander(item.id));
                  }}
                  className="Card-Icon-close"
                  style={{ cursor: "pointer", color: item.is_Checked ? "white" : "green", }}
                />
              </div>
            </CardTitleWrapper>
            <CardBodyWrapper>
              <div className="Card-Body-pronunciation">
                [{item.pronunciation}]
              </div>
              <div className="Card-Body-meaning">{item.meaning}</div>
              <CardExample isChecked={ item.is_Checked } className="Card-Body-example">{item.example}</CardExample>
              <CardTranslation isChecked={ item.is_Checked } className="Card-Body-translation">{item.translation}</CardTranslation>
            </CardBodyWrapper>
          </CardWrapper>
        );
      })}
    </>
  );
};

export default Card;

const CardWrapper = styled.div`
  width: 400px;
  height: 140px;
  border: 2px solid green;
  background-color: ${(props) => (props.isChecked ? "green" : "white")};
  color: ${(props) => (props.isChecked ? "white" : "black")};
  border-radius: 15px;
  padding: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  &:hover {
    transition: box-shadow 500ms;
    box-shadow: 0px 0px 15px gray;
  }
`;

const CardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & .Card-Name {
    font-size: 30px;
  }
  & .Card-Icon-done {
    margin-right: 5px;
  }
  & .Card-Icon-edit {
    margin-right: 5px;
  }
`;

const CardBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  .Card-Body-pronunciation {
    margin: 5px 0px 5px 0px;
    font-size: 15px;
  }

  .Card-Body-meaning {
    font-size: 18px;
    margin: 5px 0px 15px 0px;
  }
`;

const CardExample = styled.div`
  color: ${(props) => (props.isChecked ? "white" : "rgb(9, 132, 227)")};
`;

const CardTranslation = styled.div`
  color: ${(props) => (props.isChecked ? "white" : "rgb(9, 132, 227)")};
`;