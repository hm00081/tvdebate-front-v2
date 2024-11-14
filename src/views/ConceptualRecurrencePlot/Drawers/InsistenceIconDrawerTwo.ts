/* eslint-disable no-unused-vars */
/* 왼쪽 기준(columnUtteracne)을 그려주는 구간 */
/* left red icon*/
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
import { SentenceObject } from "../../../interfaces/DebateDataInterface";
import { wrapText } from "./D3Drawer";
export class InsistenceIconDrawerTwo {
  private _similarityBlock: SimilarityBlock | null = null;
  private _participantBlock: UtteranceObjectForDrawing | null = null;

  private readonly refutationIconGSlectionTwo!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    this.refutationIconGSlectionTwo = svgSelection
      .append("g")
      .style("visibility", "hidden");
    this.refutationIconGSlectionTwo
      .append("circle")
      .data(this.utteranceObjectsForDrawing)
      .attr("cx", 309.8)
      .attr("cy", 309.8)
      .attr(
        "r",
        (d) =>
          309.8 *
          (Math.cbrt(d.findDisagreeScale) *
            Math.cbrt(d.findDisagreeScale) *
            0.6 || 1)
      )
      .attr("fill", "#ED2933");
    this.refutationIconGSlectionTwo
      .append("path")
      .attr(
        "d",
        "M 379.6 474.8 c -10.7 10.6 -27.9 10.6 -38.5 0 l -0.8 -0.8 l -5.3 -5.4 l 0 0 c 7.5 7.5 7.5 19.7 0 27.2 s -19.7 7.5 -27.2 0 l -11 -11 c -31.4 -31.5 -62.8 -62.8 -94.3 -94.2 c -7.7 -7.6 -22.7 -17.9 -24.6 -29.4 c -0.6 -3.6 0.2 -7.3 0.4 -11 c 0.7 -16.1 -16.8 -27.4 -27.2 -37.8 l -25.6 -25.6 l 119.4 -119.4 l 53.6 53.6 c 1.5 1.5 7.5 -2.2 8.9 -2.8 c 4.4 -2 7 -2.9 11.7 -2.7 c 11.6 0.5 23.1 1.9 34.6 4 c 20.3 3.7 42 8 59.9 0.4 c 9.2 -3.9 16.8 -10.8 22.4 -19 c 4 -5.7 7.1 -12.1 12.1 -16.9 s 12.6 -7.7 19.7 -4.9 c 4.4 1.7 7.9 5.4 10.5 9.4 c 8.3 12.8 7.6 29.1 1.3 41.5 s -17.2 21.2 -28.7 28.8 c -8.8 5.8 -18.5 12.4 -25.8 20.4 c -9.5 10.4 -14.9 23.2 -8.7 39.7 l 23.2 23.2 l 14.3 14.3 c 10.5 10.5 11.2 28.4 0.5 39.1 c -10.5 10.6 -27.7 10.7 -38.3 0.2 l 4.6 4.6 c 10.1 10.5 10.1 27.2 0 37.8 c -10.4 10.8 -27.7 11.2 -38.5 0.8 l -2.5 -2.5 C 390.2 446.9 390.2 464.2 379.6 474.8 Z"
      )
      .attr("fill", "white");
  }

  public update() {
    if (this._participantBlock) {
      // Change this block to compare the participant's name instead of the similarityBlock
      if (
        this._participantBlock.name === "장경태" ||
        this._participantBlock.name === "김종대"
      ) {
        this.refutationIconGSlectionTwo.style("visibility", "hidden");
        this.refutationIconGSlectionTwo.selectAll("text").remove();
      } else {
        // Draw Red Icon
        // Rest of the code as before...
      }
    } else {
      this.refutationIconGSlectionTwo.style("visibility", "hidden");
      this.refutationIconGSlectionTwo.selectAll("text").remove();
    }
    //
    if (this._similarityBlock) {
      const colUtteranceObject = this.utteranceObjectsForDrawing[
        this._similarityBlock.columnUtteranceIndex
      ];
      const rowUtteranceObject = this.utteranceObjectsForDrawing[
        this._similarityBlock.rowUtteranceIndex
      ];
      // 모병제
      if (
        colUtteranceObject.name === "장경태" ||
        colUtteranceObject.name === "김종대"
      ) {
        this.refutationIconGSlectionTwo.style("visibility", "hidden");
        this.refutationIconGSlectionTwo.selectAll("text").remove();
      } else {
        // Draw Red Icon
        const iconXOffset = 7; // 원하는 고정된 X 오프셋 값을 설정
        const iconYOffset = -8; // 원하는 고정된 Y 오프셋 값을 설정
        const rotationAngle = 45; // 텍스트 회전 각도
        const defaultXPos =
          colUtteranceObject.beginningPointOfXY +
          colUtteranceObject.width / 2 +
          iconXOffset;
        const defaultYPos = colUtteranceObject.beginningPointOfXY + iconYOffset;
        const transformProperty = `translate(${defaultXPos}, ${defaultYPos}) scale(0.01, 0.01)`;
        const fixedTextOffset = 20; // 원하는 고정된 텍스트 오프셋 값을 설정
        const textXPos = defaultXPos + fixedTextOffset; // 노드 아이콘에 대한 텍스트의 X 위치를 조정합니다.
        const textYPos = defaultYPos + fixedTextOffset; // 바뀌게 될 아이콘 추가하여 넣기.
        this.refutationIconGSlectionTwo.selectAll("text").remove();
        this.refutationIconGSlectionTwo
          .attr("transform", transformProperty)
          .style("visibility", "visible");
        // 아래 라인 추가하여 기존 텍스트 요소를 삭제합니다
        this.refutationIconGSlectionTwo
          .attr("transform", transformProperty)
          .style("visibility", "visible")
          .data(this.utteranceObjectsForDrawing)
          .each((d, i) => {
            const data = colUtteranceObject.sentenceObjects;
            const countCompoundTerms = (
              data: SentenceObject[]
            ): { [key: string]: number } => {
              const result: { [key: string]: number } = {};

              data.forEach(({ compoundTermCountDict }) => {
                Object.keys(compoundTermCountDict).forEach((key) => {
                  if (result[key]) {
                    result[key] += compoundTermCountDict[key];
                  } else {
                    result[key] = compoundTermCountDict[key];
                  }
                });
              });
              return result;
            };
            const compoundTermCounts = countCompoundTerms(data);
            const compoundTermCount = Object.entries(compoundTermCounts).map(
              ([term, count]) => {
                return { term, count: parseInt(count as any) };
              }
            );
            // 내림차순 정렬
            const sortedCompoundTermCounts = compoundTermCount.sort(
              (a, b) => b.count - a.count
            );
            // 상위 8가지 키워드 추출
            const topFreqKeywords = sortedCompoundTermCounts.slice(0, 3);
            // 텍스트 요소에 키워드를 추가합니다.
            topFreqKeywords.forEach((keyword, index) => {
              this.refutationIconGSlectionTwo
                .append("text")
                .attr("font-size", "300px")
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr(
                  "transform",
                  `rotate(${rotationAngle}, ${textXPos}, ${textYPos}) scale(1, -1)`
                )
                .attr(
                  "x",
                  //@ts-ignore
                  this.refutationIconGSlectionTwo.node().getBoundingClientRect()
                    .x - 0
                )
                .attr(
                  "y",
                  //@ts-ignore
                  this.refutationIconGSlectionTwo.node().getBoundingClientRect()
                    .y +
                    380 * index +
                    380
                )
                .text(`· ${keyword.term}`);
            });
          });
      }
      //.attr("transform", "scale(0.1, -0.1) rotate(-45)");
    } else {
      this.refutationIconGSlectionTwo.style("visibility", "hidden");
      this.refutationIconGSlectionTwo.selectAll("text").remove();
    }
  }

  public set similarityBlock(similarityBlock: SimilarityBlock | null) {
    this._similarityBlock = similarityBlock;
  }

  public set participantBlock(
    participantBlock: UtteranceObjectForDrawing | null
  ) {
    this._participantBlock = participantBlock;
  }
}
