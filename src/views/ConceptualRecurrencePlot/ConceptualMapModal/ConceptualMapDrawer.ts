import { ParticipantDict } from "./../../../common_functions/makeParticipants";
/* eslint-disable no-unused-vars */
// import { participantDict } from "./../DataStructureMaker/index";
// NodeLink Diagram를 그리기 위한 정보가 들어있는 Drawer Data.ts
import * as d3 from "d3";
import { LinkDatum, NodeDatum, NodeLinkDict } from "./GraphDataStructureMaker";
import { ParticipantCount } from "./TermCountDictOfEGMaker";
import {
  makeArcDAttribute,
  makeDrag,
  makePieData,
  makeSimulation,
  SvgGSelectionsMaker,
} from "./ConceptualMapDrawerInternalFunctions";
import _ from "lodash";
// import tinygradient from "tinygradient";

export class ConceptualMapDrawer {
  private conceptualMapDivSelection: null | d3.Selection<
    d3.BaseType,
    unknown,
    HTMLElement,
    any
  > = null;
  private svgSelection: null | d3.Selection<
    SVGSVGElement,
    MouseEvent,
    HTMLElement,
    any
  > = null;
  private svgGSelection: null | d3.Selection<
    SVGGElement,
    DragEvent,
    HTMLElement,
    any
  > = null;
  private linksGSelection!: d3.Selection<
    SVGLineElement,
    LinkDatum,
    SVGGElement,
    unknown
  >;
  private nodesGSelection!: d3.Selection<
    SVGCircleElement,
    NodeDatum,
    SVGGElement,
    unknown
  >;
  private nodePiesGSelection!: d3.Selection<
    SVGGElement,
    NodeDatum,
    SVGGElement,
    unknown
  >;
  private circlesOfNodePiesGSelection!: d3.Selection<
    SVGGElement,
    NodeDatum,
    SVGGElement,
    unknown
  >;
  private nodeTextsGSelection!: d3.Selection<
    SVGTextElement,
    NodeDatum,
    SVGGElement,
    unknown
  >;
  private _nodeLinkDict: NodeLinkDict | null = null;
  private _nodeSizeMultiplier: number = 1;
  private _sentimentMarkerVisible: boolean = false;

  public constructor(
    private readonly coneptualMapDivClassName: string,
    private readonly svgWidth: number,
    private readonly svgHeight: number,
    private _participantDict: ParticipantDict
  ) {}

  public setGraphData(nodeLinkDict: NodeLinkDict) {
    this._nodeLinkDict = nodeLinkDict;
  }
  public setNodeSizeMultiplier(nodeSizeMultiplier: number) {
    this._nodeSizeMultiplier = nodeSizeMultiplier;
  }
  public setParticipantDict(participantDict: ParticipantDict) {
    this._participantDict = participantDict;
  }
  public set sentimentMarkerVisible(sentimentMarkerVisible: boolean) {
    this._sentimentMarkerVisible = sentimentMarkerVisible;
  }

  public updateGraph() {
    const nodes = this._nodeLinkDict!.nodes;
    const links = this._nodeLinkDict!.links;
    const nodeSizeMultiplier = this._nodeSizeMultiplier;
    // select root div
    if (this.conceptualMapDivSelection === null) {
      this.conceptualMapDivSelection = d3.select(this.coneptualMapDivClassName);
    }

    // make SVG and G elements
    if (this.svgSelection === null) {
      const svgGSelectionsMaker = new SvgGSelectionsMaker(
        this.conceptualMapDivSelection,
        this.svgWidth,
        this.svgHeight
      );
      this.svgSelection = svgGSelectionsMaker.appendSvgSelection();
      this.svgGSelection = svgGSelectionsMaker.appendSvgGSelection();
      this.linksGSelection = svgGSelectionsMaker.appendLinksGSelection();
      this.nodePiesGSelection = svgGSelectionsMaker.appendNodePiesGSelection();
      this.circlesOfNodePiesGSelection =
        svgGSelectionsMaker.appendCirclesOfNodePiesGSelection();
      this.nodesGSelection = svgGSelectionsMaker.appendNodesGSelection();
      this.nodeTextsGSelection = svgGSelectionsMaker.appendTextsGSelection();
    }

    const simulation = makeSimulation(nodes, links);

    // drag event listener
    const drag = makeDrag();

    function createParticipantData(nodes: NodeDatum[]) {
      const participantData = {};

      for (const node of nodes) {
        for (const participant of node.participantCounts) {
          const { name, count } = participant;
          //@ts-ignore
          if (!participantData[name]) {
            //@ts-ignore
            participantData[name] = [];
          }
          //@ts-ignore
          participantData[name].push({
            name: participant.name,
            id: node.id,
            count: count,
            time: node.time,
            sentiment: participant.sentiment,
          });
        }
      }

      // Sort each participant's data by count in descending order
      for (const name in participantData) {
        //@ts-ignore
        participantData[name].sort((a, b) => a.time - b.time);
      }

      return participantData;
    }

    // 이 함수를 사용하려면 아래와 같이 호출합니다:
    const sortedNodes = createParticipantData(nodes);
    console.log(sortedNodes);

    // Draw elements
    // Update drawing links
    this.linksGSelection = this.linksGSelection
      .data(links.filter((d, i) => d.source))
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.count))
      .text(
        (d) => `발화자: ${d.count}, 발화 횟수: ${d.id}, sentiment: ${d.source}`
      );

    // Update drawing nodePies
    this.nodePiesGSelection = this.nodePiesGSelection.data(nodes).join("g");
    const that = this;
    this.nodePiesGSelection.each(function (nodeDatum) {
      const arcsSelection = d3
        .select(this)
        .selectAll<SVGPathElement, d3.PieArcDatum<ParticipantCount>>("path")
        .data(
          makePieData(
            nodeDatum.participantCounts.filter(
              (participantCount) => participantCount.name !== "진행자1"
            )
          )
        )
        .join("path")
        .attr("fill", (d) => that._participantDict[d.data.name].color)
        .attr("d", (d) => makeArcDAttribute(d, nodeDatum, nodeSizeMultiplier));

      arcsSelection.each(function (arcDatum) {
        d3.select(this)
          .selectAll<HTMLTitleElement, d3.PieArcDatum<ParticipantCount>>(
            "title"
          )
          .data([arcDatum])
          .join("title")
          .text(
            (d) =>
              `발화자: ${d.data.name}, 발화 횟수: ${d.data.count}, sentiment: ${d.data.sentiment}`
          );
      });
    });

    // Update drawing sentiment_circles of nodePies
    this.circlesOfNodePiesGSelection = this.circlesOfNodePiesGSelection
      .data(nodes)
      .join("g");
    this.circlesOfNodePiesGSelection.each(function (nodeDatum) {
      const ratios = _.map(
        nodeDatum.participantCounts,
        (participantCount, i) => {
          const totalCount: number = _.reduce(
            nodeDatum.participantCounts,
            (reduced, participantCount) => reduced + participantCount.count,
            0
          );
          let frontCount: number = 0;
          for (let j = 0; j < i; j++) {
            frontCount += nodeDatum.participantCounts[j].count;
          }
          return (frontCount + participantCount.count / 2) / totalCount;
        }
      );
      const distance = Math.sqrt(nodeDatum.count * nodeSizeMultiplier) + 6;

      const sentimentCirclesSelection = d3
        .select(this)
        .selectAll("circle")
        .data(nodeDatum.participantCounts)
        .join("circle")
        .attr("r", 2)
        .attr(
          "cx",
          (d, i) => Math.cos(2 * Math.PI * ratios[i] - 0.5 * Math.PI) * distance
        )
        .attr(
          "cy",
          (d, i) => Math.sin(2 * Math.PI * ratios[i] - 0.5 * Math.PI) * distance
        )
        .attr("fill", (d) => {
          if (nodeDatum.id === "매출" && d.name === "이재명") {
            console.log("!", d);
          }

          if (d.count > 0 && that._sentimentMarkerVisible) {
            // 감성분석 결과 색상 조절.
            if (d.sentiment > 0.25 * 2) {
              return "rgb(79, 198, 66)"; // green: 긍정
            } else if (d.sentiment < -0.25 * 2) {
              return "rgb(196, 67, 67)"; // red: 부정
            } else {
              return "rgb(100, 100, 100)"; // 중립
            }
          } else {
            return "none";
          }
        });
    });

    // Update drawing nodes
    this.nodesGSelection = this.nodesGSelection
      .data(nodes)
      .join("circle")
      .attr("r", (d) => Math.sqrt(d.count * nodeSizeMultiplier))
      .attr("fill", "rgb(55, 55, 55)")
      .call(drag(simulation));

    this.nodeTextsGSelection = this.nodeTextsGSelection
      .data(nodes)
      .join("text")
      .attr("cy", (d) => d.count)
      .attr("font-size", "6px")
      .text((d, i) => `${d.id},${d.time}`);

    // Animate the graph
    simulation.on("tick", () => {
      this.linksGSelection
        .attr("x1", (d) => (d.source as NodeDatum).x!)
        .attr("y1", (d) => (d.source as NodeDatum).y!)
        .attr("x2", (d) => (d.target as NodeDatum).x!)
        .attr("y2", (d) => (d.target as NodeDatum).y!);

      this.nodePiesGSelection.attr(
        "transform",
        (d) => `translate(${d.x} ${d.y})`
      );
      this.circlesOfNodePiesGSelection.attr(
        "transform",
        (d) => `translate(${d.x} ${d.y})`
      );

      this.nodesGSelection.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      this.nodeTextsGSelection
        .attr("x", (d) => d.x!)
        .attr(
          "y",
          (d) => d.y! + 6 * Math.log(2 * nodeSizeMultiplier * d.count)
        );
    });
  }

  public removeDrawing() {
    if (this.conceptualMapDivSelection !== null) {
      this.svgSelection!.remove();
      this.svgSelection = null;
    }
  }
}
