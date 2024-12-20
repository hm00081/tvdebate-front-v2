// migration CP to d3 method
/* eslint-disable no-unused-vars */
import React from "react";
import store from "../../../../../redux/store";
import { DataStructureSet } from "../../../DataStructureMaker/DataStructureManager";
import * as d3 from "d3";
// import _ from "lodash";
import { TranscriptViewerMethods } from "../../../TranscriptViewer/TranscriptViewer";
import { CP4Data, pathsData, lineData } from "./tagData";
import { styleText } from "../StyleText";
import { CPDrawer } from "../CPFunction";

export class CP4Drawer extends CPDrawer {
  private readonly topicGuideCP1GSelection: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  private previousHighlightedGroup: string | null = null;

  public constructor(
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>,
    dataStructureSet: DataStructureSet,
    transcriptViewerRef: React.RefObject<TranscriptViewerMethods>
  ) {
    super(dataStructureSet, transcriptViewerRef);
    this.topicGuideCP1GSelection = svgSelection.append("g");

    // Redux 상태 변경 시 update 호출
    store.subscribe(() => {
      const currentHighlightedGroup = store.getState().highlight.highlightedGroup;
      if (this.previousHighlightedGroup !== currentHighlightedGroup) {
        this.previousHighlightedGroup = currentHighlightedGroup;
        this.update(); // 상태가 실제로 변경되었을 때만 update 호출
      }
    });
  }

  public update() {
    const highlightedGroup = store.getState().highlight.highlightedGroup;

    this.topicGuideCP1GSelection
    .selectAll("circle, path, ellipse, text, tspan, line")
    .style("opacity", () => {
      if (highlightedGroup && highlightedGroup !== "g4") {
        return 0.3;
      }
      return 1;
    });

    const lineGroups = this.topicGuideCP1GSelection
      .selectAll("g.CP4Line")
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

    lineGroups.attr(
      "transform",
      "translate(-825, 87) scale(-1.1, 1.1) rotate(135)"
    );
    //const topicGuideCP1GSelection
    const groups = this.topicGuideCP1GSelection
      .selectAll("g") // 기존 요소도 선택
      .data(pathsData)
      .join(
        (enter) => {
          // 새로 추가되는 요소 처리
          const enterGroups = enter.append("g");
          enterGroups.append("style").text(styleText);
          enterGroups.append("path").attr("transform", "translate(-111,13) scale(1.094)").attr("class", (d) => d.className).attr("d", (d) => d.d);
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
            if (highlightedGroup && highlightedGroup !== "g4") {
              return 0.3;
            }
            return 1;
          });
          return update;
        },
        (exit) => exit.remove() // 필요시 제거
      );

    groups.attr("transform", (d, i) => {
      const x = -821;
      const y = 87;
      const r = 135; // 회전 각도 (도)
      //rotate(-135) scale(-1, 1)
      return `translate(${x},${y}) scale(-1.1, 1.1) rotate(${r})`;
    });

    groups
      .append("ellipse")
      //@ts-ignore
      .attr("cx", "892")
      //@ts-ignore
      .attr("cy", "148.7")
      .attr("rx", 81.1)
      .attr("ry", 81.1)
      .attr(
        "transform",
        // "matrix(0.7071 -0.7071 0.7071 0.7071 156.1309 674.2637)"
        "translate(-111,13) scale(1.094)"
      )
      .attr("fill", "white");

    CP4Data.forEach((groupData, i) => {
      const group = this.topicGuideCP1GSelection
        .append("g")
        //@ts-ignore
        .attr("class", groupData.class) // 클래스별로 그리도록!, 그리고 여기서 타입별로 또 그리게하면 됨.
        .attr("transform", () => {
          const x = -821;
          const y = 87;
          const r = 135; // 회전 각도
          return `translate(${x},${y}) scale(-1.1, 1.1) rotate(${r})`;
        });

        group.selectAll("*").style("opacity", () => {
          if (highlightedGroup && highlightedGroup !== "g4") {
            return 0.3;
          }
          return 1;
        });
  
      //@ts-ignore
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
              if (highlightedGroup && highlightedGroup !== "g4") {
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
              if (highlightedGroup && highlightedGroup !== "g4") {
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
              if (highlightedGroup && highlightedGroup !== "g4") {
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
              if (highlightedGroup && highlightedGroup !== "g4") {
                return 0.3;
              }
              return 1;
            });
          
          // 스타일이 정의되어 있으면 적용
          if (element.style && element.style !== "None") {
            //@ts-ignore
            text.style("font-size", element.style);
          }

          // 클릭 이벤트가 정의되어 있으면 적용
          if (element.onClick && element.onClick !== "None") {
            text.on("click", () =>
              this.handleClickText(Number(element.onClick))
            );
          }
          //@ts-ignore
          element.content.forEach((content) => {
            //@ts-ignore
            if (content.type === "tspan") {
              const tspan = text
                .append("tspan")
                //@ts-ignore
                .attr("x", Number(content.x) - 7)
                //@ts-ignore
                .attr("y", Number(content.y))
                //@ts-ignore
                .attr("class", content.className)
                //@ts-ignore
                .text(content.text)
                .style("opacity", () => {
                  if (highlightedGroup && highlightedGroup !== "g4") {
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
