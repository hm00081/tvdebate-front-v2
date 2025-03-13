import style from "./Header.module.scss";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import store from '../../redux/store';
import { setHighlightedClass, clearHighlightedClass } from '../../redux/reducers/classHighlightReducer';
import { clearHighlightedGroup } from '../../redux/reducers/highlightReducer';
import { clearSelectedBlock } from "../../redux/reducers/similarityBlockSelectReducer";
import { D3Drawer } from "../ConceptualRecurrencePlot/Drawers/D3Drawer";
import LJS from "./image/LJS.svg";
import PHR from "./image/PHR.svg";
import JKT from "./image/JKT.svg";
import KJD from "./image/KJD.svg";
import JHJ from "./image/JHJ.svg";
import pros from "./image/pros.svg";
import cons from "./image/cons.svg";

const participants = [
  { id: "LJS", name: "이준석", img: LJS },
  { id: "PHR", name: "박휘락", img: PHR },
  { id: "JKT", name: "장경태", img: JKT },
  { id: "KJD", name: "김종대", img: KJD },
];

const prosNcons = [
  { id: "PROS", name: "찬성", img: pros },
  { id: "CONS", name: "반대", img: cons },
]

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const highlightedClass = useSelector((state: any) => state.classHighLight.highlightedClassName);

  useEffect(() => {
    // Redux store 구독하여 highlightedClass 변경 감지
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setSelectedParticipant(state.classHighLight.highlightedClassName);
    });

    return () => {
      unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    };
  }, []);

  const handleReset = () => {
    if (D3Drawer.allDrawers.length > 0) {
      D3Drawer.allDrawers[0].resetView();
      store.dispatch(clearSelectedBlock());
      store.dispatch(clearHighlightedClass());
      store.dispatch(clearHighlightedGroup());
    } else {
      console.warn("No D3Drawer instances found!");
    }
  };

  const handleParticipantClick = (className: string) => {
    if (selectedParticipant === className) {
      setSelectedParticipant(null);
      store.dispatch(clearSelectedBlock());
      store.dispatch(clearHighlightedClass());
      store.dispatch(clearHighlightedGroup());
    } else {
      setSelectedParticipant(className);
      store.dispatch(setHighlightedClass({ className }));
      store.dispatch(clearSelectedBlock());
      store.dispatch(clearHighlightedGroup());
    }
  };

  return (
    <div className={style.mainLink}>
      <div className={style.navi}>
        {/* 제목 */}
        <div className={style.title}>
          MetaDebateVis
        </div>

        {/* 위치 고정 */}
        <div className={style.initializeLocation}>
          <div className={style.subtitle}>
            Initialize Location
          </div>
          <div className={style.resetButton}>
            <button onClick={handleReset} className={style.button}>
              RESET
            </button>
          </div>
        </div>

        {/* 참여자 버튼 */}
        <div className={style.participantsFilter}>
          <div className={style.subtitle}>
            Participants Filter
          </div>
          <div className={style.pkGroup}>
          {participants.map(({ id, name, img }) => (
              <div key={id} className={`${style.pkSpace} ${highlightedClass && highlightedClass !== id ? style.grayscale : ""}`}>
                <div className={style.pkImage}>
                  <img
                    src={img}
                    alt={id}
                    width="35"
                    height="35"
                    onClick={() => handleParticipantClick(id)}
                    className={highlightedClass === id ? style.selected : ""}
                  />
                </div>
                <div className={style.pkName}>{name}</div>
              </div>
            ))}
            <div className={`${style.pkSpace} ${highlightedClass ? style.grayscale : ""}`}>
              <div className={`${style.pkImage} ${highlightedClass ? style.grayscale : ""}`}>
                <img src={JHJ} alt="JHJ" width="35" height="35" />
              </div>
              <div className={style.pkName}>진행자</div>
            </div>
          </div>
        </div>

        {/* 찬반 버튼 */}
        <div className={style.keywordFilter}>
          <div className={style.subtitle}>
            Keyword Filter
          </div>
          <div className={style.pkGroup}>
          {prosNcons.map(({ id, name, img }) => (
              <div key={id} className={`${style.pkSpace} ${selectedParticipant && selectedParticipant !== id ? style.grayscale : ""}`}>
                <div className={style.pkImage}>
                  <img
                    src={img}
                    alt={id}
                    width="35"
                    height="35"
                    onClick={() => handleParticipantClick(id)}
                    className={selectedParticipant === id ? style.selected : ""}
                  />
                </div>
                <div className={style.pkName}>{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 논쟁 슬라이더 */}
        <div className={style.frequencyOfDebate}>
          <div className={style.subtitle}>
            Frequency of Debate
          </div>
          <div className={style.slider}>

          </div>
        </div>

        {/* 스크립트 토글 */}
        <div className={style.scriptOption}>
          <div className={style.subtitle}>
            Script Option
          </div>
          <div className={style.toggle}>

          </div>
        </div>
      </div>
    </div>
  );
}
