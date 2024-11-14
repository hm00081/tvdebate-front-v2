/* eslint-disable no-unused-vars */
import _ from "lodash";
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";

export class InsistenceMarkersDrawer {
  private readonly insistenceMarkerGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private _visible: boolean = false;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    private readonly similarityBlockGroup: SimilarityBlock[][],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    this.insistenceMarkerGSlection = svgSelection.append("g");
    // this.similarityBlockGroupTransposed = math.transpose(similarityBlockGroup);
  }

  public update() {
    const InsistenceCircleGSelection = this.insistenceMarkerGSlection
      .selectAll<SVGCircleElement, unknown>("circle")
      .data(this.utteranceObjectsForDrawing)
      .join("circle");

    InsistenceCircleGSelection.attr(
      "cx",
      (d) => d.beginningPointOfXY + d.width / 2
    )
      .attr("cy", (d) => d.beginningPointOfXY - 3)
      .attr("r", 2)
      .style("fill", (d, i) => {
        let hasRefutation: boolean = false;
        _.forEach(
          this.similarityBlockGroup,
          (rowSimilarityBlocks, rowIndex) => {
            if (rowIndex >= i && rowSimilarityBlocks[i].refutation) {
              hasRefutation = true;
              return false;
            }
          }
        );

        if (this._visible && d.insistence && hasRefutation) {
          return `rgba(79, 198, 66, 1)`;
        } else {
          return "none";
        }
      });
  }

  public set visible(visible: boolean) {
    this._visible = visible;
  }
}
