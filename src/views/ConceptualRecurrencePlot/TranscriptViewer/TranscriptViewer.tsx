/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { DataStructureManager } from '../DataStructureMaker/DataStructureManager';
import styles from './TranscriptViewer.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setHighlightKeywords } from '../../../redux/reducers/highlightTextReducer';

interface ComponentProps {
    isOpen: boolean;
    dataStructureMaker: DataStructureManager | null;
}

export interface TranscriptViewerMethods {
    scrollToIndex: (index: number) => void;
    highlightKeywords: (rowKeywords: string[], colKeywords: string[], rowIndex: number, colIndex: number) => void;
}

const TranscriptViewer = forwardRef<TranscriptViewerMethods, ComponentProps>((props, ref) => {
    const { isOpen, dataStructureMaker } = props;
    const dispatch = useDispatch();

    const utteranceRefs = useRef<(HTMLDivElement | null)[]>([]);

    const { rowTopTerms, colTopTerms, rowTopThirtyTerms, colTopThirtyTerms, activeIndex } = useSelector((state: RootState) => state.hightlightText);

    const highlightText = (text: string, keywords: string[]) => {
        let highlightedText = text;
        keywords.forEach((keyword) => {
            const regex = new RegExp(`(${keyword})`, 'gi');
            highlightedText = highlightedText.replace(regex, "<span class='highlight' style='border: 1.1px solid red; color: black;'>$1</span>");
        });
        return highlightedText;
    };

    useEffect(() => {
        if (dataStructureMaker) {
            utteranceRefs.current = new Array(dataStructureMaker.dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing.length).fill(null);
        }
    }, [dataStructureMaker]);

    useImperativeHandle(ref, () => ({
        scrollToIndex: (index: number) => {
            const targetElement = utteranceRefs.current[index];
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        },
        highlightKeywords: (rowKeywords: string[], colKeywords: string[], rowIndex: number, colIndex: number) => {
            dispatch(
                setHighlightKeywords({
                    rowTopTerms: rowKeywords.slice(0, 3),
                    colTopTerms: colKeywords.slice(0, 3),
                    rowTopThirtyTerms: rowKeywords,
                    colTopThirtyTerms: colKeywords,
                    activeIndex: { row: rowIndex, col: colIndex },
                })
            );
        },
    }));

    if (!props.isOpen) return null;

    return (
        <div className={`${styles.transcriptViewer} ${isOpen ? styles.open : ''}`}>
            {props.dataStructureMaker ? (
                _.map(props.dataStructureMaker.dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing, (utteranceObject, index) => {
                    const rowKeywords = index === activeIndex.row ? rowTopTerms : [];
                    const colKeywords = index === activeIndex.col ? colTopTerms : [];
                    const combinedKeywords = [...rowKeywords, ...colKeywords];
                    const currentKeywords = index === activeIndex.row ? rowTopThirtyTerms : index === activeIndex.col ? colTopThirtyTerms : [];
                    const highlightedUtterance = highlightText(utteranceObject.utterance, currentKeywords);

                    return (
                        <div
                            ref={(el) => {
                                utteranceRefs.current[index] = el;
                            }}
                            style={{ marginBottom: '12px' }}
                            key={`utterance-${index}`}
                        >
                            <div
                                style={{
                                    color: props.dataStructureMaker!.dataStructureSet.participantDict[utteranceObject.name].color,
                                }}
                            >
                                [ {utteranceObject.name} ] / {index} /{utteranceObject.sentenceObjects[0].time!} /
                                {(index === activeIndex.row || index === activeIndex.col) && <span style={{ color: '#400000', fontWeight: 'bold' }}> {combinedKeywords.join(', ')} </span>}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: highlightedUtterance }} />
                        </div>
                    );
                })
            ) : (
                <div />
            )}
        </div>
    );
});

export default TranscriptViewer;
