import style from './Header.module.scss';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import store from '../../redux/store';
import { setHighlightedClass, clearHighlightedClass } from '../../redux/reducers/classHighlightReducer';
import { clearHighlightedGroup } from '../../redux/reducers/highlightReducer';
import { clearSelectedBlock } from '../../redux/reducers/similarityBlockSelectReducer';
import { updateFilter, clearFilter } from '../../redux/reducers/matrixFilterReducer';
import { D3Drawer } from '../ConceptualRecurrencePlot/Drawers/D3Drawer';
import LJS from './image/LJS.svg';
import PHR from './image/PHR.svg';
import JKT from './image/JKT.svg';
import KJD from './image/KJD.svg';
import JHJ from './image/JHJ.svg';
import pros from './image/pros.svg';
import cons from './image/cons.svg';
import { clearHighlightKeywords } from '../../redux/reducers/highlightTextReducer';

const participants = [
    { id: 'LJS', name: '이준석', img: LJS },
    { id: 'PHR', name: '박휘락', img: PHR },
    { id: 'JKT', name: '장경태', img: JKT },
    { id: 'KJD', name: '김종대', img: KJD },
];

const prosNcons = [
    { id: 'PROS', name: '찬성', img: pros },
    { id: 'CONS', name: '반대', img: cons },
];

interface HeaderProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
    const [isScriptVisible, setIsScriptVisible] = useState(true);
    const [tempRange, setTempRange] = useState<[number, number]>([0, 100]);
    const [range, setRange] = useState<[number, number]>([0, 100]);
    const sliderMarks = [0, 25, 50, 75, 100];
    const dispatch = useDispatch();
    const matrixFilter = useSelector((state: RootState) => state.matrixFilter.filter);
    const highlightedClasses = useSelector((state: RootState) => state.classHighLight.highlightedClasses || []);
    const highlightedGroup = useSelector((state: RootState) => state.highlight.highlightedGroup || []);
    const selectedBlock = useSelector((state: RootState) => state.similarityBlockSelect.selectedBlock || []);

    useEffect(() => {
        //@ts-ignore
        setRange(matrixFilter);
        //@ts-ignore
        setTempRange(matrixFilter);
    }, [matrixFilter]);

    useEffect(() => {
        setIsScriptVisible(isOpen);
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(isScriptVisible);
    }, [isScriptVisible, setIsOpen]);

    const handleReset = () => {
        if (D3Drawer.allDrawers.length > 0) {
            D3Drawer.allDrawers[0].resetView();
            store.dispatch(clearSelectedBlock());
            store.dispatch(clearHighlightedClass());
            store.dispatch(clearHighlightedGroup());
            store.dispatch(clearFilter());
            store.dispatch(clearHighlightKeywords());
        } else {
            // console.warn("No D3Drawer instances found!");
        }
    };

    const handleParticipantClick = (className: string) => {
        //@ts-ignore
        if ((Array.isArray(store.getState().highlight.highlightedGroup) && store.getState().highlight.highlightedGroup.length > 0) || store.getState().similarityBlockSelect.selectedBlock.length > 0) {
            store.dispatch(clearHighlightedClass());
        }
        store.dispatch(clearHighlightedGroup());
        store.dispatch(clearSelectedBlock());
        store.dispatch(setHighlightedClass({ className }));
        // console.log("highlightedClasses after update:", store.getState().classHighLight.highlightedClasses);
    };

    return (
        <div className={style.mainLink}>
            <div className={style.navi}>
                {/* 제목 */}
                <div className={style.title}>MetaDebateVis</div>

                {/* 위치 고정 */}
                <div className={style.initializeLocation}>
                    <div className={style.subtitle}>Initialize State</div>
                    <div className={style.resetButton}>
                        <button onClick={handleReset} className={style.button}>
                            RESET
                        </button>
                    </div>
                </div>

                {/* 참여자 버튼 */}
                <div className={style.participantsFilter}>
                    <div className={style.subtitle}>Participants Filter</div>
                    <div className={style.pkGroup}>
                        {participants.map(({ id, name, img }) => (
                            <div
                                key={id}
                                className={`${style.pkSpace} ${
                                    highlightedGroup.length > 0 || selectedBlock.length > 0 || highlightedClasses.length === 0 || highlightedClasses.includes(id) ? style.selected : style.grayscale
                                }`}
                            >
                                <div className={style.pkImage}>
                                    <img src={img} alt={id} width="35" height="35" onClick={() => handleParticipantClick(id)} />
                                </div>
                                <div className={style.pkName}>{name}</div>
                            </div>
                        ))}
                        <div className={`${style.pkSpace} ${highlightedClasses.length > 0 && highlightedGroup.length === 0 && selectedBlock.length === 0 ? style.grayscale : ''}`}>
                            <div className={`${style.pkImage} ${highlightedClasses.length > 0 && highlightedGroup.length === 0 && selectedBlock.length === 0 ? style.grayscale : ''}`}>
                                <img src={JHJ} alt="JHJ" width="35" height="35" />
                            </div>
                            <div className={style.pkName}>진행자</div>
                        </div>
                    </div>
                </div>

                {/* 찬반 버튼 */}
                <div className={style.keywordFilter}>
                    <div className={style.subtitle}>Keyword Filter</div>
                    <div className={style.pkGroup}>
                        {prosNcons.map(({ id, name, img }) => (
                            <div
                                key={id}
                                className={`${style.pkSpace} ${
                                    highlightedGroup.length > 0 || selectedBlock.length > 0 || highlightedClasses.length === 0 || highlightedClasses.includes(id) ? style.selected : style.grayscale
                                }`}
                            >
                                <div className={style.pkImage}>
                                    <img src={img} alt={id} width="35" height="35" onClick={() => handleParticipantClick(id)} />
                                </div>
                                <div className={style.pkName}>{name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 논쟁 슬라이더 */}
                <div className={style.frequencyOfDebate}>
                    <div className={style.subtitle}>Frequency of Debate</div>
                    <div className={style.slider}>
                        <div className={style.customSliderWrapper}>
                            {/* 그라데이션 바 */}
                            <div className={style.sliderRange} />

                            {/* 핸들 */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="25"
                                value={tempRange[0]}
                                onChange={(e) => setTempRange([Math.min(Number(e.target.value), tempRange[1]), tempRange[1]])}
                                onMouseUp={() => {
                                    const updated = [Math.min(tempRange[0], tempRange[1]), Math.max(tempRange[0], tempRange[1])] as [number, number];
                                    setRange(updated);
                                    dispatch(updateFilter(updated));
                                    // console.log("Updated filter:", updated);
                                }}
                                className={`${style.customSlider} ${style.thumbLeft}`}
                            />

                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="25"
                                value={tempRange[1]}
                                onChange={(e) => setTempRange([tempRange[0], Math.max(Number(e.target.value), tempRange[0])])}
                                onMouseUp={() => {
                                    const updated = [Math.min(tempRange[0], tempRange[1]), Math.max(tempRange[0], tempRange[1])] as [number, number];
                                    setRange(updated);
                                    dispatch(updateFilter(updated));
                                    // console.log("Updated filter:", updated);
                                }}
                                className={`${style.customSlider} ${style.thumbRight}`}
                            />

                            {/* 마커 + 삼각형 포인터 */}
                            <div className={style.sliderMarks}>
                                {sliderMarks.map((mark) => {
                                    const isSelected = mark === range[0] || mark === range[1];
                                    return (
                                        <div
                                            key={mark}
                                            className={style.sliderMark}
                                            style={{ left: `${mark}%` }}
                                            onClick={() => {
                                                const middle = (range[0] + range[1]) / 2;
                                                // 가까운 쪽의 핸들을 이동
                                                if (Math.abs(mark - range[0]) < Math.abs(mark - range[1])) {
                                                    setRange([mark, range[1]]);
                                                } else {
                                                    setRange([range[0], mark]);
                                                }
                                            }}
                                        >
                                            {isSelected && <div className={style.triangle} />}
                                            <div className={`${style.markCircle} ${isSelected ? style.active : ''}`} />
                                            <div className={style.markLabel}>{mark}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 스크립트 토글 */}
                <div className={style.scriptOption}>
                    <div className={style.subtitle}>Script Option</div>
                    <div className={`${style.toggle} ${isScriptVisible ? style.active : ''}`} onClick={() => setIsScriptVisible(!isScriptVisible)}>
                        <span className={style.text}>{isScriptVisible ? 'SHOW' : 'HIDE'}</span>
                        <div className={style.circle}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
