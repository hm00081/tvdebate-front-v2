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
                        return true;
                    }
                    break;
                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 0 &&
                        block.rowUtteranceIndex <= 18 &&
                        block.columnUtteranceIndex >= 0 &&
                        block.columnUtteranceIndex <= 18;
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 0 &&
                        block.rowUtteranceIndex <= 18 &&
                        block.columnUtteranceIndex >= 0 &&
                        block.columnUtteranceIndex <= 18;
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 0 &&
                        block.rowUtteranceIndex <= 18 &&
                        block.columnUtteranceIndex >= 0 &&
                        block.columnUtteranceIndex <= 18;
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

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 15 &&
                        block.rowUtteranceIndex <= 37 &&
                        block.columnUtteranceIndex >= 15 &&
                        block.columnUtteranceIndex <= 37;
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
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 24 &&
                        block.rowUtteranceIndex <= 58 &&
                        block.columnUtteranceIndex >= 24 &&
                        block.columnUtteranceIndex <= 58;
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 24 &&
                        block.rowUtteranceIndex <= 58 &&
                        block.columnUtteranceIndex >= 24 &&
                        block.columnUtteranceIndex <= 58;
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 24 &&
                        block.rowUtteranceIndex <= 58 &&
                        block.columnUtteranceIndex >= 24 &&
                        block.columnUtteranceIndex <= 58;
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
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 43 &&
                        block.rowUtteranceIndex <= 79 &&
                        block.columnUtteranceIndex >= 43 &&
                        block.columnUtteranceIndex <= 79;
                    break;
                case 3: // 박휘락, 김종대
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 43 &&
                        block.rowUtteranceIndex <= 79 &&
                        block.columnUtteranceIndex >= 43 &&
                        block.columnUtteranceIndex <= 79;
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

            let condition = false;
            switch (barIndex) {
                case 0: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 73 &&
                        block.rowUtteranceIndex <= 106 &&
                        block.columnUtteranceIndex >= 73 &&
                        block.columnUtteranceIndex <= 106;
                    break;

                case 1: // 이준석, 장경태
                    condition =
                        ((block.colUtteranceName === '이준석' && block.rowUtteranceName === '김종대') || (block.colUtteranceName === '김종대' && block.rowUtteranceName === '이준석')) &&
                        block.rowUtteranceIndex >= 73 &&
                        block.rowUtteranceIndex <= 106 &&
                        block.columnUtteranceIndex >= 73 &&
                        block.columnUtteranceIndex <= 106;
                    if ((block.columnUtteranceIndex === 80 && block.rowUtteranceIndex === 85) || (block.columnUtteranceIndex === 84 && block.rowUtteranceIndex === 85)) {
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
                    break;
                case 2: // 박휘락, 장경태
                    condition =
                        ((block.colUtteranceName === '박휘락' && block.rowUtteranceName === '장경태') || (block.colUtteranceName === '장경태' && block.rowUtteranceName === '박휘락')) &&
                        block.rowUtteranceIndex >= 146 &&
                        block.rowUtteranceIndex <= 183 &&
                        block.columnUtteranceIndex >= 146 &&
                        block.columnUtteranceIndex <= 183;
                    if ((block.columnUtteranceIndex === 172 && block.rowUtteranceIndex === 173) || (block.columnUtteranceIndex === 178 && block.rowUtteranceIndex === 180)) {
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
                        console.log("d", d);
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

                    //@ts-ignore
                    if(d && d.class) {
                        console.log("안녕하세요", d);
                        if (highlightedClasses && highlightedClasses.length > 0) {
                            if (highlightedClasses.includes("PROS") || highlightedClasses.includes("CONS")) {
                                //@ts-ignore
                                if (keywords[highlightedClasses[0]].includes(d.class.split('-')[0])) {
                                    return 1;
                                }
                            }

                            //@ts-ignore
                            console.log("d.class.split('-')[0]", d.class.split('-')[0]);
                            console.log("highlightedClasses", highlightedClasses);
                            // @ts-ignore
                            if (highlightedClasses.some(className => nameMap[className] === d.class.split('-')[0])) {
                                return 1;
                            }
                            return 0.2;
                        }
                        return 1;
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
                d3.select(event.target).style('stroke', '#fc2c34').style('stroke-width', '1.5');

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
                        .attr('y', child.attributes.y)
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
                        text.append('tspan').attr('x', x).attr('y', y).attr('class', className).text(content);
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
