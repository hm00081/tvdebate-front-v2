// migration CP to d3 method
/* eslint-disable no-unused-vars */
import React from 'react';
import store from '../../../../../redux/store';
import { DataStructureSet } from '../../../DataStructureMaker/DataStructureManager';
import * as d3 from 'd3';
// import _ from "lodash";
import { TranscriptViewerMethods } from '../../../TranscriptViewer/TranscriptViewer';
import { CP5Data, pathsData, lineData } from './tagData';
import { styleText } from '../StyleText';
import { CPDrawer } from '../CPFunction';

export class CP5Drawer extends CPDrawer {
    private readonly topicGuideCP5GSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>;

    private previousHighlightedGroup: string | null = null;
    private previousHighlightedClass: string | null = null;
    private previousSelectedBlock: [] | null = null;

    public constructor(svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>, dataStructureSet: DataStructureSet, transcriptViewerRef: React.RefObject<TranscriptViewerMethods>) {
        super(dataStructureSet, transcriptViewerRef);
        this.topicGuideCP5GSelection = svgSelection.append('g');

        // Redux 상태 변경 시 update 호출
        store.subscribe(() => {
            const currentHighlightedGroup = store.getState().highlight.highlightedGroup;
            const currentHighlightedClassName = store.getState().classHighLight.highlightedClassName;
            const currentSelectedBlock = store.getState().similarityBlockSelect.selectedBlock;
            //@ts-ignore
            if (!_.isEqual(this.previousHighlightedGroup, currentHighlightedGroup)) {
              this.previousHighlightedGroup = currentHighlightedGroup;
              this.update();
            }
            if (this.previousHighlightedClass !== currentHighlightedClassName) {
              this.previousHighlightedClass = currentHighlightedClassName;
              this.update();
            }
            //@ts-ignore
            if (!_.isEqual(this.previousSelectedBlock, currentSelectedBlock) || !_.isEqual(this.previousHighlightedGroup, currentHighlightedGroup)) {
              //@ts-ignore
              this.previousSelectedBlock = currentSelectedBlock;
              this.previousHighlightedGroup = currentHighlightedGroup;
              this.update();
            }
        });
    }

    public update() {
        const { highlightedGroup } = store.getState().highlight;
        const { highlightedClassName } = store.getState().classHighLight;
        const selectedBlock = store.getState().similarityBlockSelect.selectedBlock;

        const classMapping: { [key: string]: string } = {
          st16: 'PHR',
          st18: 'LJS',
          st19: 'KJD',
          st20: 'JKT',
      };

      const keywords: Record<string, string[]> = {
        'PROS': ['KJD', 'JKT'],
        'CONS': ['LJS', 'PHR'],
      }

        let name1 = '', name2 = '', selected1 = '', selected2 = '', index1 = -1, index2 = -1;
        // @ts-ignore
        if ((Array.isArray(highlightedGroup) && highlightedGroup.includes("g5")) ||
          highlightedGroup === "g5") {
          
          if (selectedBlock.length !== 0) {
              index1 = selectedBlock[1][0];
              index2 = selectedBlock[1][1];

              // 🔹 객체 매핑 방식으로 최적화 (반복되는 if-else 제거)
              const nameMapping: Record<string, { name: string; selected: string }> = {
                  '이준석': { name: 'LJS', selected: 'st21' },
                  '박휘락': { name: 'PHR', selected: 'st22' },
                  '김종대': { name: 'KJD', selected: 'st19' },
                  '장경태': { name: 'JKT', selected: 'st20' },
              };

              if (selectedBlock[0][0] in nameMapping) {
                  ({ name: name1, selected: selected1 } = nameMapping[selectedBlock[0][0]]);
              }

              if (selectedBlock[0][1] in nameMapping) {
                  ({ name: name2, selected: selected2 } = nameMapping[selectedBlock[0][1]]);
              }
          }
      }

        this.topicGuideCP5GSelection.selectAll('circle, path, ellipse, text, tspan, line').style(
            'opacity',
            function (d: any) {
                const name =
                    d?.scriptIndex !== undefined
                        ? //@ts-ignore
                          this.dataStructureSet?.utteranceObjectsForDrawingManager?.utteranceObjectsForDrawing[d.scriptIndex]?.name
                        : null;

                if (Array.isArray(highlightedGroup)) {
                  //@ts-ignore
                  if (!highlightedGroup.includes("g5")) {
                      return 0.3;
                  }
                } else if (highlightedGroup && highlightedGroup !== "g5") {
                    return 0.3;
                }
                return 1;
            }.bind(this)
        );

        const lineGroups = this.topicGuideCP5GSelection
            .selectAll('g.CP5Line')
            .data(lineData)
            .enter()
            .append('g')
            .attr('class', (d) => d.class); // dom class

        lineGroups
            .selectAll('line')
            .data((d) => d.elements)
            .enter()
            .append('line')
            .attr('x1', (d) => d.x1)
            .attr('y1', (d) => d.y1)
            .attr('x2', (d) => d.x2)
            .attr('y2', (d) => d.y2)
            .attr('stroke', (d) => d.stroke)
            .attr('stroke-dasharray', (d) => d.strokeDasharray)
            .attr('stroke-width', (d) => d.strokeWidth)
            .attr('stroke-opacity', (d) => d.strokeOpacity);

            lineGroups.attr(
              "transform",
              "translate(-593, 27) scale(-0.875,0.875) rotate(135)"
            )

        const groups = this.topicGuideCP5GSelection
            .selectAll('g') // 기존 요소도 선택
            .data(pathsData)
            //className st16: PHR, st17: 진행자, st18: LJS, st19: KJD, st20: JKT
            .join(
                (enter) => {
                    // 새로 추가되는 요소 처리
                    const enterGroups = enter.append('g');
                    enterGroups.append('style').text(styleText);
                    enterGroups
                        .append('path')
                        .attr('class', (d) => d.className)
                        .attr('d', (d) => d.d)
                        .style('opacity', (d) => {
                          //@ts-ignore
                          const mappedClass = classMapping[d.className];
                          if (highlightedClassName === 'LJS' || highlightedClassName === 'PHR' || highlightedClassName === 'KJD' || highlightedClassName === 'JKT'){
                            if (mappedClass !== highlightedClassName) {
                              return 0.3;
                            } else {
                              return 1;
                            }
                          } else if (highlightedClassName === 'PROS' || highlightedClassName === 'CONS'){
                            const mappedKey1 = keywords[highlightedClassName][0];
                            const mappedKey2 = keywords[highlightedClassName][1];
                            if (mappedClass === mappedKey1 || mappedClass === mappedKey2){
                              return 1;
                            }
                          }
                          return 0.3;
                      });
                    enterGroups.append('title').text((d) => {
                        const name = this.dataStructureSet?.utteranceObjectsForDrawingManager?.utteranceObjectsForDrawing[d.scriptIndex]?.name;
                        const utterance = this.dataStructureSet?.utteranceObjectsForDrawingManager?.utteranceObjectsForDrawing[d.scriptIndex]?.utterance;
                        return `scriptIndex: ${d.scriptIndex}\nName: ${name}\nUtterance: ${utterance}`;
                    });
                    return enterGroups;
                },
                (update) => {
                    // 기존 요소 업데이트
                    update
                        .selectAll('path, line')
                        .style('opacity', () => {
                          if (Array.isArray(highlightedGroup)) {
                            //@ts-ignore
                            if (!highlightedGroup.includes("g5")) {
                                return 0.3;
                            }
                          } else if (highlightedGroup && highlightedGroup !== "g5") {
                              return 0.3;
                          }
                          return 1;
                      })
                        .style('opacity', (d) => {
                          //@ts-ignore
                          const mappedClass = classMapping[d.className];
                          if (highlightedClassName === 'LJS' || highlightedClassName === 'PHR' || highlightedClassName === 'KJD' || highlightedClassName === 'JKT'){
                            if (mappedClass !== highlightedClassName) {
                              return 0.3;
                            } else {
                              return 1;
                            }
                          } else if (highlightedClassName === 'PROS' || highlightedClassName === 'CONS'){
                            const mappedKey1 = keywords[highlightedClassName][0];
                            const mappedKey2 = keywords[highlightedClassName][1];
                            if (mappedClass === mappedKey1 || mappedClass === mappedKey2){
                              return 1;
                            }
                          }
                          // return 0.3;
                          return 1;
                      });
                    return update;
                },
                (exit) => exit.remove() // 필요시 제거
            );

        groups.attr('transform', (d, i) => {
          const x = -590;
          const y = 30;
          const r = 135; // 회전 각도 (도)
            //rotate(-135) scale(-1, 1)
            return `translate(${x},${y}) scale(-0.875, 0.875) rotate(${r})`;
        });

        const filteredPaths = groups.selectAll("path")
          .style("opacity", (d) => {
            //@ts-ignore
            if (selectedBlock.length !== 0 && (index1 === d.scriptIndex || index2 === d.scriptIndex)) {
                return 1;
            } 
            
            else if (selectedBlock.length === 0) {
                if (Array.isArray(highlightedGroup)) {
                    //@ts-ignore
                    if (highlightedGroup.includes("g5")) {
                        return 1;
                    } else {
                        return 0.3;
                    }
                } 
                else if (highlightedGroup && highlightedGroup === "g5") {
                    return 1;
                } 
                else if (highlightedGroup && highlightedGroup !== "g5") {
                    return 0.3;
                } 
                else if (!highlightedGroup) {
                    return 1;
                }
            }
            return 0.3;
        });

        CP5Data.forEach((groupData, i) => {
            const groupClass = groupData.class;
            const classType = groupClass.match(/-(\D+)/)?.[1]; // 숫자 제외 접두사 추출
            const mapType: { [key: string]: string } = {
              'L': 'LJS',
              'J': 'JKT',
              'K': 'KJD',
              'P': 'PHR'
            }
            //@ts-ignore
            const groupType = mapType[classType];
            const group = this.topicGuideCP5GSelection
                .append('g')
                .attr('class', groupData.class) // 클래스별로 그리도록!, 그리고 여기서 타입별로 또 그리게하면 됨.
                .attr('transform', () => {
                  const x = -590;
                  const y = 30;
                  const r = 135; // 회전 각도
                    return `translate(${x},${y}) scale(-0.875, 0.875) rotate(${r})`;
                });

            group.selectAll('*').style('opacity', () => {
              if (Array.isArray(highlightedGroup)) {
                //@ts-ignore
                if (!highlightedGroup.includes("g5")) {
                    return 0.3;
                }
              } else if (highlightedGroup && highlightedGroup !== "g5") {
                  return 0.3;
              }
                return 1;
            });

            let isHighlighted = 0;
            if (highlightedClassName === 'LJS' || highlightedClassName === 'PHR' || highlightedClassName === 'KJD' || highlightedClassName === 'JKT'){
              isHighlighted = highlightedClassName && highlightedClassName === groupType;
            } else if (highlightedClassName === 'PROS' || highlightedClassName === 'CONS'){
              //@ts-ignore
              isHighlighted = (keywords[highlightedClassName][0] === groupType || keywords[highlightedClassName][1] === groupType);
            }

            // console.log("isHighlighted", isHighlighted);
            const opacityValue = isHighlighted ? 1 : 0.3;
            // 'circle' 요소 처리
            groupData.elements.forEach((element) => {
                if (element.type === 'circle') {
                    group
                        .append('circle')
                        //@ts-ignore
                        .attr('cx', Number(element.cx))
                        //@ts-ignore
                        .attr('cy', Number(element.cy))
                        //@ts-ignore
                        .attr('r', element.r)
                        .attr('class', element.className)
                        //@ts-ignore
                        .on('click', (e) => this.handleClick(element.onClick, e))
                        .style('opacity', () => {
                          if (Array.isArray(highlightedGroup)) {
                            //@ts-ignore
                            if (!highlightedGroup.includes("g5")) {
                                return 0.3;
                            }
                          } else if (highlightedGroup && highlightedGroup !== "g5") {
                              return 0.3;
                          }
                          return 1;
                        })
                        .style('opacity', highlightedClassName ? opacityValue : 1);
                }

                // 'path' 요소 처리
                if (element.type === 'path') {
                    group
                        .append('path')
                        //@ts-ignore
                        .attr('d', element.d)
                        .attr('class', element.className)
                        //@ts-ignore
                        .on('click', (e) => this.handleClick(element.onClick, e))
                        .style('opacity', () => {
                          // 🔹 `highlightedGroup`과 `highlightedClassName`이 없을 경우 기본값 1 반환
                          if (!highlightedGroup && !highlightedClassName) {
                              return 1;
                          }
                      
                          // 🔹 `selectedBlock`이 유효한지 확인 후 비교
                          //@ts-ignore
                          if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1]) && selectedBlock[1].length > 1) {
                            if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1])) {
                              //@ts-ignore
                              if (selectedBlock[1].length > 1 && 
                                  (selectedBlock[1][0] === element.onClick || selectedBlock[1][1] === element.onClick)) {
                                  return 1;
                              }
                            }
                              return 0.3;
                          }
                          // 🔹 `highlightedGroup`이 배열이면 `includes("g5")`로 체크
                          if (Array.isArray(highlightedGroup)) {
                            //@ts-ignore
                              if (!highlightedGroup.includes("g5")) {
                                  return 0.3;
                              } else {
                                return 1;
                              }
                          } else if (highlightedGroup && highlightedGroup !== "g5") {
                              return 0.3;
                          }
                          // 🔹 `highlightedGroup`이 "g5"일 경우 처리
                          //@ts-ignore
                          if ((Array.isArray(highlightedGroup) && highlightedGroup.includes("g5")) ||
                              highlightedGroup === "g5") {
                              if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1])) {
                                //@ts-ignore
                                if (selectedBlock[1].length > 1 && 
                                    (selectedBlock[1][0] === element.onClick || selectedBlock[1][1] === element.onClick)) {
                                    return 1;
                                }
                              }
                              // 선택된 상태에서 similarity block이 선택된 경우면서 화자가 일치하는 경우
                              if (element.className === name1 || element.className === name2) {
                                  return 1;
                              }
                              return 0.3;
                          }
                          // 🔹 `highlightedClassName`이 있을 경우 `opacityValue` 반환
                          if (highlightedClassName) {
                              return opacityValue;
                          }
                          return 0.3;
                      });       
                }

                // 'ellipse' 요소 처리
                if (element.type === 'ellipse') {
                    // console.log("ellipse className", element.className);
                    group
                        .append('ellipse')
                        //@ts-ignore
                        .attr('cx', Number(element.cx))
                        //@ts-ignore
                        .attr('cy', Number(element.cy))
                        //@ts-ignore
                        .attr('rx', Number(element.rx))
                        //@ts-ignore
                        .attr('ry', Number(element.ry))
                        //@ts-ignore
                        .attr('transform', element.transform)
                        .attr('class', element.className)
                        //@ts-ignore
                        .on('click', (e) => this.handleClick(element.onClick, e))
                        .style('opacity', () => {
                          if (!highlightedGroup && !highlightedClassName) {
                              return 1;
                          }
                      
                          // 🔹 selectedBlock이 배열인지 확인 후 비교
                          //@ts-ignore
                          if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1]) && selectedBlock[1].length > 1) {
                            if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1])) {
                              //@ts-ignore
                              if (selectedBlock[1].length > 1 && 
                                  (selectedBlock[1][0] === element.onClick || selectedBlock[1][1] === element.onClick)) {
                                  return 1;
                              }
                            }
                              return 0.3;
                          }
                      
                          // 🔹 highlightedGroup이 배열일 경우 "g5"이 포함되어 있는지 확인
                          if (Array.isArray(highlightedGroup)) {
                            //@ts-ignore
                              if (!highlightedGroup.includes("g5")) {
                                  return 0.3;
                              } else {
                                return 1;
                              }
                          } else if (highlightedGroup && highlightedGroup !== "g5") {
                              return 0.3;
                          }
                      
                          // 🔹 highlightedGroup이 "g5"일 경우 처리
                          //@ts-ignore
                          if ((Array.isArray(highlightedGroup) && highlightedGroup.includes("g5")) || 
                              highlightedGroup === "g5") {
                              if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1])) {
                                //@ts-ignore
                                if (selectedBlock[1].length > 1 && 
                                    (selectedBlock[1][0] === element.onClick || selectedBlock[1][1] === element.onClick)) {
                                    return 1;
                                }
                              }
                              // 선택된 상태에서 similarity block이 선택된 경우면서 화자가 일치하는 경우
                              if (element.className === name1 || element.className === name2) {
                                  return 1;
                              }
                              return 0.3;
                          }
                      
                          // 🔹 highlightedClassName이 있을 경우 opacityValue 반환
                          if (highlightedClassName) {
                              return opacityValue;
                          }
                          return 0.3;
                      });      
                }

                // 'text' 요소와 'tspan' 요소 처리
                if (element.type === 'text') {
                    // console.log("text className", element.className);
                    const text = group
                        .append('text')
                        //@ts-ignore
                        .attr('transform', element.transform)
                        .attr('class', element.className);

                    // 마우스 오버 이벤트 추가
                    text
                        // //@ts-ignore
                        // .on('mouseenter', (e) => this.handleMouseEnter(element.onHover, e))
                        // //@ts-ignore
                        // .on('mouseleave', (e) => this.handleMouseLeave(element.onHover, e))
                        .style('opacity', () => {
                          if (highlightedGroup) {
                            if (Array.isArray(highlightedGroup)) {
                              //@ts-ignore
                              if (!highlightedGroup.includes("g5")) {
                                  return 0.3;
                              }
                            } else if (highlightedGroup && highlightedGroup !== "g5") {
                                return 0.3;
                            }
                            return 1;
                          } else if (highlightedClassName) {
                            return highlightedClassName ? opacityValue : 1;
                          }
                          return 1;
                        });
                    if (element.style && element.style !== 'None') {
                        text.style('font-size', element.style);
                    }
                    // 클릭 이벤트가 정의되어 있으면 적용
                    if (element.onClick && element.onClick !== 'None') {
                        text.on('click', () => this.handleClickText(Number(element.onClick)));
                    }
                    //@ts-ignore
                    element.content.forEach((content) => {
                        //@ts-ignore
                        if (content.type === 'tspan') {
                            // console.log("tspan className", element.className);
                            const tspan = text
                                .append('tspan')
                                //@ts-ignore
                                .attr('x', Number(content.x) - 7)
                                //@ts-ignore
                                .attr('y', Number(content.y))
                                //@ts-ignore
                                .attr('class', content.className)
                                //@ts-ignore
                                .text(content.text)
                                .style('opacity', () => {
                                  if (Array.isArray(highlightedGroup)) {
                                    //@ts-ignore
                                    if (!highlightedGroup.includes("g5")) {
                                        return 0.3;
                                    }
                                  } else if (highlightedGroup && highlightedGroup !== "g5") {
                                      return 0.3;
                                  }
                                    return 1;
                                })
                                .style('opacity', highlightedClassName ? opacityValue : 1);
                            // 스타일이 정의되어 있으면 적용
                            //@ts-ignore
                            if (content.style && content.style !== 'None') {
                                //@ts-ignore
                                tspan.style('font-size', content.style);
                            }

                            //@ts-ignore
                            if (content.onClick && content.onClick !== 'None') {
                                tspan.on('click', (e) => {
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
