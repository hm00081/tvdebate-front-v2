/* eslint-disable no-unused-vars */
import { ParticipantDict } from "./../../../common_functions/makeParticipants";
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
import { Participant } from "../../../common_functions/makeParticipants";
import _ from "lodash";
import { KeytermObject } from "../../../interfaces/DebateDataInterface";
import { findTopValueIndexes } from "../../../common_functions/findTopValueIndexes";

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
      .style("fill", (d) => participantDict[d.name].color);

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
