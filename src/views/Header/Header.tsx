import style from "./Header.module.scss";
import React from "react";
import store from '../../redux/store';
import { setHighlightedClass, clearHighlightedClass } from '../../redux/reducers/classHighlightReducer';
import { D3Drawer } from "../ConceptualRecurrencePlot/Drawers/D3Drawer";
import LJS from "./image/LJS.svg";
import PHR from "./image/PHR.svg";
import JKT from "./image/JKT.svg";
import KJD from "./image/KJD.svg";
import JHJ from "./image/JHJ.svg";
import pros from "./image/pros.svg";
import cons from "./image/cons.svg";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  const handleReset = () => {
    if (D3Drawer.allDrawers.length > 0) {
      D3Drawer.allDrawers[0].resetView();
    } else {
      console.warn("No D3Drawer instances found!");
    }
  };

  const handleMouseEnter = (className: string) => {
    store.dispatch(setHighlightedClass({ className })); // Redux 상태 업데이트

    const state = store.getState();
  };

  const handleMouseLeave = () => {
    store.dispatch(clearHighlightedClass()); // Redux 상태 초기화
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
            <div className={style.pkSpace}>
              <div className={style.pkImage}>
                <img src={LJS} alt="LJS" width="35" height="35" onMouseEnter={() => handleMouseEnter('L')} onMouseLeave={handleMouseLeave} />
              </div>
              <div className={style.pkName}>
                이준석
              </div>
            </div>
            <div className={style.pkSpace}>
              <div className={style.pkImage}>
                <img src={PHR} alt="PHR" width="35" height="35" onMouseEnter={() => handleMouseEnter('P')} onMouseLeave={handleMouseLeave} />
              </div>
              <div className={style.pkName}>
                박휘락
              </div>
            </div>
            <div className={style.pkSpace}>
              <div className={style.pkImage}>
                <img src={JKT} alt="JKT" width="35" height="35" onMouseEnter={() => handleMouseEnter('J')} onMouseLeave={handleMouseLeave} />
              </div>
              <div className={style.pkName}>
                장경태
              </div>
            </div>
            <div className={style.pkSpace}>
              <div className={style.pkImage}>
                <img src={KJD} alt="KJD" width="35" height="35" onMouseEnter={() => handleMouseEnter('K')} onMouseLeave={handleMouseLeave} />
              </div>
              <div className={style.pkName}>
                김종대
              </div>
            </div>
            <div className={style.pkSpace}>
              <div className={style.pkImage}>
                <img src={JHJ} alt="JHJ" width="35" height="35" />
              </div>
              <div className={style.pkName}>
                진행자
              </div>
            </div>
          </div>
        </div>

        {/* 찬반 버튼 */}
        <div className={style.keywordFilter}>
          <div className={style.subtitle}>
            Keyword Filter
          </div>
          <div className={style.pkGroup}>
            <div className={style.pkSpace}>
              <div className={style.pkImage}>
                <img src={pros} alt="pros" width="33" height="33" />
              </div>
              <div className={style.pkName}>
                찬성
              </div>
            </div>
            <div className={style.pkSpace}>
              <div className={style.pkImage}>
                <img src={cons} alt="cons" width="33" height="33" />
              </div>
              <div className={style.pkName}>
                반대
              </div>
            </div>
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
