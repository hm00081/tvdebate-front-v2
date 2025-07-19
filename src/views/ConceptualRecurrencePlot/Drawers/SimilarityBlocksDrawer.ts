/* eslint-disable no-unused-vars */
import _ from 'lodash';
import { hexToRgb } from '../../../common_functions/hexToRgb';
import { ParticipantDict } from '../../../common_functions/makeParticipants';
import { UtteranceObjectForDrawing } from '../interfaces';
import { SimilarityBlock } from "../interfaces";
import { setSelectedBlock } from "../../../redux/reducers/similarityBlockSelectReducer";
import highlightReducer, { setHighlightedGroup } from "../../../redux/reducers/highlightReducer";
import store from '../../../redux/store';
import * as fs from 'fs';
import * as d3 from 'd3';
import { clearHighlightedClass, setHighlightedClass } from '../../../redux/reducers/classHighlightReducer';
import { groupRanges, getGroupKeys, participantMap } from './utils/SimlarityConstant';
import { ColoringSelfSimilarities, fillColorOfSimilarityBlock } from './utils/SimilarityBlock';


export class SimilarityBlocksDrawer {
    private readonly conceptSimilarityRectGSelection!: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>;

    private _coloringSelfSimilarities: ColoringSelfSimilarities = 'none';
    private _showEngagementPoint: boolean = false;
    private _coloringRebuttal: boolean = true; // 논쟁이 나타나는 곳 색상 부여
    private _standardHighPointOfSimilarityScore!: number;
    private _selectedBlockIndices: Array<[number, number]> = [];
    private unsubscribe: () => void;

    // argumentScore
    private calculateArgumentScore(d: SimilarityBlock) {
        return (d.similarity * d.weight) / Math.sqrt(Math.abs(d.columnUtteranceIndex - d.rowUtteranceIndex));
    }
    public _clickListener: ((e: MouseEvent, d: SimilarityBlock) => void) | null = null;
    // private _mouseoverListener: null | ((mouseEvent: MouseEvent, similarityBlock: SimilarityBlock) => void) = null;
    // private _mouseoutListener: null | (() => void) = null;

    public constructor(
        private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
        private readonly similarityBlocks: SimilarityBlock[],
        private readonly similarityBlockGroup: SimilarityBlock[][],
        private readonly participantDict: ParticipantDict,
        svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
    ) {
        //
        this.conceptSimilarityRectGSelection = svgSelection.append('g');
        this.unsubscribe = store.subscribe(() => {
            //@ts-ignore
            const prevState = this._previousState || {}; 
            const newState = store.getState();
        
            if (prevState.highlight !== newState.highlight || 
                prevState.classHighLight !== newState.classHighLight ||
                prevState.matrixFilter !== newState.matrixFilter) {
                this.update();
            }
            //@ts-ignore
            this._previousState = newState;
        });
    }
    public destroy() {
        // Cleanup subscription when the object is destroyed
        this.unsubscribe();
    }

    public set standardHighPointOfSimilarityScore(standardHighPointOfSimilarityScore: number) {
        this._standardHighPointOfSimilarityScore = standardHighPointOfSimilarityScore;
    }

    // SimilarityBlocksDrawer 클래스 내부에 추가
    public isSelected(block: SimilarityBlock): boolean {
        return this._selectedBlockIndices.some((indices) => indices[0] === block.rowUtteranceIndex && indices[1] === block.columnUtteranceIndex);
    }

    public applyColorRatioSettingByTopSimilarityBlock() {
        const mostHighSimilarityBlock = _.maxBy(this.similarityBlocks, (similarityBlock) => similarityBlock.weight * similarityBlock.similarity)!;
        this._standardHighPointOfSimilarityScore = mostHighSimilarityBlock.weight * mostHighSimilarityBlock.similarity;
    }

    public setClickListener(listener: (e: MouseEvent, d: SimilarityBlock) => void) {
        this._clickListener = listener;
    }

    public update() {
        const { highlightedGroup } = store.getState().highlight;
        const { highlightedClasses } = store.getState().classHighLight;
        const { selectedBlock } = store.getState().similarityBlockSelect;
        const { filter } = store.getState().matrixFilter;
        const [minOpacity, maxOpacity] = [filter[0]/100, filter[1]/100];

        this.conceptSimilarityRectGSelection.selectAll("rect").remove();
        
        const similarityRectGSelectionDataBound = this.conceptSimilarityRectGSelection
            .selectAll<SVGRectElement, SimilarityBlock>('rect')
            .data(this.similarityBlocks, d => `${d.rowUtteranceIndex}-${d.columnUtteranceIndex}`);

        const enter = similarityRectGSelectionDataBound.enter().append('rect');

        // 피라미드 내부 작은 사각형들
        similarityRectGSelectionDataBound
            .merge(enter) // Merge enter and update selections
            .attr('x', (d) => d.beginningPointOfX)
            .attr('y', (d) => d.beginningPointOfY)
            .attr('width', (d) => d.width)
            .attr('height', (d) => d.height)
            .attr("colName", (d) => d.colUtteranceName)
            .attr("rowName", (d) => d.rowUtteranceName)
            .attr('colIdx', (d) => d.columnUtteranceIndex)
            .attr('rowIdx', (d) => d.rowUtteranceIndex)
            // .attr("other", (d) => d.other)
            // .attr("refutation", (d) => d.refutation)
            // .attr("engagementPoint", (d) => d.engagementPoint)
            // .attr("visible", (d) => d.visible)
            .style('fill', (d) => {
                const isWithinRange = Math.abs(d.beginningPointOfX - d.beginningPointOfY) < 200;
                return isWithinRange
                    ? fillColorOfSimilarityBlock(
                          d,
                          this.utteranceObjectsForDrawing,
                          this.similarityBlockGroup,
                          this.participantDict,
                          this._standardHighPointOfSimilarityScore,
                          this._coloringSelfSimilarities,
                          this._coloringRebuttal
                      )
                    : 'none';
            })
            .style('cursor', (d) => {
                const isWithinRange = Math.abs(d.beginningPointOfX - d.beginningPointOfY) < 200;
                return isWithinRange ? 'pointer' : 'default';
            })
            .style("opacity", function () {
                const rowIdx = parseInt(d3.select(this).attr("rowIdx") || "-1", 10);
                const colIdx = parseInt(d3.select(this).attr("colIdx") || "-1", 10);
                const rowName = d3.select(this).attr("rowName");
                const colName = d3.select(this).attr("colName");

                const participants: Record<string, string> = {
                    LJS: "이준석",
                    PHR: "박휘락",
                    JKT: "장경태",
                    KJD: "김종대",
                };
            
                
                if (selectedBlock && selectedBlock.length > 1 && Array.isArray(selectedBlock[1])) {
                    //@ts-ignore
                    if(selectedBlock[1].length === 0) {
                        const highlightedNames = highlightedClasses.map(cls => participants[cls]).filter(Boolean);
                        
                        if (highlightedNames.includes(rowName) && highlightedNames.includes(colName)) {
                            //@ts-ignore
                            if(groupRanges[highlightedGroup[0]].row[0] <= rowIdx && groupRanges[highlightedGroup[0]].row[1] >= rowIdx && groupRanges[highlightedGroup[1]].col[0] <= colIdx && groupRanges[highlightedGroup[1]].col[1] >= colIdx) {
                                return maxOpacity;
                            } else {
                                return 0.05;
                            }
                        } else {
                            // return minOpacity;
                            return 0.05;
                        }
                    }

                    // 논쟁 마름모 선택 시, 선택된 마름모만 강조하고자 하면 이 코드 사용
                    if (highlightedClasses.length === 1) {
                        if (selectedBlock[1][0] === rowIdx || selectedBlock[1][1] === colIdx) {
                            return 1;
                        }
                    }
                    if (highlightedClasses.length === 2) {
                        if (selectedBlock[1][0] === rowIdx && selectedBlock[1][1] === colIdx) {
                            return 1;
                        }
                    }

                    // OX 선택과 논쟁 마름모 선택 시 결과가 같다면 아래 코드 사용
                    // if (selectedBlock[1][0] === rowIdx || selectedBlock[1][1] === colIdx) {
                    //     return 1;
                    // }
                    return 0.1;
                }

                if (highlightedClasses && highlightedClasses.length > 0) {
                    // 특정 값이 포함된 경우 return 0.3
                    if (highlightedClasses.includes("PROS") || highlightedClasses.includes("CONS")) {
                        // return minOpacity;
                        return 0.1;
                    }
                
                    if (highlightedClasses.length === 1) {
                        // 기존 로직 그대로 유지
                        const isHighlighted = highlightedClasses.some(cls => {
                            const participantName = participants[cls];
                            return participantName && (rowName === participantName || colName === participantName);
                        });
                        // return isHighlighted ? maxOpacity : minOpacity;
                        return isHighlighted ? maxOpacity : 0.05;
                    } else if (highlightedClasses.length >= 2 && highlightedClasses.length <= 4) {
                        // rowName과 colName이 모두 highlightedClasses에 있어야 함
                        const highlightedNames = highlightedClasses.map(cls => participants[cls]).filter(Boolean);
                        
                        if (highlightedNames.includes(rowName) && highlightedNames.includes(colName)) {
                            return maxOpacity;
                        } else {
                            // return minOpacity;
                            return 0.05;
                        }
                    }
                }

                //@ts-ignore
                if (!highlightedGroup || highlightedGroup.length === 0) {
                    return maxOpacity;
                }

                //@ts-ignore
                if (Array.isArray(highlightedGroup)) {
                    //@ts-ignore
                    const isHighlighted = highlightedGroup.some(group => {
                        if (group in groupRanges) {
                            const { row, col } = groupRanges[group];
                            return rowIdx >= row[0] && rowIdx <= row[1] && colIdx >= col[0] && colIdx <= col[1];
                        }
                        return false;
                    });
                
                    if (isHighlighted) {
                        return 1; // Highlight the element
                    }
                }
                
                // 🔹 기존 단일 값 처리 (배열이 아닐 때)
                if (highlightedGroup && highlightedGroup in groupRanges) {
                    const { row, col } = groupRanges[highlightedGroup];
                    if (rowIdx >= row[0] && rowIdx <= row[1] && colIdx >= col[0] && colIdx <= col[1]) {
                        return 1;
                    }
                }
                return 0.2; // Dim the element
              })
            .style('stroke-width', 1)
            .style('stroke', (d) => {
                const isSelected =
                    selectedBlock &&
                    Array.isArray(selectedBlock[1]) &&
                    selectedBlock[1][0] === d.rowUtteranceIndex &&
                    selectedBlock[1][1] === d.columnUtteranceIndex;
            
                if (isSelected) {
                    return 'red'; // 선택된 마름모에 붉은 테두리
                }
            
                return this._showEngagementPoint && d.engagementPoint ? 'rgb(97, 64, 65)' : null;
            })
            //@ts-ignore
            // .on('click', (event: MouseEvent, d: SimilarityBlock) => {
            //     // 유효성 검사
            //     const rowName = d.rowUtteranceName;
            //     const colName = d.colUtteranceName;
            
            //     // 🔐 조건 확인 (예시)
            //     const disallowedPairs = [
            //         ["이준석", "박휘락"], ["박휘락", "이준석"],
            //         ["장경태", "김종대"], ["김종대", "장경태"],
            //     ];
            
            //     if (rowName === colName) {
            //         // console.log("같은 참여자입니다.");
            //         return;
            //     }
            //     if (disallowedPairs.some(([a, b]) => a === rowName && b === colName)) {
            //         // console.log("같은 의견을 가진 조합입니다.");
            //         return;
            //     }
            
            //     const allowedPairs = [
            //         ["이준석", "김종대"], ["이준석", "장경태"],
            //         ["박휘락", "김종대"], ["박휘락", "장경태"],
            //     ];
            
            //     if (!allowedPairs.some(([a, b]) => a === rowName && b === colName)) {
            //         // console.log("진행자가 포함된 조합입니다.");
            //         return;
            //     }
            
            //     // 선택 처리
            //     this.setSingleBlockIndices(d.rowUtteranceIndex, d.columnUtteranceIndex);
            //     this.dispatchSelectionHighlight(d);
            //     this.updateSelectedBlock();
            //     event.stopPropagation();
            
            //     if (this._clickListener) {
            //         this._clickListener(event, d);
            //     }
            // })
            
            .append('title')
            .text((d, i) => {
                const argumentScore = this.calculateArgumentScore(d); // argumentScore 계산
                //console.log(d);
                return `findArgument: ${d.refutation ? d.refutation : 'none'},
                Leading Speaker Index: ${d.columnUtteranceIndex},
                Leading Speaker Name: ${d.colUtteranceName}
                Trailing Speaker Index: ${d.rowUtteranceIndex},
                Trailing Speaker Name: ${d.rowUtteranceName},
                argumentScore: ${argumentScore}
                `;
            });

        similarityRectGSelectionDataBound.exit().remove(); // cleanup
    }

    public get allOpacityValues(): number[] {
        return this.allOpacityValues;
    }

    public set coloringSelfSimilarities(coloringSelfSimilarities: ColoringSelfSimilarities) {
        this._coloringSelfSimilarities = coloringSelfSimilarities;
    }

    public set showEngagementPoint(showEngagementPoint: boolean) {
        this._showEngagementPoint = showEngagementPoint;
    }

    public set coloringRebuttal(coloringRebuttal: boolean) {
        this._coloringRebuttal = coloringRebuttal;
    }

    public set clickListener(clickListener: (e: MouseEvent, d: SimilarityBlock) => void) {
        console.log("clickListener")
        this._clickListener = clickListener;
    }

    setSingleBlockIndices(rowIndex: number, colIndex: number) {
        this._selectedBlockIndices = [[rowIndex, colIndex]];
        // this.updateSelectedBlock();
    }

    setMultipleBlockIndices(indices: [number, number][]) {
        this._selectedBlockIndices = [...this._selectedBlockIndices, ...indices];
    }

    clearSelectedBlocks() {
        this._selectedBlockIndices = [];
        this.updateSelectedBlock();
    }

    private dispatchSelectionHighlight(d: SimilarityBlock) {
        const groupKeys = getGroupKeys(d.rowUtteranceIndex, d.columnUtteranceIndex);
        const p1 = participantMap[d.rowUtteranceName];
        const p2 = participantMap[d.colUtteranceName];
      
        store.dispatch(setSelectedBlock([[p1, p2], [d.rowUtteranceIndex, d.columnUtteranceIndex]]));
        store.dispatch(setHighlightedGroup(groupKeys.length === 1 ? [groupKeys[0], groupKeys[0]] : [groupKeys[0], groupKeys[1]]));
        store.dispatch(clearHighlightedClass());
        store.dispatch(setHighlightedClass({ className: p1 }));
        store.dispatch(setHighlightedClass({ className: p2 }));
      }

    
      
    // no error
    updateSelectedBlock() {
        const selectedMap = new Set(this._selectedBlockIndices.map(([r, c]) => `${r}-${c}`));

        const groupKeysCache: Record<string, string[]> = {};

        this.conceptSimilarityRectGSelection
          .selectAll<SVGRectElement, SimilarityBlock>('rect')
          .each((d) => {
            const key = `${d.rowUtteranceIndex}-${d.columnUtteranceIndex}`;
            if (!selectedMap.has(key)) return;
      
            // group ID Caching
            const groupKeys = getGroupKeys(d.rowUtteranceIndex, d.columnUtteranceIndex);
            groupKeysCache[key] = groupKeys;
      
            const p1 = participantMap[d.rowUtteranceName];
            const p2 = participantMap[d.colUtteranceName];
      
            store.dispatch(setSelectedBlock([[p1, p2], [d.rowUtteranceIndex, d.columnUtteranceIndex]]));
            store.dispatch(setHighlightedGroup(groupKeys.length === 1 ? [groupKeys[0], groupKeys[0]] : [groupKeys[0], groupKeys[1]]));
            store.dispatch(clearHighlightedClass());
            store.dispatch(setHighlightedClass({ className: p1 }));
            store.dispatch(setHighlightedClass({ className: p2 }));
          })
          .style("stroke", (d) => selectedMap.has(`${d.rowUtteranceIndex}-${d.columnUtteranceIndex}`) ? "#fc2c34" : null)
          .style("fill", (d) =>
            selectedMap.has(`${d.rowUtteranceIndex}-${d.columnUtteranceIndex}`)
              ? "#578ae3"
              : fillColorOfSimilarityBlock(
                d,
                this.utteranceObjectsForDrawing,
                this.similarityBlockGroup,
                this.participantDict,
                this._standardHighPointOfSimilarityScore,
                this._coloringSelfSimilarities,
                this._coloringRebuttal
            )
          )
          .style("stroke-width", (d) => selectedMap.has(`${d.rowUtteranceIndex}-${d.columnUtteranceIndex}`) ? 1.45 : 0);
      }
      

    // public set mouseoverListener(mouseoverListener: (mouseEvent: MouseEvent, similarityBlock: SimilarityBlock) => void) {
    //     this._mouseoverListener = mouseoverListener;
    // }

    // public set mouseoutLisener(mouseoutListener: () => void) {
    //     this._mouseoutListener = mouseoutListener;
    // }
}