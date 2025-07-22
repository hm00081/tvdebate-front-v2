// migration CP to d3 method
/* eslint-disable no-unused-vars */
import React from 'react';
import store from '../../../../../redux/store';
import { DataStructureSet } from '../../../DataStructureMaker/DataStructureManager';
import * as d3 from 'd3';
// import _ from "lodash";
import { TranscriptViewerMethods } from '../../../TranscriptViewer/TranscriptViewer';
import { CP6Data, pathsData, lineData } from './tagData';
import { styleText } from '../StyleText';
import { CPDrawer } from '../CPFunction';

export class CP6Drawer extends CPDrawer {
    private readonly topicGuideCP6GSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>;

    private previousHighlightedGroup: string | null = null;
    private previousHighlightedClass: string[] | null = null;
    private previousSelectedBlock: [] | null = null;

    public constructor(
        svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>, 
        dataStructureSet: DataStructureSet, 
        transcriptViewerRef: React.RefObject<TranscriptViewerMethods>
    ) {
        super(dataStructureSet, transcriptViewerRef);
        this.topicGuideCP6GSelection = svgSelection.append('g');
    
        // Redux 상태 변경 시 update 호출
        store.subscribe(() => {
            const currentHighlightedGroup = store.getState().highlight.highlightedGroup;
            const currentHighlightedClasses = store.getState().classHighLight.highlightedClasses; // 변경된 부분
            const currentSelectedBlock = store.getState().similarityBlockSelect.selectedBlock;
    
            //@ts-ignore
            if (!_.isEqual(this.previousHighlightedGroup, currentHighlightedGroup)) {
                this.previousHighlightedGroup = currentHighlightedGroup;
                this.update();
            }
    
            //@ts-ignore
            if (!_.isEqual(this.previousHighlightedClass, currentHighlightedClasses)) { // 변경된 부분
                this.previousHighlightedClass = currentHighlightedClasses;
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
        const { highlightedClasses } = store.getState().classHighLight;
        const selectedBlock = store.getState().similarityBlockSelect.selectedBlock;

        const classMapping: { [key: string]: string } = {
            st22: 'PHR',
            st21: 'LJS',
            st19: 'KJD',
            st20: 'JKT',
        };

        const keywords: Record<string, string[]> = {
          'PROS': ['KJD', 'JKT'],
          'CONS': ['LJS', 'PHR'],
        }

        let name1 = '', name2 = '', selected1 = '', selected2 = '', index1 = -1, index2 = -1;
        // @ts-ignore
        if ((Array.isArray(highlightedGroup) && highlightedGroup.includes("g6")) ||
          highlightedGroup === "g6") {
          
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
        this.topicGuideCP6GSelection.selectAll('circle, path, ellipse, text, tspan, line').style(
            'opacity',
            function (d: any) {
                const name =
                    d?.scriptIndex !== undefined
                        ? //@ts-ignore
                          this.dataStructureSet?.utteranceObjectsForDrawingManager?.utteranceObjectsForDrawing[d.scriptIndex]?.name
                        : null;

                if (Array.isArray(highlightedGroup)) {
                  //@ts-ignore
                  if (!highlightedGroup.includes("g6")) {
                      return 0.3;
                  }
                } else if (highlightedGroup && highlightedGroup !== "g6") {
                    return 0.3;
                }
                return 1;
            }.bind(this)
        );

        const lineGroups = this.topicGuideCP6GSelection
            .selectAll('g.CP6Line')
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
                "translate(-775, 65) scale(-0.88, 0.88) rotate(135)"
              );

        const groups = this.topicGuideCP6GSelection
            .selectAll('g') // 기존 요소도 선택
            .data(pathsData)
            //className st22: PHR, st17: 진행자, st21: LJS, st19: KJD, st20: JKT
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
                          
                          if (highlightedClasses.includes('LJS') || highlightedClasses.includes('PHR') || 
                              highlightedClasses.includes('KJD') || highlightedClasses.includes('JKT')) {
                              if (!highlightedClasses.includes(mappedClass)) {
                                  return 0.3;
                              } else {
                                  return 1;
                              }
                          } else if (highlightedClasses.includes('PROS') || highlightedClasses.includes('CONS')) {
                              const mappedKey1 = keywords['PROS'][0];
                              const mappedKey2 = keywords['CONS'][1];
                              
                              if (highlightedClasses.includes(mappedKey1) || highlightedClasses.includes(mappedKey2)) {
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
                        .style('opacity', (d) => {
                            if (Array.isArray(highlightedGroup)) {
                                //@ts-ignore
                                if (!highlightedGroup.includes("g6")) {
                                    return 0.3;
                                }
                            } else if (highlightedGroup && highlightedGroup !== "g6") {
                                return 0.3;
                            }

                            //@ts-ignore
                            const mappedClass = classMapping[d.className];

                            if (highlightedClasses.some(cls => ['LJS', 'PHR', 'KJD', 'JKT'].includes(cls))) {
                                if (!highlightedClasses.includes(mappedClass)) {
                                    return 0.3;
                                } else {
                                    return 1;
                                }
                            } else if (highlightedClasses.some(cls => ['PROS', 'CONS'].includes(cls))) {
                                const mappedKey1 = keywords['PROS'][0];
                                const mappedKey2 = keywords['CONS'][1];
                                if (highlightedClasses.includes(mappedKey1) || highlightedClasses.includes(mappedKey2)) {
                                    return 1;
                                }
                            }
                            return 0.3;
                        });
                    return update;
                },
                (exit) => exit.remove() // 필요시 제거
            );

        groups.attr('transform', (d, i) => {
            const x = -780;
            const y = 65;
            const r = 135; // 회전 각도 (도)
            //rotate(-135) scale(-1, 1)
            return `translate(${x},${y}) scale(-0.88, 0.88) rotate(${r})`;
        });

        const filteredPaths = groups.selectAll("path")
            .style("opacity", (d) => {
                const stParticipants: Record<string, string> = {
                    st22: 'PHR',
                    st17: 'JHJ',
                    st21: 'LJS', 
                    st19: 'KJD',
                    st20: 'JKT'
                };

                // 1. 특정 블록이 선택된 경우 (selectedBlock이 비어있지 않고, 특정 scriptIndex와 일치하는 경우)
                //@ts-ignore
                if (selectedBlock.length !== 0 && (index1 === d.scriptIndex || index2 === d.scriptIndex)) {
                    return 1;
                }

                if(Array.isArray(selectedBlock) && selectedBlock.length > 1){
                    //@ts-ignore
                    if (selectedBlock[1]?.length === 0 && Array.isArray(highlightedGroup) && highlightedGroup.includes("g6")) {
                        //@ts-ignore
                        if (highlightedClasses.includes(stParticipants[d.className])) {
                            return 1;
                        }
                        return 0.3;
                    }

                    //@ts-ignore
                    if (selectedBlock[1][0] === d.scriptIndex || selectedBlock[1][1] === d.scriptIndex) {
                        return 1;
                    }
                    return 0.3;
                }

                // 2. 선택된 블록이 없을 경우 기본 로직 처리
                if (selectedBlock.length === 0) {
                    // (1) 특정 클래스가 강조된 경우
                    if (highlightedClasses.length !== 0) {
                        if (highlightedClasses.includes('PROS')) {
                            //@ts-ignore
                            return ['st19', 'st20'].includes(d.className) ? 1 : 0.3; // KJD, JKT
                        }
                        if (highlightedClasses.includes('CONS')) {
                            //@ts-ignore
                            return ['st22', 'st21'].includes(d.className) ? 1 : 0.3; // PHR, LJS
                        }
                        // (2) 개별 참가자가 강조된 경우
                        //@ts-ignore
                        return stParticipants[d.className] && highlightedClasses.includes(stParticipants[d.className]) ? 1 : 0.3;
                    }

                    // (3) 그룹 강조 여부 처리
                    //@ts-ignore
                    if (Array.isArray(highlightedGroup) && highlightedGroup.includes("g6")) {
                        return 1;
                    } 
                    if (highlightedGroup === "g6" || !highlightedGroup) {
                        return 1;
                    }
                    return 0.3;
                }

                return 0.3;
            });

        CP6Data.forEach((groupData, i) => {
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
            const group = this.topicGuideCP6GSelection
                .append('g')
                .attr('class', groupData.class) // 클래스별로 그리도록!, 그리고 여기서 타입별로 또 그리게하면 됨.
                .attr('transform', () => {
                    const x = -780;
                    const y = 65;
                    const r = 135; // 회전 각도 (도)
                    //rotate(-135) scale(-1, 1)
                    return `translate(${x},${y}) scale(-0.88, 0.88) rotate(${r})`;
                });


                group.selectAll('*').style('opacity', () => {
                    if (Array.isArray(highlightedGroup)) {
                        //@ts-ignore
                        return highlightedGroup.includes("g6") ? 1 : 0.3;
                    }
                    return highlightedGroup === "g6" || !highlightedGroup ? 1 : 0.3;
                });
            
            let isHighlighted = 0;

            if (highlightedClasses.length > 0) {
                if (highlightedClasses.includes(groupType)) {
                    isHighlighted = 1;
                }
            }

            const selectedGroups = highlightedClasses.filter(cls => cls === 'PROS' || cls === 'CONS');
            if (selectedGroups.length > 0) {
                const validClasses = selectedGroups.flatMap(group => keywords[group]); // 선택된 찬반 그룹의 관련 참가자 추출
                if (validClasses.includes(groupType)) {
                    isHighlighted = 1;
                }
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
                        //@ts-ignore
                        .style('opacity', () => {
                            if (Array.isArray(highlightedGroup)) {
                              //@ts-ignore
                              if (!highlightedGroup.includes("g6")) {
                                return 0.3;
                              }
                            } else if (highlightedGroup && highlightedGroup !== "g6") {
                              return 0.3;
                            }
                            
                            if (Array.isArray(highlightedClasses) && highlightedClasses.length > 0) {
                              return opacityValue;
                            }
                            
                            return 1;
                          });
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
                        //@ts-ignore
                        .style('opacity', () => {
                            // 🔹 `highlightedGroup`과 `highlightedClasses`이 없을 경우 기본값 1 반환
                            if (!highlightedGroup && (!highlightedClasses || highlightedClasses.length === 0)) {
                                return 1;
                            }
                        
                            // 🔹 `selectedBlock`이 유효한지 확인 후 비교
                            //@ts-ignore
                            if (Array.isArray(selectedBlock) && selectedBlock.length > 1) {
                                //@ts-ignore
                                if(Array.isArray(selectedBlock[1]) && selectedBlock[1].length === 0 && highlightedGroup.includes("g6")){
                                    if (highlightedClasses.includes(element.className)) {
                                        return 1;
                                    }
                                    return 0.3;
                                }

                                //@ts-ignore
                                if(Array.isArray(selectedBlock[1]) && selectedBlock[1].length > 1){
                                    if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1])) {
                                        //@ts-ignore
                                        if (selectedBlock[1].length > 1 && 
                                            (selectedBlock[1][0] === element.onClick || selectedBlock[1][1] === element.onClick)) {
                                            return 1;
                                        }
                                    }
                                }
                                return 0.3;
                            }
                        
                            // 🔹 `highlightedGroup`이 배열이면 `includes("g6")`로 체크
                            if (Array.isArray(highlightedGroup)) {
                                //@ts-ignore
                                if (!highlightedGroup.includes("g6")) {
                                    return 0.3;
                                } else {
                                    return 1;
                                }
                            } else if (highlightedGroup && highlightedGroup !== "g6") {
                                return 0.3;
                            }
                        
                            // 🔹 `highlightedGroup`이 "g6"일 경우 처리
                            //@ts-ignore
                            if ((Array.isArray(highlightedGroup) && highlightedGroup.includes("g6")) || highlightedGroup === "g6") {
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
                        
                            // 🔹 `highlightedClasses`가 배열로 들어왔을 경우 `includes`로 체크
                            if (Array.isArray(highlightedClasses) && highlightedClasses.length > 0) {
                                if (highlightedClasses.includes(element.className)) {
                                    return opacityValue;
                                }
                            }

                            if (Array.isArray(highlightedClasses) && highlightedClasses.length > 0) {
                                // PROS/CONS 처리
                                if (highlightedClasses.includes('PROS')) {
                                    if (element.className === 'JKT' || element.className === 'KJD') {
                                        return 1;
                                    }
                                    return 0.3;
                                }
                                if (highlightedClasses.includes('CONS')) {
                                    if (element.className === 'LJS' || element.className === 'PHR') {
                                        return 1;
                                    }
                                    return 0.3;
                                }
                                // 개별 클래스 처리
                                if (highlightedClasses.includes(element.className)) {
                                    return opacityValue;
                                }
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
                        //@ts-ignore
                        .style('opacity', () => {
                            if (!highlightedGroup && (!highlightedClasses || highlightedClasses.length === 0)) {
                                return 1;
                            }
                        
                            // 🔹 selectedBlock이 배열인지 확인 후 비교
                            //@ts-ignore
                            if (Array.isArray(selectedBlock) && selectedBlock.length > 1) {
                                //@ts-ignore
                                if(Array.isArray(selectedBlock[1]) && selectedBlock[1].length === 0 && highlightedGroup.includes("g6")){
                                    if (highlightedClasses.includes(element.className)) {
                                        return 1;
                                    }
                                    return 0.3;
                                }

                                //@ts-ignore
                                if(Array.isArray(selectedBlock[1]) && selectedBlock[1].length > 1){
                                    if (Array.isArray(selectedBlock) && selectedBlock.length > 1 && Array.isArray(selectedBlock[1])) {
                                        //@ts-ignore
                                        if (selectedBlock[1].length > 1 && 
                                            (selectedBlock[1][0] === element.onClick || selectedBlock[1][1] === element.onClick)) {
                                            return 1;
                                        }
                                    }
                                }
                                return 0.3;
                            }
                        
                            // 🔹 highlightedGroup이 배열일 경우 "g6"이 포함되어 있는지 확인
                            if (Array.isArray(highlightedGroup)) {
                                //@ts-ignore
                                if (!highlightedGroup.includes("g6")) {
                                    return 0.3;
                                } else {
                                    return 1;
                                }
                            } else if (highlightedGroup && highlightedGroup !== "g6") {
                                return 0.3;
                            }
                        
                            // 🔹 highlightedGroup이 "g6"일 경우 처리
                            //@ts-ignore
                            if ((Array.isArray(highlightedGroup) && highlightedGroup.includes("g6")) || 
                                highlightedGroup === "g6") {
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
                        
                            // 🔹 highlightedClasses가 배열로 들어왔을 경우 `includes`로 체크
                            if (Array.isArray(highlightedClasses) && highlightedClasses.length > 0) {
                                if (highlightedClasses.includes(element.className)) {
                                    return opacityValue;
                                }
                            }

                            if (Array.isArray(highlightedClasses) && highlightedClasses.length > 0) {
                                // PROS/CONS 처리
                                if (highlightedClasses.includes('PROS')) {
                                    if (element.className === 'JKT' || element.className === 'KJD') {
                                        return 1;
                                    }
                                    return 0.3;
                                }
                                if (highlightedClasses.includes('CONS')) {
                                    if (element.className === 'LJS' || element.className === 'PHR') {
                                        return 1;
                                    }
                                    return 0.3;
                                }
                                // 개별 클래스 처리
                                if (highlightedClasses.includes(element.className)) {
                                    return opacityValue;
                                }
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
                      //@ts-ignore
                      .style('opacity', () => {
                        if (highlightedGroup) {
                            //@ts-ignore
                            if(element.content[0].text !== "여성 징집과" && element.content[0].text !== "봉급체계"
                                //@ts-ignore
                                && element.content[0].text !== "현 상황과 여성 모병방안은?"
                            ){
                                return 1;
                            }
                          if (Array.isArray(highlightedGroup)) {
                            //@ts-ignore
                            if (!highlightedGroup.includes("g6")) {
                              return 0.3;
                            }
                          } else if (highlightedGroup !== "g6") {
                            return 0.3;
                          }
                          return 1;
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
                              .attr('pointer-events', 'none')
                              //@ts-ignore
                              .text(content.text)
                              //@ts-ignore
                              .style('opacity', () => {
                                if (Array.isArray(highlightedGroup)) {
                                    if(selectedBlock){
                                        return 1;
                                    }
                                  //@ts-ignore
                                  if (!highlightedGroup.includes("g6")) {
                                    return 0.3;
                                  }
                                } else if (highlightedGroup && highlightedGroup !== "g6") {
                                  return 0.3;
                                }
                                return 1;
                              });      
                  
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