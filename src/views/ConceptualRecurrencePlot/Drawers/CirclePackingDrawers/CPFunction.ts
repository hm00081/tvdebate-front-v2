// migration CP1 to d3 method
/* eslint-disable no-unused-vars */
import React from "react";
import store from "../../../../redux/store";
import highlightReducer, { setHighlightedGroup } from "../../../../redux/reducers/highlightReducer";
import { clearSelectedBlock, setSelectedBlock } from "../../../../redux/reducers/similarityBlockSelectReducer";
import { DataStructureSet } from "../../DataStructureMaker/DataStructureManager";
import { SimilarityBlock } from "../../interfaces";
import _ from "lodash";
import { SentenceObject } from "../../../../interfaces/DebateDataInterface";
import { TranscriptViewerMethods } from "../../TranscriptViewer/TranscriptViewer";
import { current } from "@reduxjs/toolkit";

export class CPDrawer {
  public onTitleClicked:
    | null
    | ((
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => void) = null;

  public constructor(
    protected dataStructureSet: DataStructureSet,
    protected transcriptViewerRef: React.RefObject<TranscriptViewerMethods>
  ) {}

  public countCompoundTerms(data: SentenceObject[]): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    data.forEach(({ compoundTermCountDict }) => {
      Object.keys(compoundTermCountDict).forEach((key) => {
        result[key] = (result[key] || 0) + compoundTermCountDict[key];
      });
    });
    return result;
  }

  public getTopCompoundTerms(
    compoundTerms: { [key: string]: number },
    topN: number
  ) {
    return Object.entries(compoundTerms)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([term]) => term);
  }

  public handleClickText(index: number) {
    // console.log('Click');
    if(!index){
      if(index !== 0)
        return;
    }

    if (!this.dataStructureSet) {
      console.error("dataStructureSet is not provided to CPK component");
      return;
    }

    if (!this.transcriptViewerRef.current) {
      console.error("transcriptViewerRef is not set");
      return;
    }

    let groupId: string | null = null;
    if (index >= 0 && index < 17) {
      groupId = "g1";
    } else if (index >= 17 && index < 36) {
      groupId = "g2";
    } else if (index >= 36 && index < 55) {
      groupId = "g3";
    } else if (index >= 55 && index < 78) {
      groupId = "g4";
    } else if (index >= 78 && index < 108) {
      groupId = "g5";
    } else if (index >= 108 && index < 175) {
      groupId = "g6";
    } else if (index >= 175) {
      groupId = "g7";
    }

    // 현재 Redux 상태 확인
    const currentHighlight = store.getState().highlight.highlightedGroup;

    //@ts-ignore
    if (currentHighlight === groupId) {
      if(store.getState().similarityBlockSelect.selectedBlock.length !== 0){
        store.dispatch(setHighlightedGroup(groupId));
        store.dispatch(clearSelectedBlock());  
      } else {
        // 같은 groupId가 이미 Redux 상태에 저장되어 있다면 해제
        store.dispatch(setHighlightedGroup(null));
        store.dispatch(clearSelectedBlock());
      }
    } else {
      if(store.getState().similarityBlockSelect.selectedBlock.length !== 0){
        store.dispatch(clearSelectedBlock());
        store.dispatch(setHighlightedGroup(groupId));
      } else {
        // 같은 groupId가 이미 Redux 상태에 저장되어 있다면 해제
        store.dispatch(setHighlightedGroup(groupId));
      }
    }

    const utterance = this.dataStructureSet.utteranceObjectsForDrawingManager
      .utteranceObjectsForDrawing[index];
    const compoundTerms = this.countCompoundTerms(utterance.sentenceObjects);
    const topTerms = this.getTopCompoundTerms(compoundTerms, 30);

    if (this.transcriptViewerRef && this.transcriptViewerRef.current) {
      this.transcriptViewerRef.current.scrollToIndex(index);
      this.transcriptViewerRef.current.highlightKeywords(
        topTerms,
        [],
        index,
        -1
      );
    }
  }

  public handleClick(
    index: number,
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) {
    // console.log('handleClick', index, event);
    if(!index){
      if(index !== 0)
        return;
    }

    if (!this.dataStructureSet) {
      console.error("dataStructureSet is not provided to CP");
      return;
    }
    // transcriptViewerRef의 current 속성의 존재 여부 확인
    if (!this.transcriptViewerRef.current) {
      console.error("transcriptViewerRef is not set");
      return;
    }

    document.querySelectorAll(".highlighted").forEach((el) => {
      (el as SVGPathElement).style.stroke = "none";
      (el as SVGPathElement).style.strokeWidth = "0";
      el.classList.remove("highlighted");
    });

    // 클릭된 요소의 스타일 변경
    const clickedElement = event.currentTarget;
    clickedElement.style.stroke = "#fc2c34";
    clickedElement.style.strokeWidth = "1.5";
    clickedElement.classList.add("highlighted");

    const utterance = this.dataStructureSet.utteranceObjectsForDrawingManager
      .utteranceObjectsForDrawing[index];
    // console.log("utterance", utterance); 잘 나옴
    const compoundTerms = this.countCompoundTerms(utterance.sentenceObjects);
    const topTerms = this.getTopCompoundTerms(compoundTerms, 30);

    if (this.transcriptViewerRef.current) {
      this.transcriptViewerRef.current.scrollToIndex(index);
      this.transcriptViewerRef.current.highlightKeywords(
        topTerms,
        [],
        index,
        -1
      );
    }
  }
}
