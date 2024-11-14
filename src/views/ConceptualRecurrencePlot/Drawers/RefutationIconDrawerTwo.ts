/* eslint-disable no-unused-vars */
/* 오른쪽 기준(rowUtteracne)을 그려주는 구간 */
/* right red icon*/
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
import { SentenceObject } from "../../../interfaces/DebateDataInterface";
import { wrapText } from "./D3Drawer";
export class RefutationIconDrawerTwo {
  private _visible: boolean = false;
  private _similarityBlock: SimilarityBlock | null = null;
  private _participantBlock: UtteranceObjectForDrawing | null = null;

  private readonly refutationIconGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    this.refutationIconGSlection = svgSelection
      .append("g")
      .style("visibility", "hidden");
    this.refutationIconGSlection
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
    this.refutationIconGSlection
      .append("path")
      .attr(
        "d",
        "M183,239.67l-2.47-2.47a27.25,27.25,0,0,1,38.53-38.53l4.65,4.65A27.13,27.13,0,0,1,223.9,165c10.64-10.64,28.53-10,39.08.54l14.28,14.28L300.5,203c16.55,6.21,29.32.81,39.71-8.72,8-7.31,14.54-17,20.35-25.82,7.57-11.46,16.51-22.41,28.82-28.66s28.66-7,41.46,1.32c4,2.6,7.67,6.16,9.39,10.54,2.77,7.08-.15,14.67-4.91,19.68s-11.15,8.17-16.85,12.12c-8.16,5.66-15.07,13.18-19,22.41-7.62,17.91-3.35,39.57.36,59.91a260.81,260.81,0,0,1,3.95,34.56c.23,4.69-.74,7.25-2.71,11.69-.61,1.39-4.27,7.44-2.79,8.93l53.56,53.56L332.48,493.93l-25.62-25.62c-10.4-10.39-21.69-27.88-37.84-27.17-3.66.16-7.34,1-10.95.37-11.49-1.91-21.77-16.94-29.42-24.62q-47-47.22-94.18-94.32l-11-11.05a19.23,19.23,0,0,1,27.2-27.2L145.25,279l-.76-.75A27.25,27.25,0,0,1,183,239.67Z"
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
        this.refutationIconGSlection.style("visibility", "hidden");
        this.refutationIconGSlection.selectAll("text").remove();
      } else {
        // Draw Red Icon
        // Rest of the code as before...
      }
    } else {
      this.refutationIconGSlection.style("visibility", "hidden");
      this.refutationIconGSlection.selectAll("text").remove();
    }
    //
    if (this._similarityBlock !== null) {
      const rowUtteranceObject = this.utteranceObjectsForDrawing[
        this._similarityBlock.rowUtteranceIndex
      ];
      if (
        rowUtteranceObject.name === "장경태" ||
        rowUtteranceObject.name === "김종대"
      ) {
        this.refutationIconGSlection.style("visibility", "hidden");
        this.refutationIconGSlection.selectAll("text").remove();
      } else {
        const iconXOffset = 7; // 원하는 고정된 X 오프셋 값을 설정
        const iconYOffset = -8; // 원하는 고정된 Y 오프셋 값을 설정
        const rotationAngle = 45;
        const defaultXPos =
          rowUtteranceObject.beginningPointOfXY +
          rowUtteranceObject.width / 2 +
          iconXOffset;
        const defaultYPos = rowUtteranceObject.beginningPointOfXY + iconYOffset;
        const transformProperty = `translate(${defaultXPos}, ${defaultYPos}) scale(0.01, 0.01)`;
        const fixedTextOffset = 20; // 원하는 고정된 텍스트 오프셋 값을 설정
        const textXPos = defaultXPos + fixedTextOffset; // 노드 아이콘에 대한 텍스트의 X 위치를 조정합니다.
        const textYPos = defaultYPos + fixedTextOffset;
        this.refutationIconGSlection.selectAll("text").remove();
        this.refutationIconGSlection
          .attr("transform", transformProperty)
          .style("visibility", "visible")
          .data(this.utteranceObjectsForDrawing)
          .each((d, i) => {
            const data = rowUtteranceObject.sentenceObjects;
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
              this.refutationIconGSlection
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
                  this.refutationIconGSlection.node().getBoundingClientRect()
                    .x - 0
                )
                .attr(
                  "y",
                  //@ts-ignore
                  this.refutationIconGSlection.node().getBoundingClientRect()
                    .y +
                    380 * index +
                    380
                )
                .text(`· ${keyword.term}`);
            });
          })
          .style("visibility", "visible");
      }
    } else {
      this.refutationIconGSlection.style("visibility", "hidden");
      this.refutationIconGSlection.selectAll("text").remove();
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
