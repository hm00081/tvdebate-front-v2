// migration CP1 to d3 method
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { TermType } from '../../DataImporter';
import { DataStructureSet } from '../../DataStructureMaker/DataStructureManager';
import { DebateDataSet } from '../../../../interfaces/DebateDataInterface';
import { SimilarityBlock } from '../../interfaces';
import * as d3 from 'd3';
import _ from 'lodash';
import { D3Drawer } from '../D3Drawer';
import { TranscriptViewerMethods } from '../../TranscriptViewer/TranscriptViewer';
import { styleText } from './StyleText';
import { name, allRectData, personData, rectData, personPCData, pathsData } from './PCData';
import store from '../../../../redux/store';
import { setHighlightedClass, clearHighlightedClass } from '../../../../redux/reducers/classHighlightReducer';
import { setHighlightedGroup } from '../../../../redux/reducers/highlightReducer';
import { clearSelectedBlock, setSelectedBlock } from '../../../../redux/reducers/similarityBlockSelectReducer';

interface Rect {
    type: string;
    attributes: {
        onClick: number;
        onHover: number;
        x: string;
        y: string;
        className: string;
        width: string;
        height: string;
    };
}

export class PlotChartDrawer {
    private readonly topicGuidePCGSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>;
    private previousClickedRect: Element | null = null;
    private _topicGroups: SimilarityBlock[][][] = [];
    private _selectedBlockIndices: Array<[number, number]> = [];

    public onTitleClicked: null | ((mouseEvent: MouseEvent, engagementGroup: SimilarityBlock[][], engagementGroupIndex: number) => void) = null;

    public constructor(
        svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>,
        private readonly dataStructureSet: DataStructureSet,
        private readonly transcriptViewerRef: React.RefObject<TranscriptViewerMethods>,
        private readonly d3Drawer: D3Drawer
    ) {
        this.topicGuidePCGSelection = svgSelection.append('g');

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    public set topicGroups(topicGroups: SimilarityBlock[][][]) {
        this._topicGroups = topicGroups;
    }

    public get topicGroups() {
        return this._topicGroups;
    }

    public onBarClick(index: number): void {
        // useImperativeHandle을 통해 컴포넌트 기능 수행
        if (this.transcriptViewerRef.current) {
            this.transcriptViewerRef.current.scrollToIndex(index);
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' || event.key === 'Esc') {
            if (this.previousClickedRect) {
                d3.select(this.previousClickedRect).style('stroke', 'none').style('stroke-width', '0');
                this.previousClickedRect = null; // 상태 초기화
            }

            this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();
        }
    }

    private setState(block: SimilarityBlock, group: string) {
        const nameMap: Record<string, string> = {
            이준석: "LJS",
            장경태: "JKT",
            김종대: "KJD",
            박휘락: "PHR",
        }

        store.dispatch(clearSelectedBlock());
        store.dispatch(setSelectedBlock([[nameMap[block.colUtteranceName], nameMap[block.rowUtteranceName]], []]));
        store.dispatch(setHighlightedGroup([group, group]));
        store.dispatch(clearHighlightedClass());
        store.dispatch(setHighlightedClass({ className: nameMap[block.colUtteranceName] }));
        store.dispatch(setHighlightedClass({ className: nameMap[block.rowUtteranceName] }));
    }

    public handleBarClickOne(barIndex: number) {
        const similarityBlocks = this.dataStructureSet.similarityBlockManager.similarityBlocks;
        this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();

        //@ts-ignore
        const filteredBlocks = similarityBlocks.filter((block) => {
            const argumentScore = (block.similarity * block.weight) / Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex));
            const isHighScore = argumentScore >= 0.25;

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 0 &&
                        block.rowUtteranceIndex <= 18 &&
                        block.columnUtteranceIndex >= 0 &&
                        block.columnUtteranceIndex <= 18;
                    if (block.columnUtteranceIndex === 12 && block.rowUtteranceIndex === 13) {
                        this.setState(block, "g1");
                        return true;
                    }
                    break;
                case 1: // 이준석, 김종대
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 0 &&
                        block.rowUtteranceIndex <= 18 &&
                        block.columnUtteranceIndex >= 0 &&
                        block.columnUtteranceIndex <= 18;
                    if (block.columnUtteranceIndex === 1 && block.rowUtteranceIndex === 16) {
                        this.setState(block, "g1");
                        return true;
                    }
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 0 &&
                        block.rowUtteranceIndex <= 18 &&
                        block.columnUtteranceIndex >= 0 &&
                        block.columnUtteranceIndex <= 18;
                    if (block.columnUtteranceIndex === 3 && block.rowUtteranceIndex === 5) {
                        this.setState(block, "g1");
                        return true;
                    }
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 0 &&
                        block.rowUtteranceIndex <= 18 &&
                        block.columnUtteranceIndex >= 0 &&
                        block.columnUtteranceIndex <= 18;
                    if (block.columnUtteranceIndex === 1 && block.rowUtteranceIndex === 3) {
                        this.setState(block, "g1");
                        return true;
                    }
                    break;
            }

            return isHighScore && condition;
        });

        const indexPairs: [number, number][] = filteredBlocks.map((block) => [block.rowUtteranceIndex, block.columnUtteranceIndex] as [number, number]);
        this.d3Drawer.similarityBlocksDrawer.setMultipleBlockIndices(indexPairs);
    }

    public handleBarClickTwo(barIndex: number) {
        // this.dataStructureSet에서 SimilarityBlocks 정보 가져오기
        const similarityBlocks = this.dataStructureSet.similarityBlockManager.similarityBlocks;
        this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();

        // 특정 조건에 따른 필터링
        const filteredBlocks = similarityBlocks.filter((block) => {
            const argumentScore = (block.similarity * block.weight) / Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex));
            const isHighScore = argumentScore >= 0.25;
            // console.log("block", block);    

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
                    if (block.columnUtteranceIndex === 16 && block.rowUtteranceIndex === 31) {
                        this.setState(block, "g2");
                        return true;
                    }
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
                    if (block.columnUtteranceIndex === 15 && block.rowUtteranceIndex === 16) {
                        this.setState(block, "g2");
                        return true;
                    }
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
                    if (block.columnUtteranceIndex === 18 && block.rowUtteranceIndex === 31) {
                        this.setState(block, "g2");
                        return true;
                    }
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
                    if (block.columnUtteranceIndex === 15 && block.rowUtteranceIndex === 18) {
                        this.setState(block, "g2");
                        return true;
                    }
                    break;
            }
            return isHighScore && condition;
        });

        const indexPairs: [number, number][] = filteredBlocks.map((block) => [block.rowUtteranceIndex, block.columnUtteranceIndex] as [number, number]);
        //@ts-ignore
        this.d3Drawer.similarityBlocksDrawer.setMultipleBlockIndices(indexPairs);
    }

    public handleBarClickThree(barIndex: number) {
        // this.dataStructureSet에서 SimilarityBlocks 정보 가져오기
        const similarityBlocks = this.dataStructureSet.similarityBlockManager.similarityBlocks;
        this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();

        // 특정 조건에 따른 필터링
        const filteredBlocks = similarityBlocks.filter((block) => {
            const argumentScore = (block.similarity * block.weight) / Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex));
            const isHighScore = argumentScore >= 0.25;

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 24 &&
                        block.rowUtteranceIndex <= 58 &&
                        block.columnUtteranceIndex >= 24 &&
                        block.columnUtteranceIndex <= 58 &&
                        !((block.columnUtteranceIndex === 28 && block.rowUtteranceIndex === 56) || (block.columnUtteranceIndex === 28 && block.rowUtteranceIndex === 58));
                    if (block.columnUtteranceIndex === 28 && block.rowUtteranceIndex === 31) {
                        this.setState(block, "g3");
                        return true;
                    }
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 24 &&
                        block.rowUtteranceIndex <= 58 &&
                        block.columnUtteranceIndex >= 24 &&
                        block.columnUtteranceIndex <= 58;
                    if (block.columnUtteranceIndex === 24 && block.rowUtteranceIndex === 28) {
                        this.setState(block, "g3");
                        return true;
                    }
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 24 &&
                        block.rowUtteranceIndex <= 58 &&
                        block.columnUtteranceIndex >= 24 &&
                        block.columnUtteranceIndex <= 58;
                    if (block.columnUtteranceIndex === 31 && block.rowUtteranceIndex === 35) {
                        this.setState(block, "g3");
                        return true;
                    }
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 24 &&
                        block.rowUtteranceIndex <= 58 &&
                        block.columnUtteranceIndex >= 24 &&
                        block.columnUtteranceIndex <= 58;
                    if (block.columnUtteranceIndex === 24 && block.rowUtteranceIndex === 35) {
                        this.setState(block, "g3");
                        return true;
                    }
                    break;
            }
            return isHighScore && condition;
        });

        const indexPairs: [number, number][] = filteredBlocks.map((block) => [block.rowUtteranceIndex, block.columnUtteranceIndex] as [number, number]);
        //@ts-ignore
        this.d3Drawer.similarityBlocksDrawer.setMultipleBlockIndices(indexPairs);
    }

    public handleBarClickFour(barIndex: number) {
        // this.dataStructureSet에서 SimilarityBlocks 정보 가져오기
        const similarityBlocks = this.dataStructureSet.similarityBlockManager.similarityBlocks;
        this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();

        // 특정 조건에 따른 필터링
        const filteredBlocks = similarityBlocks.filter((block) => {
            const argumentScore = (block.similarity * block.weight) / Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex));
            const isHighScore = argumentScore >= 0.25;

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 43 &&
                        block.rowUtteranceIndex <= 79 &&
                        block.columnUtteranceIndex >= 43 &&
                        block.columnUtteranceIndex <= 79;
                    if (block.columnUtteranceIndex === 43 && block.rowUtteranceIndex === 56) {
                        this.setState(block, "g4");
                        return true;
                    }
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 43 &&
                        block.rowUtteranceIndex <= 79 &&
                        block.columnUtteranceIndex >= 43 &&
                        block.columnUtteranceIndex <= 79 &&
                        !(
                            (block.columnUtteranceIndex === 43 && block.rowUtteranceIndex === 48) ||
                            (block.columnUtteranceIndex === 43 && block.rowUtteranceIndex === 51) ||
                            (block.columnUtteranceIndex === 43 && block.rowUtteranceIndex === 76)
                        );
                    if (block.columnUtteranceIndex === 76 && block.rowUtteranceIndex === 79) {
                        this.setState(block, "g4");
                        return true;
                    }
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 43 &&
                        block.rowUtteranceIndex <= 79 &&
                        block.columnUtteranceIndex >= 43 &&
                        block.columnUtteranceIndex <= 79;
                    if (block.columnUtteranceIndex === 63 && block.rowUtteranceIndex === 70) {
                        this.setState(block, "g4");
                        return true;
                    }
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 43 &&
                        block.rowUtteranceIndex <= 79 &&
                        block.columnUtteranceIndex >= 43 &&
                        block.columnUtteranceIndex <= 79;
                    if (block.columnUtteranceIndex === 70 && block.rowUtteranceIndex === 76) {
                        this.setState(block, "g4");
                        return true;
                    }
                    break;
            }
            return isHighScore && condition;
        });

        const indexPairs: [number, number][] = filteredBlocks.map((block) => [block.rowUtteranceIndex, block.columnUtteranceIndex] as [number, number]);
        //@ts-ignore
        this.d3Drawer.similarityBlocksDrawer.setMultipleBlockIndices(indexPairs);
    }

    public handleBarClickFive(barIndex: number) {
        // this.dataStructureSet에서 SimilarityBlocks 정보 가져오기
        const similarityBlocks = this.dataStructureSet.similarityBlockManager.similarityBlocks;
        this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();

        // 특정 조건에 따른 필터링
        const filteredBlocks = similarityBlocks.filter((block) => {
            const argumentScore = (block.similarity * block.weight) / Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex));
            const isHighScore = argumentScore >= 0.25;
            // console.log("block", block);
            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 73 &&
                        block.rowUtteranceIndex <= 106 &&
                        block.columnUtteranceIndex >= 73 &&
                        block.columnUtteranceIndex <= 106;
                    if (block.columnUtteranceIndex === 73 && block.rowUtteranceIndex === 79) {
                        this.setState(block, "g5");
                        return true;
                    }
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 73 &&
                        block.rowUtteranceIndex <= 106 &&
                        block.columnUtteranceIndex >= 73 &&
                        block.columnUtteranceIndex <= 106;
                    if ((block.columnUtteranceIndex === 80 && block.rowUtteranceIndex === 85) || (block.columnUtteranceIndex === 84 && block.rowUtteranceIndex === 85)) {
                        this.setState(block, "g5");
                        return true;
                    }
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 73 &&
                        block.rowUtteranceIndex <= 106 &&
                        block.columnUtteranceIndex >= 73 &&
                        block.columnUtteranceIndex <= 106;
                    if (block.columnUtteranceIndex === 94 && block.rowUtteranceIndex === 104) {
                        this.setState(block, "g5");
                        return true;
                    }
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 73 &&
                        block.rowUtteranceIndex <= 106 &&
                        block.columnUtteranceIndex >= 73 &&
                        block.columnUtteranceIndex <= 106;
                    if (block.columnUtteranceIndex === 74 && block.rowUtteranceIndex === 76) {
                        this.setState(block, "g5");
                        return true;
                    }
                    break;
            }
            return isHighScore && condition;
        });

        const indexPairs: [number, number][] = filteredBlocks.map((block) => [block.rowUtteranceIndex, block.columnUtteranceIndex] as [number, number]);
        //@ts-ignore
        this.d3Drawer.similarityBlocksDrawer.setMultipleBlockIndices(indexPairs);
    }

    public handleBarClickSix(barIndex: number) {
        // this.dataStructureSet에서 SimilarityBlocks 정보 가져오기
        const similarityBlocks = this.dataStructureSet.similarityBlockManager.similarityBlocks;
        this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();

        // 특정 조건에 따른 필터링
        const filteredBlocks = similarityBlocks.filter((block) => {
            const argumentScore = (block.similarity * block.weight) / Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex));
            const isHighScore = argumentScore >= 0.25;

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 94 &&
                        block.rowUtteranceIndex <= 126 &&
                        block.columnUtteranceIndex >= 94 &&
                        block.columnUtteranceIndex <= 126;
                    if ((block.columnUtteranceIndex === 109 && block.rowUtteranceIndex === 111) || (block.columnUtteranceIndex === 111 && block.rowUtteranceIndex === 115)) {
                        this.setState(block, "g6");
                        return true;
                    }
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 94 &&
                        block.rowUtteranceIndex <= 126 &&
                        block.columnUtteranceIndex >= 94 &&
                        block.columnUtteranceIndex <= 126;
                    if ((block.columnUtteranceIndex === 121 && block.rowUtteranceIndex === 126) || (block.columnUtteranceIndex === 123 && block.rowUtteranceIndex === 126)) {
                        this.setState(block, "g6");
                        return true;
                    }
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 94 &&
                        block.rowUtteranceIndex <= 126 &&
                        block.columnUtteranceIndex >= 94 &&
                        block.columnUtteranceIndex <= 126;
                    if (block.columnUtteranceIndex === 106 && block.rowUtteranceIndex === 113) {
                        this.setState(block, "g6");
                        return true;
                    }
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 94 &&
                        block.rowUtteranceIndex <= 126 &&
                        block.columnUtteranceIndex >= 94 &&
                        block.columnUtteranceIndex <= 126;
                    break;
            }
            return isHighScore && condition;
        });

        const indexPairs: [number, number][] = filteredBlocks.map((block) => [block.rowUtteranceIndex, block.columnUtteranceIndex] as [number, number]);
        //@ts-ignore
        this.d3Drawer.similarityBlocksDrawer.setMultipleBlockIndices(indexPairs);
    }

    public handleBarClickSeven(barIndex: number) {
        // this.dataStructureSet에서 SimilarityBlocks 정보 가져오기
        const similarityBlocks = this.dataStructureSet.similarityBlockManager.similarityBlocks;
        this.d3Drawer.similarityBlocksDrawer.clearSelectedBlocks();

        // 특정 조건에 따른 필터링
        const filteredBlocks = similarityBlocks.filter((block) => {
            const argumentScore = (block.similarity * block.weight) / Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex));
            const isHighScore = argumentScore >= 0.25;

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 146 &&
                        block.rowUtteranceIndex <= 183 &&
                        block.columnUtteranceIndex >= 146 &&
                        block.columnUtteranceIndex <= 183;
                    if (block.columnUtteranceIndex === 176 && block.rowUtteranceIndex === 178) {
                        this.setState(block, "g7");
                        return true;
                    }
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 146 &&
                        block.rowUtteranceIndex <= 183 &&
                        block.columnUtteranceIndex >= 146 &&
                        block.columnUtteranceIndex <= 183;
                    if ((block.columnUtteranceIndex === 176 && block.rowUtteranceIndex === 182) || (block.columnUtteranceIndex === 178 && block.rowUtteranceIndex === 180)) {
                        this.setState(block, "g7");
                        return true;
                    }
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 146 &&
                        block.rowUtteranceIndex <= 183 &&
                        block.columnUtteranceIndex >= 146 &&
                        block.columnUtteranceIndex <= 183;
                    if ((block.columnUtteranceIndex === 172 && block.rowUtteranceIndex === 173) || (block.columnUtteranceIndex === 178 && block.rowUtteranceIndex === 180)) {
                        this.setState(block, "g7");
                        return true;
                    }
                    break;

                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 146 &&
                        block.rowUtteranceIndex <= 183 &&
                        block.columnUtteranceIndex >= 146 &&
                        block.columnUtteranceIndex <= 183;
                    if (block.columnUtteranceIndex === 161 && block.rowUtteranceIndex === 163) {
                        this.setState(block, "g7");
                        return true;
                    }
                    break;
            }
            return isHighScore && condition;
        });

        const indexPairs: [number, number][] = filteredBlocks.map((block) => [block.rowUtteranceIndex, block.columnUtteranceIndex] as [number, number]);
        //@ts-ignore
        this.d3Drawer.similarityBlocksDrawer.setMultipleBlockIndices(indexPairs);
    }

    public update() {
        const classRanges: Record<string, string[]> = {
            g1: ["이준석-1", "이준석-2", "이준석-3", "장경태-1", "장경태-2", "박휘락-1", "박휘락-2", "김종대-1", "김종대-2"],
            g2: ["이준석-2", "이준석-3", "이준석-4", "장경태-2", "장경태-3", "박휘락-2", "박휘락-3", "김종대-2", "김종대-3", "김종대-4"],
            g3: ["이준석-4", "이준석-5", "장경태-3", "장경태-4", "박휘락-3", "김종대-3", "김종대-4"],
            g4: ["이준석-5", "이준석-6", "장경태-4", "박휘락-4", "김종대-5", "김종대-6"],
            g5: ["이준석-6", "이준석-7", "장경태-5", "장경태-6", "박휘락-4", "박휘락-5", "김종대-5", "김종대-6"],
            g6: ["이준석-7", "장경태-5", "장경태-6", "박휘락-5"],
            g7: ["이준석-8", "이준석-9", "장경태-7", "장경태-8", "박휘락-6", "박휘락-7", "김종대-7", "김종대-8", "김종대-9"],
        };
        
        store.subscribe(() => {
            const highlightedClasses = store.getState().classHighLight.highlightedClasses;
            const highlightedGroup = store.getState().highlight.highlightedGroup;
            const selectedBlock = store.getState().similarityBlockSelect.selectedBlock;

            this.topicGuidePCGSelection
                .selectAll('rect')
                .filter(function (d) {
                    // console.log("d", d);
                    //@ts-ignore
                    return (d && d.attributes && d.attributes.className) || (d && d.class);
                })
                .style('opacity', function (d) {
                    const map: Record<string, string> = {
                        stt3: "LJS",
                        stt4: "JKT",
                        stt5: "PHR",
                        stt6: "KJD",
                    };

                    const nameMap: Record<string, string> = {
                        LJS: "이준석",
                        JKT: "장경태",
                        PHR: "박휘락",
                        KJD: "김종대",
                    };
            
                    const keywords: Record<string, string[]> = {
                        PROS: ['장경태', '김종대'],
                        CONS: ['이준석', '박휘락'],
                    };

                    //@ts-ignore
                    if(highlightedClasses?.length === 0 && highlightedGroup?.length === 0 && selectedBlock?.length === 0) {
                        return 1;
                    }

                    // 가로줄
                    //@ts-ignore
                    if(d && d.attributes && d.attributes.className && (d.attributes.className === "stt3" || d.attributes.className === "stt4" || d.attributes.className === "stt5" || d.attributes.className === "stt6")) {
                        // console.log("d", d);
                        if (highlightedClasses && highlightedClasses.length > 0) {
                            if (highlightedClasses.includes("PROS") || highlightedClasses.includes("CONS")) {
                                //@ts-ignore
                                if (keywords[highlightedClasses[0]].includes(nameMap[map[d.attributes.className]])) {    
                                    return 1;
                                }
                            }
                            //@ts-ignore
                            if (highlightedClasses.includes(map[d.attributes.className])) {
                                return 1;
                            }
                            return 0.2;
                        }
                        return 1;
                    }

                    // 화자 별 주제
                    //@ts-ignore
                    if(d && d.class) {
                        // console.log("안녕하세요", d);
                        //@ts-ignore
                        if (highlightedGroup && Array.isArray(highlightedGroup) && highlightedGroup.length > 0) {
                            // highlightedGroup에 있는 각 그룹(g1~g7)에 대해
                            //@ts-ignore
                            for (const group of highlightedGroup) {
                                // classRanges에서 해당 그룹의 문자열 배열을 가져옴
                                const validClasses = classRanges[group];
                                // d.class가 해당 그룹의 유효한 클래스 중 하나와 일치하면 1을 반환
                                //@ts-ignore
                                if (validClasses && validClasses.includes(d.class)) {
                                    if(highlightedClasses && highlightedClasses.length > 0) {
                                        //@ts-ignore
                                        if (highlightedClasses.some(className => nameMap[className] === d.class.split('-')[0])) {
                                            return 1;
                                        }
                                        return 0.2; // 선택된 화자가 아니면 흐리게 처리
                                    }
                                    return 1; // highlightedClasses가 없으면 그대로 표시
                                }
                            }
                            // 일치하는 클래스가 없으면 0.2를 반환
                            return 0.2;
                        }

                        if (highlightedClasses && highlightedClasses.length > 0) {
                            if (highlightedClasses.includes("PROS") || highlightedClasses.includes("CONS")) {
                                //@ts-ignore
                                if (keywords[highlightedClasses[0]].includes(d.class.split('-')[0])) {
                                    return 1;
                                }
                            }
                            // @ts-ignore
                            if (highlightedClasses.some(className => nameMap[className] === d.class.split('-')[0])) {
                                return 1;
                            }
                            return 0.2;
                        }
                        return 1;
                    }

                    // 바 차트
                    //@ts-ignore
                    if(d && d.type && d.type === "rect") {
                        const x = parseInt(d3.select(this).attr("x") || "-1", 10);
                        const y = parseInt(d3.select(this).attr("y") || "-1", 10);

                        if (!highlightedGroup && (!highlightedClasses || highlightedClasses.length === 0)) {
                        return 1;
                        }

                        const groupRanges: Record<string, { range: [number, number] }> = {
                        g1: { range: [80, 90] },
                        g2: { range: [260, 270] },
                        g3: { range: [405, 415] },
                        g4: { range: [585, 595] },
                        g5: { range: [780, 790] },
                        g6: { range: [960, 970] },
                        g7: { range: [1360, 1370] },
                        };

                        const pRanges: Record<string, { range1: [number, number], range2: [number, number] }> = {
                        LJS: { range1: [125, 135], range2: [145, 155] },
                        PHR: { range1: [170, 180], range2: [190, 200] },
                        JKT: { range1: [125, 135], range2: [170, 180] },
                        KJD: { range1: [145, 155], range2: [190, 200] },
                        };

                        // 🔹 selectedBlock이 존재하면서 highlightedGroup도 있는 경우
                        //@ts-ignore
                        if (highlightedGroup && Array.isArray(selectedBlock) && selectedBlock.length > 0 && selectedBlock[0].length > 1) {
                        const selected1 = selectedBlock[0][0]; // 첫 번째 선택된 인물
                        const selected2 = selectedBlock[0][1]; // 두 번째 선택된 인물

                        const groupArray = Array.isArray(highlightedGroup) ? highlightedGroup : highlightedGroup ? [highlightedGroup] : [];

                        const isInGroup = groupArray.length > 0 && groupArray.some(group => {
                            const range = groupRanges[group]?.range;
                            return range && x >= range[0] && x <= range[1];
                        });

                        if (isInGroup) {
                            // 🔹 selectedBlock[0][0]과 selectedBlock[0][1]이 같을 경우
                            if (selected1 === selected2) {
                                const participantRange = pRanges[selected1]; // 하나의 참가자 범위만 사용
                                if (participantRange &&
                                    ((y >= participantRange.range1[0] && y <= participantRange.range1[1]) ||
                                    (y >= participantRange.range2[0] && y <= participantRange.range2[1]))) {
                                    return 1; // ✅ 그룹 범위 안에 있으면서, 참가자 범위 안에도 포함
                                }
                            } else {
                                // 🔹 selectedBlock[0][0]과 selectedBlock[0][1]이 다를 경우
                                const range1 = pRanges[selected1];
                                const range2 = pRanges[selected2];

                                if ((range1 && ((y >= range1.range1[0] && y <= range1.range1[1]) || (y >= range1.range2[0] && y <= range1.range2[1])))
                                && (range2 && ((y >= range2.range1[0] && y <= range2.range1[1]) || (y >= range2.range2[0] && y <= range2.range2[1])))) {
                                    return 1; // ✅ 그룹 범위 & 두 참가자 범위 안에 포함
                                }
                            }

                            return 0.2; // 🔹 그룹 범위 안에 있지만, 참가자 범위에 포함되지 않음
                        }
                        }

                        if (highlightedGroup) {
                        //@ts-ignore
                        if (x === 33) {
                            return 0.2;
                        }
                    
                        if (Array.isArray(highlightedGroup)) {
                            //@ts-ignore
                            const isInGroup = highlightedGroup.some(group => group in groupRanges);
                    
                            if (isInGroup) {
                                //@ts-ignore
                                const isHighlighted = highlightedGroup.some(group => {
                                    const range = groupRanges[group]?.range;
                                    return range && x >= range[0] && x <= range[1];
                                });
                    
                                if (isHighlighted) {
                                    return 1; // Highlight the element
                                }
                            }
                        }
                    
                        if ((y >= 15 && y <= 20) || (y >= 38 && y <= 42) || (y >= 60 && y <= 65) || (y >= 84 && y <= 87)) {
                            return 1;
                        }
                    } else if (highlightedClasses && highlightedClasses.length > 0) {
                        if(highlightedClasses.includes("PROS") || highlightedClasses.includes("CONS")) {
                            return 1;
                        }
                        const selectedParticipants = highlightedClasses.filter(cls => cls in pRanges);
                        if (selectedParticipants.length > 0) {
                            return selectedParticipants.some(cls => {
                            const { range1, range2 } = pRanges[cls];
                            return (y >= range1[0] && y <= range1[1]) || (y >= range2[0] && y <= range2[1]);
                            }) ? 1 : 0.2;
                        }
                        }

                        return 0.2;
                    }
                    return 1;
                });
        });

        // `svg` 클릭 이벤트 추가
        this.topicGuidePCGSelection.on('click', () => {
            // 빈 영역 클릭 시 이전 rect 스타일 초기화
            if (this.previousClickedRect) {
                d3.select(this.previousClickedRect).style('stroke', 'none').style('stroke-width', '0');
                this.previousClickedRect = null; // 상태 초기화
            }
        });

        // 화자 별 주제 가로줄
        const group = this.topicGuidePCGSelection.selectAll('g').data(allRectData).enter().append('g').attr('transform', `translate(0,0) scale(-0.67, 0.67) rotate(135)`);
        group.append('style').text(styleText);
        group
            .append('rect')
            .attr('x', (d) => d.attributes.x)
            .attr('y', (d) => d.attributes.y)
            .attr('width', (d) => d.attributes.width)
            .attr('height', (d) => d.attributes.height)
            .attr('class', (d) => d.attributes.className);

        const groups = this.topicGuidePCGSelection.selectAll('g').data(rectData).enter().append('g').attr('transform', `translate(0,0) scale(-0.67, 0.67) rotate(135)`);
        groups.append('style').text(styleText);

        groups // append rect
            .append('rect')
            .attr('x', (d) => d.attributes.x)
            .attr('y', (d) => d.attributes.y)
            .attr('width', (d) => d.attributes.width)
            .attr('height', (d) => d.attributes.height)
            .attr('class', (d) => d.attributes.className)
            .attr('id', (d) => `barChart`)
            .style('stroke', 'none')
            .style('stroke-width', '0')
            .on('click', (event, d) => {
                //@ts-ignore
                event.stopPropagation(); // `svg` 클릭 이벤트 전파 막기

                // 이전에 클릭된 rect 초기화
                if (this.previousClickedRect) {
                    d3.select(this.previousClickedRect).style('stroke', 'none').style('stroke-width', '0');
                }

                // 현재 클릭된 rect 스타일 변경
                // d3.select(event.target).style('stroke', '#fc2c34').style('stroke-width', '1.5');

                // 현재 클릭된 rect를 상태 변수에 저장
                this.previousClickedRect = event.target;

                if (d.attributes.onClick !== 10 && d.attributes.x === '88.7') {
                    this.handleBarClickOne(d.attributes.onClick);
                } else if (d.attributes.onClick !== 10 && d.attributes.x === '268.4') {
                    this.handleBarClickTwo(d.attributes.onClick);
                } else if (d.attributes.onClick !== 10 && d.attributes.x === '410') {
                    this.handleBarClickThree(d.attributes.onClick);
                } else if (d.attributes.onClick !== 10 && d.attributes.x === '590') {
                    this.handleBarClickFour(d.attributes.onClick);
                } else if (d.attributes.onClick !== 10 && d.attributes.x === '782.1') {
                    this.handleBarClickFive(d.attributes.onClick);
                } else if (d.attributes.onClick !== 10 && d.attributes.x === '966.3') {
                    this.handleBarClickSix(d.attributes.onClick);
                } else if (d.attributes.onClick !== 10 && d.attributes.x === '1366.1') {
                    this.handleBarClickSeven(d.attributes.onClick);
                } else {
                    //None
                }
            });

        // 화자 별 주제 그룹(열) 네모
        const pathGroups = this.topicGuidePCGSelection
            .selectAll('.pathGroup')
            .data(pathsData)
            .enter()
            .append('g')
            .attr('class', 'pathGroup')
            .attr('transform', `translate(0,0) scale(-0.67, 0.67) rotate(135)`);

        pathGroups
            .append('path')
            .attr('class', (d) => d.className)
            .attr('d', (d) => d.d);

        // 화자 별 주제 그룹
        const pcGroups = this.topicGuidePCGSelection
            .selectAll('.pcGroup')
            .data(personPCData)
            .enter()
            .append('g')
            .attr('class', (d) => d.class)
            .attr('transform', `translate(0,0) scale(-0.67, 0.67) rotate(135)`);

        pcGroups.each(function (d) {
            const group = d3.select(this);

            // 'title' 요소 처리
            d.children.forEach((child) => {
                if (child.type === 'title') {
                    //@ts-ignore
                    group.append('title').text(child.content);
                }

                // 'rect' 요소 처리
                else if (child.type === 'rect') {
                    group
                        .append('rect')
                        //@ts-ignore
                        .attr('x', child.attributes.x)
                        //@ts-ignore
                        .attr('y', child.attributes.y-3)
                        //@ts-ignore
                        .attr('width', child.attributes.width)
                        //@ts-ignore
                        .attr('height', child.attributes.height)
                        //@ts-ignore
                        .attr('class', child.attributes.className);
                }

                // 'text' 및 'tspan' 요소 처리
                else if (child.type === 'text') {
                    const text = group
                        .append('text')
                        //@ts-ignore
                        .attr('transform', child.attributes.transform);

                    const contentArray = Array.isArray(child.content) ? child.content : [child.content];

                    contentArray.forEach((tspanData) => {
                        //@ts-ignore
                        const x = tspanData?.attributes?.x ?? '0';
                        //@ts-ignore
                        const y = tspanData?.attributes?.y ?? '0';
                        //@ts-ignore
                        const className = tspanData?.attributes?.className ?? '';
                        //@ts-ignore
                        const content = tspanData?.content ?? '';
                        text.append('tspan').attr('x', x).attr('y', y).attr('class', className).style('font-size', '10px').text(content);
                    });
                }
            });
        });

        // 화자 별 주제 맨 왼쪽의 화자 이름
        const nameGroups = this.topicGuidePCGSelection
            .selectAll('.nameGroup')
            .data(name) // 제공된 name 데이터를 바인딩합니다.
            .enter()
            .append('g')
            .attr('transform', `translate(-4,4) scale(-0.67, 0.67) rotate(135)`)
            .attr('class', (d) => `textGroup ${d.class}`); // 클래스명을 추가합니다.

        nameGroups.each(function (d) {
            const group = d3.select(this);
            const textData = d.children.find((child) => child.type === 'text');

            if (textData) {
                //@ts-ignore
                group
                    .append('title')
                    //@ts-ignore
                    .text(d.children.find((child) => child.type === 'title').content);

                group
                    .append('text')
                    //@ts-ignore
                    .attr('xml:space', textData.attributes.xmlSpace)
                    //@ts-ignore
                    .attr('class', textData.attributes.className)
                    //@ts-ignore
                    .attr('transform', textData.attributes.transform)
                    .text(textData.content);
            }
        });

        // 바 차트에 텍스트 그룹
        const textGroups = this.topicGuidePCGSelection
            .selectAll('.textGroup')
            .data(personData)
            .enter()
            .append('g')
            .attr('transform', `translate(0,-0) scale(-0.67, 0.67) rotate(135)`)
            .attr('class', 'textGroup');

        textGroups.append('style').text(styleText);
        textGroups.each(function (d) {
            const group = d3.select(this);
            const dataTransform = d.attributes.transform ? d.attributes.transform : '';
            const combinedTransform = `${dataTransform}`;

            const text = group
                .append('text')
                .attr('xml:space', 'preserve')
                //@ts-ignore
                .attr('class', (d) => d.attributes.className)
                .attr('transform', combinedTransform);

            d.content.forEach(function (content) {
                text.append('tspan')
                    .attr('x', content.attributes.x)
                    .attr('y', function () {
                        return Number(content.attributes.y) + 0; // yOffset을 사용하여 y 위치 조정
                    })
                    .attr('class', content.attributes.className)
                    .text(content.text);
            });
        });
    }
}
