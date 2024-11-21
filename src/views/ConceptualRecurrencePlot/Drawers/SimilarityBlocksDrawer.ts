/* eslint-disable no-unused-vars */
import _ from "lodash";
import * as d3 from "d3";
import { hexToRgb } from "../../../common_functions/hexToRgb";
import { ParticipantDict } from "../../../common_functions/makeParticipants";
import { SentenceObject } from "../../../interfaces/DebateDataInterface";
import { UtteranceObjectForDrawing, SimilarityBlock } from "../interfaces";
import { fillColorOfSimilarityBlock } from "./utils/SimilarityBlock";

export type ColoringSelfSimilarities =
  | "none"
  | "oneColor"
  | "participantColors";

export class SimilarityBlocksDrawer {
  private readonly conceptSimilarityRectGSelection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLCanvasElement,
    any
  >;

  private _coloringSelfSimilarities: ColoringSelfSimilarities = "none";
  private _showEngagementPoint = false;
  private _coloringRebuttal = true;
  private _standardHighPointOfSimilarityScore = 0;
  private _selectedBlockIndices: Array<[number, number]> = [];

  public _clickListener: ((e: MouseEvent, d: SimilarityBlock) => void) | null =
    null;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    private readonly similarityBlocks: SimilarityBlock[],
    private readonly similarityBlockGroup: SimilarityBlock[][],
    private readonly participantDict: ParticipantDict,
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLCanvasElement, any>
  ) {
    this.conceptSimilarityRectGSelection = svgSelection.append("g");
  }

  // Setter for standard similarity score
  public set standardHighPointOfSimilarityScore(value: number) {
    this._standardHighPointOfSimilarityScore = value;
  }

  // Setter for coloring self-similarities
  public set coloringSelfSimilarities(value: ColoringSelfSimilarities) {
    this._coloringSelfSimilarities = value;
  }

  // Setter for engagement point display
  public set showEngagementPoint(value: boolean) {
    this._showEngagementPoint = value;
  }

  // Setter for rebuttal coloring
  public set coloringRebuttal(value: boolean) {
    this._coloringRebuttal = value;
  }

  // Setter for click listener
  public setClickListener(
    listener: (e: MouseEvent, d: SimilarityBlock) => void
  ) {
    this._clickListener = listener;
  }

  private _mouseoverListener:
    | null
    | ((mouseEvent: MouseEvent, similarityBlock: SimilarityBlock) => void) =
    null;
  private _mouseoutListener: null | (() => void) = null;

  // Update the similarity blocks visualization
  public update() {
    const blocks = this.similarityBlocks;

    this.conceptSimilarityRectGSelection
      .selectAll<SVGRectElement, SimilarityBlock>("rect")
      .data(blocks)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => d.beginningPointOfX)
            .attr("y", (d) => d.beginningPointOfY)
            .attr("width", (d) => d.width)
            .attr("height", (d) => d.height)
            .style("fill", (d) => this.getFillColor(d))
            .style("stroke", (d) => this.getStrokeColor(d))
            .style("stroke-width", 3)
            .on("click", (event, d) => this.handleBlockClick(event, d))
            .append("title")
            .text((d) => this.createTooltipText(d)),
        (update) =>
          update
            .attr("x", (d) => d.beginningPointOfX)
            .attr("y", (d) => d.beginningPointOfY)
            .style("fill", (d) => this.getFillColor(d))
            .style("stroke", (d) => this.getStrokeColor(d)),
        (exit) => exit.remove()
      );
  }

  // Update selected blocks' styling
  public updateSelectedBlock() {
    this.conceptSimilarityRectGSelection
      .selectAll<SVGRectElement, SimilarityBlock>("rect")
      .style("stroke", (d) =>
        this.isSelected(d) ? "#fc2c34" : this.getStrokeColor(d)
      )
      .style("stroke-width", (d) => (this.isSelected(d) ? 1.45 : 0));
  }

  // Determine if a block is selected
  private isSelected(block: SimilarityBlock): boolean {
    return this._selectedBlockIndices.some(
      ([rowIndex, colIndex]) =>
        rowIndex === block.rowUtteranceIndex &&
        colIndex === block.columnUtteranceIndex
    );
  }

  // Get fill color for a block
  private getFillColor(block: SimilarityBlock): string {
    const isWithinRange =
      Math.abs(block.beginningPointOfX - block.beginningPointOfY) < 200;
    return isWithinRange
      ? fillColorOfSimilarityBlock(
          block,
          this.utteranceObjectsForDrawing,
          this.similarityBlockGroup,
          this.participantDict,
          this._standardHighPointOfSimilarityScore,
          this._coloringSelfSimilarities,
          this._coloringRebuttal
        )
      : "none";
  }

  // Get stroke color for a block
  private getStrokeColor(block: SimilarityBlock): string | null {
    return this._showEngagementPoint && block.engagementPoint
      ? "rgb(97, 64, 65)"
      : null;
  }

  // Handle block click events
  private handleBlockClick(event: MouseEvent, block: SimilarityBlock): void {
    this._selectedBlockIndices.push([
      block.rowUtteranceIndex,
      block.columnUtteranceIndex,
    ]);
    this.updateSelectedBlock();
    event.stopPropagation();

    if (this._clickListener) {
      this._clickListener(event, block);
    }
  }

  // Create tooltip text for a block
  private createTooltipText(block: SimilarityBlock): string {
    const argumentScore = this.calculateArgumentScore(block);
    return `findArgument: ${block.refutation || "none"},
            Leading Speaker Index: ${block.columnUtteranceIndex},
            Leading Speaker Name: ${block.colUtteranceName},
            Trailing Speaker Index: ${block.rowUtteranceIndex},
            Trailing Speaker Name: ${block.rowUtteranceName},
            argumentScore: ${argumentScore}`;
  }

  // Calculate the argument score
  private calculateArgumentScore(block: SimilarityBlock): number {
    return (
      (block.similarity * block.weight) /
      Math.sqrt(Math.abs(block.columnUtteranceIndex - block.rowUtteranceIndex))
    );
  }

  // Block selection management
  public setSingleBlockIndices(rowIndex: number, colIndex: number) {
    this._selectedBlockIndices = [[rowIndex, colIndex]];
    this.updateSelectedBlock();
  }

  public setMultipleBlockIndices(indices: [number, number][]) {
    this._selectedBlockIndices = [...this._selectedBlockIndices, ...indices];
    this.updateSelectedBlock();
  }

  public clearSelectedBlocks() {
    this._selectedBlockIndices = [];
    this.updateSelectedBlock();
  }

  public set mouseoverListener(
    mouseoverListener: (
      mouseEvent: MouseEvent,
      similarityBlock: SimilarityBlock
    ) => void
  ) {
    this._mouseoverListener = mouseoverListener;
  }

  public set mouseoutLisener(mouseoutListener: () => void) {
    this._mouseoutListener = mouseoutListener;
  }
}
