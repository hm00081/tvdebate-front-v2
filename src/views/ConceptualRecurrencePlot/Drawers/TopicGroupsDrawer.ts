/* eslint-disable no-unused-vars */
import { TermType } from "../DataImporter";
import { DataStructureSet } from "../DataStructureMaker/DataStructureManager";
import { DebateDataSet } from "../../../interfaces/DebateDataInterface";
import { SimilarityBlock } from "../interfaces";
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

              return `Show Topic Modal` || "";
              //return "" || "";
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
