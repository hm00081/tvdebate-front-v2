// migration CP to d3 method
/* eslint-disable no-unused-vars */
import React from "react";
import store from "../../../../../redux/store";
import { DataStructureSet } from "../../../DataStructureMaker/DataStructureManager";
import * as d3 from "d3";
// import _ from "lodash";
import { TranscriptViewerMethods } from "../../../TranscriptViewer/TranscriptViewer";
import { CP2Data, pathsData, lineData } from "./tagData";
import { styleText } from "../StyleText";
import { CPDrawer } from "../CPFunction";

export class CP2Drawer extends CPDrawer {
  private readonly topicGuideCP1GSelection: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  private previousHighlightedGroup: string | null = null;
  private previousSelectedBlock: [] | null = null;

  public constructor(
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>,
    dataStructureSet: DataStructureSet,
    transcriptViewerRef: React.RefObject<TranscriptViewerMethods>
  ) {
    super(dataStructureSet, transcriptViewerRef);
    this.topicGuideCP1GSelection = svgSelection.append("g");

    // Redux 상태 변경 시 update 호출
    store.subscribe(() => {
      const currentSelectedBlock = store.getState().similarityBlockSelect.selectedBlock;
      const currentHighlightedGroup = store.getState().highlight.highlightedGroup;
      if (this.previousSelectedBlock !== currentSelectedBlock || this.previousHighlightedGroup !== currentHighlightedGroup){
        // @ts-ignore
        this.previousSelectedBlock = currentSelectedBlock;
        this.previousHighlightedGroup = currentHighlightedGroup;
        this.update();
      }
    });
  }

  public update() {
    const highlightedGroup = store.getState().highlight.highlightedGroup;
    const selectedBlock = store.getState().similarityBlockSelect.selectedBlock;

    let name1 = '', name2 = '', selected1 = '', selected2 = '', index1 = 0, index2 = 0;
    if (highlightedGroup === "g2" && selectedBlock.length !== 0){
      index1 = selectedBlock[1][0];
      index2 = selectedBlock[1][1];
      if(selectedBlock[0][0] === '이준석'){
        name1 = 'LJS';
        selected1 = 'st21';
      } else if(selectedBlock[0][0] === '박휘락'){
        name1 = 'PHR';
        selected1 = 'st22';
      } else if(selectedBlock[0][0] === '김종대'){
        name1 = 'KJD';
        selected1 = 'st19';
      } else if(selectedBlock[0][0] === '장경태'){
        name1 = 'JKT';
        selected1 = 'st20';
      }
      if(selectedBlock[0][1] === '이준석'){
        name2 = 'LJS';
        selected2 = 'st21';
      } else if(selectedBlock[0][1] === '박휘락'){
        name2 = 'PHR';
        selected2 = 'st22';
      } else if(selectedBlock[0][1] === '김종대'){
        name2 = 'KJD';
        selected2 = 'st19';
      } else if(selectedBlock[0][1] === '장경태'){
        name2 = 'JKT';
        selected2 = 'st20';
      }
    } else if((highlightedGroup !== "g2" && selectedBlock.length === 0)) {

    }

    // console.log(highlightedGroup, name1, name2, selected1, selected2);

    this.topicGuideCP1GSelection
    .selectAll("circle, path, ellipse, text, tspan, line")
    .style("opacity", () => {
      if (highlightedGroup && highlightedGroup !== "g2") {
        return 0.3;
      }
      return 1;
    });

    const lineGroups = this.topicGuideCP1GSelection
      .selectAll("g.CP2Line")
      .data(lineData)
      .enter()
      .append("g")
      .attr("class", (d) => d.class);

    lineGroups
      .selectAll("line")
      .data((d) => d.elements)
      .enter()
      .append("line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2)
      .attr("stroke", (d) => d.stroke)
      .attr("stroke-dasharray", (d) => d.strokeDasharray)
      .attr("stroke-width", (d) => d.strokeWidth)
      .attr("stroke-opacity", (d) => d.strokeOpacity);

    lineGroups.attr("transform", (d, i) => {
      const x = -483;
      const y = 358;
      const r = 135; // 회전 각도 (도)
      return `translate(${x},${y}) scale(-0.8, 0.8) rotate(${r})`;
    });
    //const topicGuideCP1GSelection
    const groups = this.topicGuideCP1GSelection
      .selectAll("g") // 기존 요소도 선택
      .data(pathsData)
      .join(
        (enter) => {
          // 새로 추가되는 요소 처리
          const enterGroups = enter.append("g");
          enterGroups.append("style").text(styleText);
          enterGroups.append("path").attr("class", (d) => d.className).attr("d", (d) => d.d);
          enterGroups.append("title").text((d) => {
            const name =
              this.dataStructureSet?.utteranceObjectsForDrawingManager
                ?.utteranceObjectsForDrawing[d.scriptIndex]?.name;
            const utterance =
              this.dataStructureSet?.utteranceObjectsForDrawingManager
                ?.utteranceObjectsForDrawing[d.scriptIndex]?.utterance;
            return `scriptIndex: ${d.scriptIndex}\nName: ${name}\nUtterance: ${utterance}`;
          });
          return enterGroups;
        },
        (update) => {
          // 기존 요소 업데이트
          update.selectAll("path, line").style("opacity", () => {
            if (highlightedGroup && highlightedGroup !== "g2") {
              return 0.3;
            }
            return 1;
          });
          return update;
        },
        (exit) => exit.remove() // 필요시 제거
      );

    groups.attr("transform", (d, i) => {
      const x = -483;
      const y = 358;
      const r = 135;
      return `translate(${x},${y}) scale(-0.8, 0.8) rotate(${r})`;
    });

    const filteredPaths = groups.selectAll("path")
      .style("opacity", (d) => {
        //@ts-ignore
        if (selectedBlock.length !== 0 && (index1 === d.scriptIndex || index2 === d.scriptIndex)){
          return 1;
        } else if(selectedBlock.length === 0){
          if(highlightedGroup && highlightedGroup === "g2"){
            return 1;
          } else if (highlightedGroup && highlightedGroup !== "g2") {
            return 0.3;
          } else if (!highlightedGroup){
            return 1;
          }
        }
        return 0.3;
      });

    CP2Data.forEach((groupData, i) => {
      const group = this.topicGuideCP1GSelection
        .append("g")

        .attr("class", groupData.class) // 클래스별로 그리도록!, 그리고 여기서 타입별로 또 그리게하면 됨.
        .attr("transform", () => {
          const x = -483;
          const y = 358;
          const r = 135; // 회전 각도
          return `translate(${x},${y}) scale(-0.8, 0.8) rotate(${r})`;
        });

        group.selectAll("*").style("opacity", () => {
          if (highlightedGroup && highlightedGroup !== "g2") {
            return 0.3;
          }
          return 1;
        });
  
      // 'circle' 요소 처리
      groupData.elements.forEach((element) => {
        if (element.type === "circle") {
          group
            .append("circle")
            //@ts-ignore
            .attr("cx", Number(element.cx))
            //@ts-ignore
            .attr("cy", Number(element.cy))
            //@ts-ignore
            .attr("r", element.r)
            .attr("class", element.className)
            //@ts-ignore
            .on("click", (e) => this.handleClick(element.onClick, e))
            .style("opacity", () => {
              if (highlightedGroup && highlightedGroup !== "g2") {
                return 0.3;
              }
              return 1;
            });
        }

        // 'path' 요소 처리
        if (element.type === "path") {
          group
            .append("path")
            //@ts-ignore
            .attr("d", element.d)
            .attr("class", element.className)
            //@ts-ignore
            .on("click", (e) => this.handleClick(element.onClick, e))
            .style("opacity", () => {
              // 아무것도 선택이 되지 않은 경우
              if (!highlightedGroup){
                return 1;
              } 
              // 주제문 또는 similarity block이 선택되었지만, 해당 서클패킹이 아닌 경우
              if (highlightedGroup && highlightedGroup !== "g2") {
                return 0.3;
              } else if (highlightedGroup && highlightedGroup === "g2"){
                if(selectedBlock.length === 0){
                  return 1;
                }
                // 선택된 상태에서 similarity block이 선택된 경우면서 화자가 일치하는 경우
                if(element.className === name1 || element.className === name2){
                  return 1;
                }
                return 0.3;
              }
              
              return 1;
            });
        }

        // 'ellipse' 요소 처리
        if (element.type === "ellipse") {
          group
            .append("ellipse")
            //@ts-ignore
            .attr("cx", Number(element.cx))
            //@ts-ignore
            .attr("cy", Number(element.cy))
            //@ts-ignore
            .attr("rx", Number(element.rx))
            //@ts-ignore
            .attr("ry", Number(element.ry))
            //@ts-ignore
            .attr("transform", element.transform)
            .attr("class", element.className)
            //@ts-ignore
            .on("click", (e) => this.handleClick(element.onClick, e))
            .style("opacity", () => {
              // 아무것도 선택이 되지 않은 경우
              if (!highlightedGroup){
                return 1;
              } 
              // 주제문 또는 similarity block이 선택되었지만, 해당 서클패킹이 아닌 경우
              if (highlightedGroup && highlightedGroup !== "g2") {
                return 0.3;
              } else if (highlightedGroup && highlightedGroup === "g2"){
                if(selectedBlock.length === 0){
                  return 1;
                }
                // 선택된 상태에서 similarity block이 선택된 경우면서 화자가 일치하는 경우
                if(element.className === name1 || element.className === name2){
                  return 1;
                }
                return 0.3;
              }
              
              return 1;
            });
        }

        // 'text' 요소와 'tspan' 요소 처리
        if (element.type === "text") {
          const text = group
            .append("text")
            //@ts-ignore
            .attr("transform", element.transform)
            .attr("class", element.className);
        
          // 마우스 오버 이벤트 추가
          text
            .style("opacity", () => {
              if (highlightedGroup && highlightedGroup !== "g2") {
                return 0.3;
              }
              return 1;
            });

          if (element.style && element.style !== "None") {
            text.style("font-size", element.style);
          }

          // 클릭 이벤트가 정의되어 있으면 적용
          if (element.onClick && element.onClick !== "None") {
            text.on("click", () =>
              this.handleClickText(Number(element.onClick))
            );
          }
          //@ts-ignore
          const tspanCount = element.content.filter(
            //@ts-ignore
            (content) => content.type === "tspan"
          ).length;

          //@ts-ignore
          element.content.forEach((content, i) => {
            //console.log("content", tspanCount, i);
            //@ts-ignore
            if (content.type === "tspan") {
              //@ts-ignore
              let adjustedX = Number(content.x); // 기본값 설정
              if (tspanCount === 2) {
                //@ts-ignore
                adjustedX += 10;
              } else if (tspanCount === 3) {
                //@ts-ignore
                adjustedX += -10;
              }
              const tspan = text
                .append("tspan")
                //@ts-ignore
                //.attr("x", adjustedX)
                .attr("x", Number(content.x) - 7)
                //@ts-ignore
                .attr("y", Number(content.y))
                //@ts-ignore
                .attr("class", content.className)
                //@ts-ignore
                .text(content.text)
                .style("opacity", () => {
                  if (highlightedGroup && highlightedGroup !== "g2") {
                    return 0.3;
                  }
                  return 1;
                });
              // 스타일이 정의되어 있으면 적용
              //@ts-ignore
              if (content.style && content.style !== "None") {
                //@ts-ignore
                tspan.style("font-size", content.style);
              }

              //@ts-ignore
              if (content.onClick && content.onClick !== "None") {
                tspan.on("click", (e) => {
                  e.stopPropagation();
                  this.handleClickText(Number(element.onClick));
                });
              }
            } else {
              text.text(content.text);
            }
          });
        }
      });
    });
  }
}
