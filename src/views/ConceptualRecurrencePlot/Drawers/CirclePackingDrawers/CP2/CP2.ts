// migration CP to d3 method
/* eslint-disable no-unused-vars */
import React from "react";
import { DataStructureSet } from "../../../DataStructureMaker/DataStructureManager";
import * as d3 from "d3";
import _ from "lodash";
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

  public constructor(
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>,
    dataStructureSet: DataStructureSet,
    transcriptViewerRef: React.RefObject<TranscriptViewerMethods>
  ) {
    super(dataStructureSet, transcriptViewerRef);
    this.topicGuideCP1GSelection = svgSelection.append("g");
  }

  public update() {
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
      .selectAll("g")
      .data(pathsData)
      .enter()
      .append("g");
    groups.append("style").text(styleText);
    groups
      .append("path")
      .attr("class", (d) => d.className)
      .attr("d", (d) => d.d);
    groups.append("title").text((d) => {
      const name = this.dataStructureSet?.utteranceObjectsForDrawingManager
        ?.utteranceObjectsForDrawing[d.scriptIndex]?.name;
      const utterance = this.dataStructureSet?.utteranceObjectsForDrawingManager
        ?.utteranceObjectsForDrawing[d.scriptIndex]?.utterance;
      return `scriptIndex: ${d.scriptIndex}\nName: ${name}\nUtterance: ${utterance}`;
    });
    groups.attr("transform", (d, i) => {
      const x = -483;
      const y = 358;
      const r = 135;
      return `translate(${x},${y}) scale(-0.8, 0.8) rotate(${r})`;
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
            .on("click", (e) => this.handleClick(element.onClick, e));
        }

        // 'path' 요소 처리
        if (element.type === "path") {
          group
            .append("path")
            //@ts-ignore
            .attr("d", element.d)
            .attr("class", element.className)
            //@ts-ignore
            .on("click", (e) => this.handleClick(element.onClick, e));
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
            .on("click", (e) => this.handleClick(element.onClick, e));
        }

        // 'text' 요소와 'tspan' 요소 처리
        if (element.type === "text") {
          const text = group
            .append("text")
            //@ts-ignore
            .attr("transform", element.transform)
            .attr("class", element.className);
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
                .text(content.text);
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
