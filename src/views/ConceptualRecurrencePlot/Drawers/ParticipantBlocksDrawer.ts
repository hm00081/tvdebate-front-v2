/* eslint-disable no-unused-vars */
import { ParticipantDict } from "./../../../common_functions/makeParticipants";
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
import { Participant } from "../../../common_functions/makeParticipants";
import _ from "lodash";
import { KeytermObject } from "../../../interfaces/DebateDataInterface";
import { findTopValueIndexes } from "../../../common_functions/findTopValueIndexes";
import store from "../../../redux/store";
import * as d3 from "d3";

export class ParticipantBlocksDrawer {
  private readonly participantRectGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private selectedParticipants: Participant[] = [];
  private _clickListener:
    | null
    | ((
        mouseEvent: MouseEvent,
        utteranceObjectForDrawing: UtteranceObjectForDrawing
      ) => void) = null;

  private _selectedParticipantClickListener:
    | null
    | ((selectedParticipant: Participant) => void) = null;
  private _mouseoverListener:
    | null
    | ((
        mouseEvent: MouseEvent,
        utteranceObjectForDrawing: UtteranceObjectForDrawing
      ) => void) = null;
  private _mouseoutListener: null | (() => void) = null;
  // 현재 기능하진 않음.
  public sortByFindDis() {
    this.utteranceObjectsForDrawing.sort((a, b) => {
      return a.findDisagreeScale - b.findDisagreeScale;
    });
    console.log("After sorting: ", this.utteranceObjectsForDrawing);
    this.update();
  }

  public sortByIndex() {
    this.utteranceObjectsForDrawing.sort((a, b) => {
      return a.beginningPointOfXY - b.beginningPointOfXY;
    });
    //console.log("After sorting: ", this.utteranceObjectsForDrawing);
    this.update();
  }

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    private readonly participantDict: ParticipantDict,
    private readonly conceptSimilarityBlocks: SimilarityBlock[],
    private readonly conceptMatrixTransposed: number[][],
    private readonly keytermObjects: KeytermObject[],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    this.participantRectGSlection = svgSelection.append("g");
  }

  public update() {
    //@ts-ignore
    const participantRectGSlectionDataBound = this.participantRectGSlection
      .selectAll<SVGRectElement, UtteranceObjectForDrawing>("rect")
      //@ts-ignore
      .data(this.utteranceObjectsForDrawing, (d) => d)
      .join(
        (enter) => {
          const newEnter = enter.append("rect");
          this.setAttributes(
            newEnter,
            this.participantDict,
            this.conceptMatrixTransposed,
            this.keytermObjects
          );
          return newEnter;
        },
        (update) => {
          this.setAttributes(
            update,
            this.participantDict,
            this.conceptMatrixTransposed,
            this.keytermObjects
          );
          return update;
        },
        (exit) => exit.remove()
      );
    // console.log('ParticipantBlockDrawer update');
    this.setAttributes(
      participantRectGSlectionDataBound,
      this.participantDict,
      this.conceptMatrixTransposed,
      this.keytermObjects
    );
  }

  private setAttributes(
    this: ParticipantBlocksDrawer,
    selection: d3.Selection<
      SVGRectElement,
      UtteranceObjectForDrawing,
      SVGGElement,
      unknown
    >,
    participantDict: { [participant: string]: Participant },
    conceptMatrixTransposed: number[][],
    keytermObjects: KeytermObject[]
  ) {
      store.subscribe(() => {
        const storeState = store.getState();
        const highlightedClasses = storeState.classHighLight.highlightedClasses;
        const selectedBlock = storeState.similarityBlockSelect.selectedBlock;
        const highlightedGroup = storeState.highlight.highlightedGroup;

        // D3 opacity 다시 설정
        d3.selectAll("g > rect")
          .filter(function () {
            return d3.select(this).attr("insistence") !== null;
          })
          .style("opacity", function (d) {
            const pName = d3.select(this).attr("name");
            const x = parseInt(d3.select(this).attr("x") || "0", 10);
    
            const participants: Record<string, string> = {
              LJS: '이준석',
              PHR: '박휘락',
              JKT: '장경태',
              KJD: '김종대',
            };
    
            const keywords: Record<string, string[]> = {
              PROS: ["장경태", "김종대"],
              CONS: ["이준석", "박휘락"],
            };

            const groupRanges: Record<string, [number, number] > = {
              g1: [0, 108],
              g2: [84, 206],
              g3: [132, 280],
              g4: [229, 366],
              g5: [324, 470],
              g6: [427, 549],
              g7: [604, 758],
          };

            const selectedParticipants = highlightedClasses.filter(cls => cls in participants);
            const selectedGroups = highlightedClasses.filter(cls => cls in keywords);

            if (selectedBlock && selectedBlock.length > 0) {
              //@ts-ignore
              if(selectedBlock[1].length === 0) {
                if (selectedParticipants.length > 0) {
                  const validNames = selectedParticipants.map(cls => participants[cls]);
                  if (validNames.includes(pName)) {
                    //@ts-ignore
                    if(x >= groupRanges[highlightedGroup[0]][0] && x <= groupRanges[highlightedGroup[0]][1]){
                      return 1;
                    } else {
                      return 0.2;
                    }
                  }
                }
                return 0.2;
              }
              //@ts-ignore
              if (Array.isArray(selectedBlock[1]) && selectedBlock[1].includes(d.index)) {
                return 1;
              } else {
                return 0.1;
              }
            }
    
            if (!highlightedClasses || highlightedClasses.length === 0) {
              return 1;
            }
    
            if (selectedParticipants.length > 0) {
              const validNames = selectedParticipants.map(cls => participants[cls]);
              if (validNames.includes(pName)) {
                return 1;
              }
            }
    
            if (selectedGroups.length > 0) {
              const validNames = selectedGroups.flatMap(group => keywords[group]);
              if (validNames.includes(pName)) {
                return 1;
              }
            }
    
            return 0.2;
          });
    });
  
    selection // utterance_objects 데이터 적용
      // .transition()
      // .duration(750)
      .attr("x", (d, i) => {
        //console.log(`Rect at index ${i}, width: ${d.width}`);
        return d.beginningPointOfXY;
      })
      .attr("y", (d) => d.beginningPointOfXY)
      .attr("width", (d) => d.width) // 노드 두께
      .attr("height", (d) => d.width) // 노드 높이
      .attr("insistence", (d) => d.insistence)
      .attr("name", (d) => d.name)
      //@ts-ignore
      .attr("index", (d) => d.index)
      .style("fill", (d) => participantDict[d.name].color)
      .style("opacity", function (d) {
        const highlightedGroup = store.getState().highlight.highlightedGroup;
        const selectedBlock = store.getState().similarityBlockSelect.selectedBlock;
        const highlightedClasses = store.getState().classHighLight.highlightedClasses;
    
        const participants: Record<string, string> = {
            LJS: "이준석",
            PHR: "박휘락",
            JKT: "장경태",
            KJD: "김종대",
        };
    
        const keywords: Record<string, string[]> = {
            PROS: ["장경태", "김종대"],
            CONS: ["이준석", "박휘락"],
        };
        
        const groupRanges: Record<string, { range: [number, number] }> = {
          g1: { range: [0, 108] },
          g2: { range: [84, 206] },
          g3: { range: [132, 280] },
          g4: { range: [229, 366] },
          g5: { range: [324, 470] },
          g6: { range: [427, 549] },
          g7: { range: [604, 758] },
      };
    
        const rowName = d3.select(this).attr("rowName");
        const colName = d3.select(this).attr("colName");
        const pName = d3.select(this).attr("name");
        const x = parseInt(d3.select(this).attr("x") || "0", 10);
    
        // ✅ 1. 아무것도 선택되지 않았다면 기본값 (전체 보이기)
        if ((!selectedBlock || selectedBlock.length === 0) &&
            //@ts-ignore
            (!highlightedGroup || highlightedGroup.length === 0) &&
            (!highlightedClasses || highlightedClasses.length === 0)) {
            return 1;
        }
    
        // ✅ 2. 특정 블록이 선택된 경우 → 해당 블록만 보이고 나머지는 희미하게
        if (selectedBlock && selectedBlock.length > 0) {
            //@ts-ignore
            if (Array.isArray(selectedBlock[1]) && selectedBlock[1].includes(d.index)) {
                return 1;
            } else {
                return 0.1;
            }
        }
    
        // ✅ 3. 특정 참여자가 강조된 경우 → 해당하는 사람만 보이도록
        if (highlightedClasses && highlightedClasses.length > 0) {
            // (1) 참여자 코드가 포함된 경우
            const selectedParticipants = highlightedClasses.filter(cls => cls in participants);
            if (selectedParticipants.length > 0) {
                const validNames = selectedParticipants.map(cls => participants[cls]);
                if (validNames.includes(pName)) {
                    return 1;
                }
            }
    
            // (2) PROS / CONS 키워드가 포함된 경우
            const selectedGroups = highlightedClasses.filter(cls => cls in keywords);
            if (selectedGroups.length > 0) {
                const validNames = selectedGroups.flatMap(group => keywords[group]);
                if (validNames.includes(pName)) {
                    return 0.3;
                }
            }
        }
    
        // ✅ 4. 특정 그룹이 강조된 경우 → 범위 내에 있는 블록만 강조
        if (highlightedGroup && Array.isArray(highlightedGroup)) {
          //@ts-ignore
          const isHighlighted = highlightedGroup.some(group => {
              if (group in groupRanges) {
                  const { range } = groupRanges[group];
                  return x >= range[0] && x <= range[1];
              }
              return false;
          });
  
          if (isHighlighted) {
              return 1;
          } else {
              return 0.2;
          }
        }
    
        // ✅ 5. 기본값 → 나머지는 희미하게 처리
        return 0.2;
    });
    

    selection
      .selectAll("title")
      .data((d) => [d])
      .join("title")
      .text((d, i) => {
        const conceptVectorOfUtterance = conceptMatrixTransposed[i];
        // console.log(conceptVectorOfUtterance);
        const topValueIndexes = findTopValueIndexes(
          conceptVectorOfUtterance,
          3 // 최대 보여줄 키워드 수.
        );

        const compoundTermCountDict =
          d.sentenceObjects[i].compoundTermCountDict;
        // compoundTermCountDict;
        const sortedTerms = Object.entries(compoundTermCountDict)
          .sort((a, b) => b[1] - a[1]) // 내림차순 정렬
          .slice(0, 3) // 상위 3개 항목만 추출
          .map(([term, count]) => term)
          .join(", ");
        //console.log(sortedTerms);
        return `mainTerms:${sortedTerms}\n ${d.name}: ${d.utterance}
            `;
      })
      .on("mouseover", (e, u) => {
        const mouseEvent = e as unknown as MouseEvent;
        mouseEvent.stopPropagation();
        const utteranceObjectForDrawing =
          u as unknown as UtteranceObjectForDrawing;

        // TODO adjust transcript-view
        if (this._mouseoverListener) {
          this._mouseoverListener(mouseEvent, utteranceObjectForDrawing);
        }
      })
      .on("mouseout", (e, u) => {
        if (this._mouseoutListener) {
          this._mouseoutListener();
        }
      });
  }

  public click(
    e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>,
    u: UtteranceObjectForDrawing
  ) {
    const mouseEvent = e;
    mouseEvent.stopPropagation();
    const selectedParticipant = u;

    this.selectedParticipants.push(
      this.participantDict[selectedParticipant.name]
    );

    //console.log("this.selectedParticipants", this.selectedParticipants);

    if (this.selectedParticipants.length === 1) {
      // remain same participant's similairity_block. remove other participant's similarity_block
      _.forEach(this.conceptSimilarityBlocks, (similarityBlock) => {
        const rowParticipantName =
          this.utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex]
            .name;
        const colParticipantName =
          this.utteranceObjectsForDrawing[similarityBlock.columnUtteranceIndex]
            .name;
        if (
          selectedParticipant.name === rowParticipantName ||
          selectedParticipant.name === colParticipantName
        ) {
          similarityBlock.visible = true;
        } else {
          similarityBlock.visible = false;
        }
      });
    } else if (this.selectedParticipants.length === 2) {
      //
      const participant1 = this.selectedParticipants[0];
      const participant2 = this.selectedParticipants[1];

      _.forEach(this.conceptSimilarityBlocks, (similarityBlock) => {
        const rowParticipantName =
          this.utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex]
            .name;
        const colParticipantName =
          this.utteranceObjectsForDrawing[similarityBlock.columnUtteranceIndex]
            .name;
        if (
          (rowParticipantName === participant1.name &&
            colParticipantName === participant2.name) ||
          (rowParticipantName === participant2.name &&
            colParticipantName === participant1.name) ||
          (rowParticipantName === participant1.name &&
            colParticipantName === participant1.name) ||
          (rowParticipantName === participant2.name &&
            colParticipantName === participant2.name)
        ) {
          similarityBlock.visible = true;
        } else {
          similarityBlock.visible = false;
        }
      });
    }
  }

  public emptySelectedParticipants() {
    this.selectedParticipants = [];
  }

  public set clickListener(
    clickListener: (e: MouseEvent, d: UtteranceObjectForDrawing) => void
  ) {
    this._clickListener = clickListener;
  }

  public set mouseoverListener(
    mouseoverListener: (
      mouseEvent: MouseEvent,
      utteranceObjectForDrawing: UtteranceObjectForDrawing
    ) => void
  ) {
    this._mouseoverListener = mouseoverListener;
  }

  public set mouseoutLisener(mouseoutListener: () => void) {
    this._mouseoutListener = mouseoutListener;
  }
}
