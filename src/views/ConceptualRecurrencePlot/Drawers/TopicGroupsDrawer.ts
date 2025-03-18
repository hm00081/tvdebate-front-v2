/* eslint-disable no-unused-vars */
import { TermType } from "../DataImporter";
import { DataStructureSet } from "../DataStructureMaker/DataStructureManager";
import { DebateDataSet } from "../../../interfaces/DebateDataInterface";
import { SimilarityBlock } from "../interfaces";

import store from "../../../redux/store";

import * as d3 from "d3";
import _ from "lodash";
import {
  extractFrequencyTermsFromEG,
  extractTermsFromEngagementGroup,
} from "../DataStructureMaker/extractTermsFromEngagementGroup";
import { KeytermObject } from "../../../interfaces/DebateDataInterface";

export class TopicGroupsDrawer {
  private readonly topicGuideRectGSelection: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private readonly topicGuideTextGSelection: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private _topicGroups: SimilarityBlock[][][] = [];
  private _topicGroupTitles: string[] = [];
  private _showTopicGroupTitle: boolean = true;
  private _showTopicGroup: boolean = true;
  private _guideColor: string = "green";

  public onTitleClicked:
    | null
    | ((
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => void) = null;

  public constructor(
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>,
    private readonly debateDataSet: DebateDataSet,
    private readonly dataStructureSet: DataStructureSet,
    private readonly termType: TermType
  ) {
    this.topicGuideRectGSelection = svgSelection.append("g");
    this.topicGuideTextGSelection = svgSelection.append("g");

    store.subscribe(() => {
      const { highlightedGroup } = store.getState().highlight; // Redux 상태에서 highlightedGroup 추출
      const { highlightedClasses } = store.getState().classHighLight;
      const { selectedBlock } = store.getState().similarityBlockSelect;
      
      this.applyHighlightEffect(highlightedClasses, highlightedGroup, selectedBlock);
    
      // console.log('highlightedGroup', highlightedGroup);
      // console.log('highlightedClasses', highlightedClasses);
      // console.log('selectedBlock', selectedBlock);
    });
    
  }

  public set topicGroups(topicGroups: SimilarityBlock[][][]) {
    this._topicGroups = topicGroups;
  }

  public get topicGroups() {
    return this._topicGroups;
  }
  public set topicGroupTitles(topicGroupTitles: string[]) {
    this._topicGroupTitles = topicGroupTitles;
  }
  public set visible(showTopicGroup: boolean) {
    this._showTopicGroup = showTopicGroup;
  }
  public set showTopicGroupTitle(showTopicGroupTitle: boolean) {
    this._showTopicGroupTitle = showTopicGroupTitle;
  }
  public set color(guideColor: string) {
    this._guideColor = guideColor;
  }

  // TopicGroupsDrawer 클래스 내
  public getTopicGroupRectangles() {
    return this._topicGroups.map((group) => {
      const mostLeftTopBlock = group[0][0];
      const lastHorizontalLine = group[group.length - 1];
      const mostRightBottomBlock =
        lastHorizontalLine[lastHorizontalLine.length - 1];
      return {
        x: mostLeftTopBlock.beginningPointOfX,
        y: mostLeftTopBlock.beginningPointOfY,
        width:
          mostRightBottomBlock.beginningPointOfX +
          mostRightBottomBlock.width -
          mostLeftTopBlock.beginningPointOfX,
        height:
          mostRightBottomBlock.beginningPointOfY +
          mostRightBottomBlock.height -
          mostLeftTopBlock.beginningPointOfY,
      };
    });
  }

  private applyHighlightEffect(highlightedClasses: string[] | null, highlightedGroup: string | null, selectedBlock: never[] | null) {
    // const groupRanges: Record<string, { row: [number, number]; col: [number, number] }> = {
    //   g1: { row: [0, 18], col: [0, 19] },
    //   g2: { row: [14, 37], col: [15, 38] },
    //   g3: { row: [23, 58], col: [24, 59] },
    //   g4: { row: [42, 79], col: [43, 80] },
    //   g5: { row: [72, 106], col: [73, 107] },
    //   g6: { row: [93, 126], col: [94, 127] },
    //   g7: { row: [145, 183], col: [146, 184] },
    // };

    /* ## 그룹 선택 ## */
    this.topicGuideRectGSelection
    //@ts-ignore
      .selectAll<SVGRectElement>("rect")
      .each(function () {
        const idx = d3.select(this).attr("idx");

        d3.select(this).style(
          "opacity",
          highlightedGroup && !highlightedGroup.includes(`g${idx}`) ? 0.2 : 1
        );

        // ✅ 바 차트 다중 선택 반영
        //@ts-ignore
        d3.selectAll<SVGRectElement>("g > rect")
          .filter(function () {
            return d3.select(this).attr("class") !== null;
          })
          .style("opacity", function () {
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
                  const isInGroup = highlightedGroup.some(group => group in groupRanges);
          
                  if (isInGroup) {
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
          });
      });

      const participantRange: Record<string, string[]> = {
        LJS: ["이준석-1", "이준석-2", "이준석-3", "이준석-4", "이준석-5", "이준석-6", "이준석-7", "이준석-8", "이준석-9"],
        PHR: ["박휘락-1", "박휘락-2", "박휘락-3", "박휘락-4", "박휘락-5", "박휘락-6", "박휘락-7"],
        JKT: ["장경태-1", "장경태-2", "장경태-3", "장경태-4", "장경태-5", "장경태-6", "장경태-7", "장경태-8"],
        KJD: ["김종대-1", "김종대-2", "김종대-3", "김종대-4", "김종대-5", "김종대-6", "김종대-7", "김종대-8", "김종대-9"]
      };

      const classRanges: Record<string, string[]> = {
        g1: ["이준석-1", "이준석-2", "이준석-3", "장경태-1", "장경태-2", "박휘락-1", "박휘락-2", "김종대-1", "김종대-2"],
        g2: ["이준석-2", "이준석-3", "이준석-4", "장경태-2", "장경태-3", "박휘락-2", "박휘락-3", "김종대-2", "김종대-3", "김종대-4"],
        g3: ["이준석-4", "이준석-5", "장경태-3", "장경태-4", "박휘락-3", "김종대-3", "김종대-4"],
        g4: ["이준석-5", "이준석-6", "장경태-4", "박휘락-4", "김종대-5", "김종대-6"],
        g5: ["이준석-6", "이준석-7", "장경태-5", "장경태-6", "박휘락-4", "박휘락-5", "김종대-5", "김종대-6"],
        g6: ["이준석-7", "장경태-5", "장경태-6", "박휘락-5"],
        g7: ["이준석-8", "이준석-9", "장경태-7", "장경태-8", "박휘락-6", "박휘락-7", "김종대-7", "김종대-8", "김종대-9"],
      };

    /* ## 주장 선택 ## */
    //@ts-ignore
    d3.selectAll<SVGGElement>("g")
      .filter(function () {
        //@ts-ignore
        const attClass = d3.select(this).attr("class") || "";

        if (highlightedGroup) {
          if (Array.isArray(highlightedGroup)) {
            return highlightedGroup.some(group => classRanges[group]?.includes(attClass));
          }
          return classRanges[highlightedGroup]?.includes(attClass);
        } 

        if (highlightedClasses && highlightedClasses.length > 0) {
          return highlightedClasses.some(cls => participantRange[cls]?.includes(attClass));
        }

        return true;
      })
      .style("opacity", function () {
        //@ts-ignore
        const attClass = d3.select(this).attr("class") || "";

        if (!highlightedGroup && (!highlightedClasses || highlightedClasses.length === 0)) {
          return 1;
        }

        if (highlightedGroup) {
          if (Array.isArray(highlightedGroup)) {
            return highlightedGroup.some(group => classRanges[group]?.includes(attClass)) ? 1 : 1;
          }
          return classRanges[highlightedGroup]?.includes(attClass) ? 1 : 1;
        } 

        if (highlightedClasses && highlightedClasses.length > 0) {
          const validClasses = highlightedClasses.flatMap(cls => participantRange[cls] || []);
          return validClasses.includes(attClass) ? 1 : 1;
        }

        return 1;
      });
  }


  public update() {
    const excludedIndex = [1, 3, 5];
    const excludedIndexTwo = [1, 3, 5];
    // const self = this;
    // 주제별로 보고 싶다면 this._guideColor로 필터링 적용해도 될듯함.
    // filter 후 데이터 제공.
    const filteredData = this._topicGroups.filter(
      (group, index) => !excludedIndex.includes(index)
    );
    const secFilteredData = this._topicGroups.filter(
      (group, index) => !excludedIndexTwo.includes(index)
    );

    const topicGuideRectGSelection = this.topicGuideRectGSelection
      .selectAll<SVGRectElement, unknown>("rect")
      .data(this._guideColor === "#000000" ? filteredData : secFilteredData)
      .join("rect")
      .style("opacity", 0.45);
    topicGuideRectGSelection.call(
      setAttributesOfTopicGuides.bind(
        this,
        topicGuideRectGSelection,
        this._showTopicGroup,
        this._guideColor
      )
    );

    const topicGuideTextGSelection = this.topicGuideTextGSelection
      .selectAll<SVGTextElement, unknown>("text")
      .data(this._topicGroups)
      .join("text");

    topicGuideTextGSelection.call(
      setAttributesOfTopicText.bind(this, topicGuideTextGSelection, {
        topicGroupTitles: this._topicGroupTitles,
        showTopicGroup: this._showTopicGroup,
        showTopicGroupTitle: this._showTopicGroupTitle,
        guideColor: this._guideColor,
        conceptMatrixTransposed: this.debateDataSet.conceptMatrixTransposed,
        keytermObjects: this.debateDataSet.keytermObjects,
        termList: this.debateDataSet.termList,
        termUtteranceBooleanMatrixTransposed:
          this.debateDataSet.termUtteranceBooleanMatrixTransposed,
      })
    );

    function splitTextToLines(text: string | undefined | null): string[] {
      if (!text) return [];
      const maxLength = 30;
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";

      for (const word of words) {
        if ((line + word).length > maxLength) {
          lines.push(line.trim());
          line = "";
        }
        line += `${word} `;
      }

      if (line.trim() !== "") lines.push(line.trim());

      return lines;
    }

    function setAttributesOfTopicGuides(
      this: TopicGroupsDrawer,
      selection: d3.Selection<
        SVGRectElement,
        SimilarityBlock[][],
        SVGGElement,
        unknown
      >,
      showEngagementGroup: boolean,
      guideColor: string
    ) {
      selection
        .attr("x", (eg) => eg[0][0].beginningPointOfX)
        .attr("y", (eg) => eg[0][0].beginningPointOfY)
        .style("visibility", (eg) => (showEngagementGroup ? "visible" : "none"))
        .attr("width", (eg, i) => {
          const mostLeftTopBlock = eg[0][0];
          const lastHorizontalLine = eg[eg.length - 1];
          const mostRightBottomBlock =
            lastHorizontalLine[lastHorizontalLine.length - 1];
          const width =
            mostRightBottomBlock.beginningPointOfX +
            mostRightBottomBlock.width -
            mostLeftTopBlock.beginningPointOfX;

          //console.log(`Width of rectangle ${i}: ${width}`);
          return width;
        })
        .attr("height", (eg, i) => {
          const mostLeftTopBlock = eg[0][0];
          const lastHorizontalLine = eg[eg.length - 1];
          const mostRightBottomBlock =
            lastHorizontalLine[lastHorizontalLine.length - 1];
          const height =
            mostRightBottomBlock.beginningPointOfY +
            mostRightBottomBlock.height -
            mostLeftTopBlock.beginningPointOfY;
          return height;
        })
        .attr("idx", (eg, i) => {
          if(eg.length===18)
            return 1;
          else if(eg.length===22)
            return 2;
          else if(eg.length===34)
            return 3;
          else if(eg.length===36)
            return 4;
          else if(eg.length===33)
            return 5;
          else if(eg.length===32)
            return 6;
          else if(eg.length===37)
            return 7;
          return i;
        })
        .style("fill", this._guideColor === "#000000" ? "none" : "none")
        .style("clip-path", "polygon(0% 0%, 0% 0%, 100% 100%, 0% 100%)")
        .style("stroke-width", 1)
        .style("stroke", () => (showEngagementGroup ? "#ff0000" : "none"));
      // .style("stroke", () => (showEngagementGroup ? "none" : "none"));
    }

    function setAttributesOfTopicText(
      this: TopicGroupsDrawer,
      selection: d3.Selection<
        SVGTextElement,
        SimilarityBlock[][],
        SVGGElement,
        unknown
      >,
      arg: {
        topicGroupTitles: string[] | null;
        showTopicGroup: boolean;
        showTopicGroupTitle: boolean;
        guideColor: string;
        conceptMatrixTransposed: number[][];
        keytermObjects: KeytermObject[];
        termList: string[];
        termUtteranceBooleanMatrixTransposed: number[][];
      }
    ) {
      selection
        .attr("x", (eg, i) => {
          //@ts-ignore
          const mostLeftTopBlock = eg[0][0];
          const lastHorizontalLine = eg[eg.length - 1];
          //@ts-ignore
          const mostRightBottomBlock =
            lastHorizontalLine[lastHorizontalLine.length - 1];
          // 지금 나머지 xPoint들은 적용이 안되고 있는 상태.(수정완료)
          if (this._topicGroupTitles) {
            let xPoint = 0;
            const xPoints = [];
            for (let i = 0; i < this._topicGroupTitles.length; i++) {
              if (this._topicGroupTitles[i]) {
                if (this._guideColor === "#000000") {
                  switch (i) {
                    case 0:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        25;
                      break;
                    case 1:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        20000;
                      break;
                    case 2:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        25;
                      break;
                    case 3:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                    case 4:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        3;
                      break;
                    case 5:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                    case 6:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        25;
                      break;
                    case 7:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        0;
                      break;
                    case 8:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        55;
                      break;
                    default:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        0;
                    // break;
                  }
                  xPoints[i] = xPoint;
                } else {
                  // #ff0001 pos
                  switch (i) {
                    // middleTopicGroup
                    case 0:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        0;
                      break;
                    case 1:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        20000;
                      break;
                    case 2:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        4;
                      break;
                    case 3:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                    case 4:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        15;
                      break;
                    case 5:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                  }
                  xPoints[i] = xPoint;
                }
              }
            }
            return xPoints[i];
          } else return null;
        })
        .attr("y", (eg, i) => {
          const mostLeftTopBlock = eg[0][0];
          //TODO 객체의 topicGroup별로 yPoint 다르게 설정해야함.
          if (this._guideColor !== "#000000") {
            const yPoint = 170; // Middle Engagement Group
            return yPoint;
          } else {
            const yPoint = 170; // Small Engagement Group
            return yPoint;
          }
        }) // draw topic text
        .text((eg, i) => {
          if (arg.showTopicGroupTitle) {
            if (arg.topicGroupTitles) {
              const textLines = splitTextToLines(arg.topicGroupTitles[i] || "");

              // return `Show Topic Modal` || "";
              return "";
            } else {
              const highFrequencyTerms = extractFrequencyTermsFromEG(
                eg,
                this.debateDataSet.utteranceObjects,
                this.dataStructureSet.participantDict,
                this.termType
              );
              return `${highFrequencyTerms}`;
            }
          } else {
            return "";
          }
        })
        .attr("class", "topicGroupText")
        .each(function (eg, i) {
          const textElem = d3.select(this);
          textElem.selectAll("tspan").remove();

          if (arg.showTopicGroupTitle && arg.topicGroupTitles) {
            const textLines = splitTextToLines(arg.topicGroupTitles[i] || "");
            for (let j = 1; j < textLines.length; j++) {
              textElem
                .append("tspan")
                .attr("x", textElem.attr("x"))
                .attr("dy", "1.2em")
                .text(textLines[j]);
            }
          }
          const textElement = d3.select(this);
          const x = textElement.attr("x");
          const y = textElement.attr("y");
          const textContent = textElement.text();

          // 커스텀 이벤트 생성 및 발생
          const event = new CustomEvent("topicTextUpdated", {
            detail: { x, y, textContent, index: i },
          });
          window.dispatchEvent(event); // 전역
        })
        .attr("text-anchor", "middle")
        .style("font-size", this._guideColor === "#000000" ? "7.1" : "7.1")
        .style("font-weight", "bold")
        // .style("fill", () => (arg.showTopicGroup ? "none" : "none"))
        .style("fill", () => (arg.showTopicGroup ? arg.guideColor : "none"))
        .style("cursor", "pointer")
        .attr("transform", "rotate(-135) scale(-1, 1)")
        .on("click", (e, d) => {
          const mouseEvent = e as unknown as MouseEvent;
          const engagementGroup = d as unknown as SimilarityBlock[][];
          mouseEvent.stopPropagation();
          const engagementGroupIndex = _.indexOf(
            this._topicGroups,
            engagementGroup
          );

          // Draw conceptual_map of the engagement_group
          if (this.onTitleClicked !== null) {
            this.onTitleClicked(
              mouseEvent,
              engagementGroup,
              engagementGroupIndex
            );
          }
        })
        .append("title")
        .text((eg) => {
          const extractedTerms = extractTermsFromEngagementGroup(
            eg,
            arg.termUtteranceBooleanMatrixTransposed,
            arg.termList
          );
          return ``; // terms: ~.
        });
    }
  }

  public getTopicGroupTitlesPositions(): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    // 초기화 상태 확인 및 기본값 설정
    if (!this._topicGroups) {
      this._topicGroups = [];
    }
    if (!this._topicGroupTitles) {
      this._topicGroupTitles = [];
    }

    this._topicGroups.forEach((group, index) => {
      if (this._topicGroupTitles[index]) {
        const mostLeftTopBlock = group[0][0];
        const lastHorizontalLine = group[group.length - 1];
        const mostRightBottomBlock =
          lastHorizontalLine[lastHorizontalLine.length - 1];

        let xPoint = 0;
        if (this._guideColor === "#000000") {
          // 여기에 Small 타입에 대한 x 좌표 계산 로직
          switch (index) {
            case 0:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                25;
              break;
            case 1:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                20000;
              break;
            case 2:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                15; // 그냥 멀리 버려버리기.
              break;
            case 3:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                20000;
              break;
            case 4:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                3;
              break;
            case 5:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                20000;
              break;
            case 6:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                25;
              break;
            case 7:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                0;
              break;
            case 8:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                55;
              break;
            default:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                0;
          }
        } else {
          // 여기에 Middle 타입에 대한 x 좌표 계산 로직
          switch (index) {
            case 0:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                15;
              break;
            case 1:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                20000;
              break;
            case 2:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                3;
              break;
            case 3:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                20000;
              break;
            case 4:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                15;
              break;
            case 5:
              xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                20000;
              break;
          }
        }
        let yPoint;
        if (this._guideColor !== "#000000") {
          // 예를 들어 Middle 타입일 경우
          yPoint = -150;
        } else {
          // Small 타입일 경우
          yPoint = -130;
        }

        positions.push({ x: xPoint, y: yPoint });
      }
    });
    //console.log("Calculated positions:", positions);
    return positions;
  }
}
