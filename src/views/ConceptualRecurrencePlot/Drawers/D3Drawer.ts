/* eslint-disable no-unused-vars */
import { UncertainIconDrawer } from "./UncertainIconDrawer";
import { TermType } from "./../DataImporter";
import { DataStructureSet } from "../DataStructureMaker/DataStructureManager";
import { DebateDataSet } from "./../../../interfaces/DebateDataInterface";
import { SimilarityBlocksDrawer } from "./SimilarityBlocksDrawer"; // 유사도 노드
import { ParticipantBlocksDrawer } from "./ParticipantBlocksDrawer"; // 참가자 노드
import { UtteranceObjectForDrawing, SimilarityBlock } from "../interfaces";
import * as d3 from "d3";
import _ from "lodash";
import { TopicGroupsDrawer } from "./TopicGroupsDrawer";
import { CP1Drawer } from "./CirclePackingDrawers/CP1/CP1";
import { CP2Drawer } from "./CirclePackingDrawers/CP2/CP2";
import { CP3Drawer } from "./CirclePackingDrawers/CP3/CP3";
import { CP4Drawer } from "./CirclePackingDrawers/CP4/CP4";
import { CP5Drawer } from "./CirclePackingDrawers/CP5/CP5";
import { CP6Drawer } from "./CirclePackingDrawers/CP6/CP6";
import { CP7Drawer } from "./CirclePackingDrawers/CP7/CP7";
import { PlotChartDrawer } from "./PlotChartDrawers/PlotChart";
import { D3ZoomEvent, zoomTransform } from "d3";
import { InsistenceMarkersDrawer } from "./InsistenceMarkersDrawer";
import { RefutationIconDrawer } from "./RefutationIconDrawer";
import { InsistenceIconDrawer } from "./InsistenceIconDrawer";
import { InsistenceIconDrawerTwo } from "./InsistenceIconDrawerTwo";
import { RefutationIconDrawerTwo } from "./RefutationIconDrawerTwo";
import { TranscriptViewerMethods } from "../TranscriptViewer/TranscriptViewer";
import { SentenceObject } from "./../../../interfaces/DebateDataInterface";
export class D3Drawer {
  private readonly conceptRecurrencePlotDiv!: d3.Selection<
    HTMLDivElement,
    any,
    HTMLElement,
    any
  >;
  private readonly svgSelection!: d3.Selection<
    SVGSVGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private readonly svgGSelection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  public readonly participantBlocksDrawer: ParticipantBlocksDrawer;
  public readonly insistenceMarkersDrawer: InsistenceMarkersDrawer;
  public readonly refutationIconDrawer: RefutationIconDrawer;
  public readonly refutationIconDrawerTwo: RefutationIconDrawerTwo;
  public readonly insistenceIconDrawer: InsistenceIconDrawer;
  public readonly uncertainIconDrawer: InsistenceIconDrawer;
  public readonly insistenceIconDrawerTwo: InsistenceIconDrawerTwo;
  //public readonly uncertainIconDrawer: uncertainIconDrawer;
  public readonly similarityBlocksDrawer: SimilarityBlocksDrawer;
  public readonly topicGroupsDrawer: TopicGroupsDrawer;
  public readonly manualSmallTGsDrawer: TopicGroupsDrawer;
  public readonly manualMiddleTGsDrawer: TopicGroupsDrawer;
  public readonly manualBigTGsDrawer: TopicGroupsDrawer;
  public readonly manualPeopleTGsDrawer: TopicGroupsDrawer;
  public readonly lcsegEGsDrawer: TopicGroupsDrawer;
  public readonly CP1Drawer: CP1Drawer;
  public readonly CP2Drawer: CP2Drawer;
  public readonly CP3Drawer: CP3Drawer;
  public readonly CP4Drawer: CP4Drawer;
  public readonly CP5Drawer: CP5Drawer;
  public readonly CP6Drawer: CP6Drawer;
  public readonly CP7Drawer: CP7Drawer;
  public static allDrawers: D3Drawer[] = [];

  public readonly PlotChartDrawer: PlotChartDrawer;
  private transcriptViewerRef: React.RefObject<TranscriptViewerMethods> | null =
    null;
  private readonly svgWidth: number;
  private readonly svgHeight: number;
  private _zoomListener: ((transform: d3.ZoomTransform) => void) | null = null;
  private initialTransform: d3.ZoomTransform = d3.zoomIdentity.translate(260, -90).scale(0.95);
  public setupZoom(): void {
    const zoom = d3
      .zoom<SVGSVGElement, any>()
      .scaleExtent([0.8, 2.5])
      .on("zoom", (event) => {
        if (this._zoomListener) {
          this._zoomListener(event.transform);
        }
      });

    if (!this.svgSelection) {
      console.error("svgSelection is not defined");
      return;
    }
    this.svgSelection.call(zoom);
  }

  setupClickListener(
    transcriptViewerRef: React.RefObject<TranscriptViewerMethods>
  ) {
    this.similarityBlocksDrawer.clickListener = (
      e: MouseEvent,
      d: SimilarityBlock
    ) => {
      const rowIndex = d.rowUtteranceIndex;
      const colIndex = d.columnUtteranceIndex;

      const rowUtterance =
        this.dataStructureSet.utteranceObjectsForDrawingManager
          .utteranceObjectsForDrawing[rowIndex];
      const colUtterance =
        this.dataStructureSet.utteranceObjectsForDrawingManager
          .utteranceObjectsForDrawing[colIndex];

      // 키워드 빈도수 계산 함수
      const countCompoundTerms = (
        data: SentenceObject[]
      ): { [key: string]: number } => {
        const result: { [key: string]: number } = {};

        data.forEach(({ compoundTermCountDict }) => {
          Object.keys(compoundTermCountDict).forEach((key) => {
            result[key] = (result[key] || 0) + compoundTermCountDict[key];
          });
        });
        return result;
      };

      // 각 인덱스의 키워드 빈도수 계산
      const rowCompoundTerms = countCompoundTerms(rowUtterance.sentenceObjects);
      const colCompoundTerms = countCompoundTerms(colUtterance.sentenceObjects);

      // 각 인덱스의 상위 10개 키워드 추출
      const getTopCompoundTerms = (
        compoundTerms: { [key: string]: number },
        topN: number
      ) => {
        return Object.entries(compoundTerms)
          .sort((a, b) => b[1] - a[1])
          .slice(0, topN)
          .map(([term]) => term);
      };

      const rowTopTerms = getTopCompoundTerms(rowCompoundTerms, 30);
      const colTopTerms = getTopCompoundTerms(colCompoundTerms, 30);

      if (transcriptViewerRef.current) {
        transcriptViewerRef.current.scrollToIndex(colIndex);
        transcriptViewerRef.current.highlightKeywords(
          rowTopTerms,
          colTopTerms,
          rowIndex,
          colIndex
        );
      }
      this.similarityBlocksDrawer.setSingleBlockIndices(
        d.rowUtteranceIndex,
        d.columnUtteranceIndex
      );

      // setSingleBlockIndices에서 updateSelectedBlock()을 해주므로 중복되는 코드
      // this.similarityBlocksDrawer.updateSelectedBlock();
    };
  }

  public resetView(): void {
    if (!this.svgSelection) {
      console.error("svgSelection is not defined");
      return;
    }

    this.svgSelection.transition().duration(750).call(
      //@ts-ignore
      d3.zoom<SVGSVGElement, any>().transform,
      this.initialTransform
    );

    this.svgGSelection.attr("transform", this.initialTransform.toString());

    if (this._zoomListener) {
      this._zoomListener(this.initialTransform);
    }
  }

  public constructor(
    private readonly debateDataSet: DebateDataSet,
    private readonly dataStructureSet: DataStructureSet,
    private readonly termType: TermType,
    private readonly transcriptViewerRefs: React.RefObject<TranscriptViewerMethods>
  ) {

    D3Drawer.allDrawers.push(this);
    
    // declare variables
    this.conceptRecurrencePlotDiv = d3.select(".concept-recurrence-plot");
    //this.setupZoom();
    this.svgWidth = window.innerWidth - 330;
    this.svgHeight = window.innerHeight * 2;

    this.svgSelection = this.conceptRecurrencePlotDiv
      .select<SVGSVGElement>("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      // 전체 svg 영역
      .attr("transform", "scale(1, -1) rotate(-45)")
      .call(
        d3
          .zoom<SVGSVGElement, D3ZoomEvent<SVGSVGElement, any>>()
          .scaleExtent([0.8, 2.5]) // 예를 들어 최소 0.5배 축소부터 최대 2배 확대까지만 허용하도록 설정
          .on("zoom", (event) => {
            //@ts-ignore
            this.svgGSelection.attr("transform", () => event.transform);
            if (this._zoomListener) {
              this._zoomListener(event.transform);
            }
          })
      );
    
    setTimeout(() => {
      const initialTransform = d3.zoomIdentity.translate(260, -90).scale(0.95);

      this.svgSelection.call(
        //@ts-ignore
        (selection) => d3.zoom<SVGSVGElement, D3ZoomEvent<SVGSVGElement, any>>().transform(selection, initialTransform)
      );

      this.svgGSelection.attr("transform", initialTransform.toString());
  
      // 초기 zoomListener 호출
      if (this._zoomListener) {
        this._zoomListener(initialTransform);
      }
    }, 0);

    // 동시발생행렬 그려지는 구간
    this.svgGSelection = this.svgSelection.select(".svgG");

    this.participantBlocksDrawer = new ParticipantBlocksDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      dataStructureSet.participantDict,
      dataStructureSet.similarityBlockManager.similarityBlocks,
      debateDataSet.conceptMatrixTransposed,
      debateDataSet.keytermObjects,
      this.svgGSelection
    ); // 주장 marker drawer
    this.insistenceMarkersDrawer = new InsistenceMarkersDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      dataStructureSet.similarityBlockManager.similarityBlockGroup,
      this.svgGSelection
    ); // 불확실 아이콘 drawer
    this.refutationIconDrawer = new RefutationIconDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    ); // 반박 아이콘 drawer
    this.refutationIconDrawerTwo = new RefutationIconDrawerTwo(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    );
    this.insistenceIconDrawer = new InsistenceIconDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    );
    this.insistenceIconDrawerTwo = new InsistenceIconDrawerTwo(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    ); // 불확실 아이콘 drawer
    this.uncertainIconDrawer = new InsistenceIconDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    );

    this.similarityBlocksDrawer = new SimilarityBlocksDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      dataStructureSet.similarityBlockManager.similarityBlocks,
      dataStructureSet.similarityBlockManager.similarityBlockGroup,
      dataStructureSet.participantDict,
      this.svgGSelection
    ); // 유사도 구간 색지정

    this.similarityBlocksDrawer.mouseoverListener = (
      e: MouseEvent,
      d: SimilarityBlock
    ) => {
      if (d.colUtteranceName === "이준석" || d.colUtteranceName === "박휘락") {
        this.insistenceIconDrawerTwo.similarityBlock = d;
        this.refutationIconDrawer.similarityBlock = d;
      } else if (
        d.colUtteranceName === "김종대" ||
        d.colUtteranceName === "장경태"
      ) {
        this.insistenceIconDrawer.similarityBlock = d;
        this.refutationIconDrawerTwo.similarityBlock = d;
      } else if (
        d.rowUtteranceName === "이준석" ||
        d.rowUtteranceName === "박휘락"
      ) {
        this.refutationIconDrawerTwo.similarityBlock = d;
        this.insistenceIconDrawer.similarityBlock = d;
      } else if (
        d.rowUtteranceName === "김종대" ||
        d.rowUtteranceName === "장경태"
      ) {
        this.refutationIconDrawer.similarityBlock = d;
        this.insistenceIconDrawerTwo.similarityBlock = d;
      } else {
      }
      this.refutationIconDrawer.update();
      this.refutationIconDrawerTwo.update();
      this.insistenceIconDrawer.update();
      this.insistenceIconDrawerTwo.update();
      this.uncertainIconDrawer.update();
    };

    this.participantBlocksDrawer.clickListener = (
      e: MouseEvent,
      d: UtteranceObjectForDrawing
    ) => {
      const iconDrawers = [
        this.insistenceIconDrawer, // 박휘락,
        this.insistenceIconDrawerTwo, // 이준석,
        this.refutationIconDrawer, // 박휘락,
        this.refutationIconDrawerTwo, // 이준석,
      ];
      for (const iconDrawer of iconDrawers) {
        if (iconDrawer.participantBlock?.name === d.name) {
          iconDrawer.participantBlock = d;
          iconDrawer.update();
        }
      }
    };

    this.topicGroupsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.manualSmallTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.manualSmallTGsDrawer.color = "#000000"; // blue
    this.manualMiddleTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    //this.manualMiddleTGsDrawer.color = "#ff0001";
    this.manualMiddleTGsDrawer.color = "#000001";
    this.manualBigTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    // this.manualBigTGsDrawer.color = "#000000";
    this.manualBigTGsDrawer.color = "#026b02";
    this.manualPeopleTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.manualPeopleTGsDrawer.color = "#c";
    this.lcsegEGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.CP1Drawer = new CP1Drawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs
    );
    this.CP2Drawer = new CP2Drawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs
    );
    this.CP3Drawer = new CP3Drawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs
    );
    this.CP4Drawer = new CP4Drawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs
    );
    this.CP5Drawer = new CP5Drawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs
    );
    this.CP6Drawer = new CP6Drawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs
    );
    this.CP7Drawer = new CP7Drawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs
    );
    this.PlotChartDrawer = new PlotChartDrawer(
      this.svgGSelection,
      dataStructureSet,
      transcriptViewerRefs,
      this
    );
    this.lcsegEGsDrawer.color = "#cc9900"; // yellow color
    this.svgSelection.on("click", (event) => {
      _.forEach(
        dataStructureSet.similarityBlockManager.similarityBlocks,
        (similarityBlock) => {
          similarityBlock.visible = true;
        }
      );
      this.similarityBlocksDrawer.update();
      this.participantBlocksDrawer.update();
      this.insistenceIconDrawer.similarityBlock = null;
      this.insistenceIconDrawer.update();
      this.refutationIconDrawer.similarityBlock = null;
      this.refutationIconDrawer.update();
      this.uncertainIconDrawer.similarityBlock = null;
      this.uncertainIconDrawer.update(); // 불확실성 icon
      this.insistenceIconDrawerTwo.similarityBlock = null;
      this.insistenceIconDrawerTwo.update();
      this.refutationIconDrawerTwo.similarityBlock = null;
      this.refutationIconDrawerTwo.update();
    });
  }

  public centerConceptualRecurrentPlot() {
    const utteranceObjectsForDrawing =
      this.dataStructureSet.utteranceObjectsForDrawingManager
        .utteranceObjectsForDrawing;
    const ar = [];
    const arr = [];
    for (let i = 0; i < utteranceObjectsForDrawing.length; i++) {
      ar.push(utteranceObjectsForDrawing[i].width.toFixed(2));
      arr.push(utteranceObjectsForDrawing[i].name);
    }

    if (utteranceObjectsForDrawing.length !== 0) {
      const lastUtteranceObjectForDrawing =
        utteranceObjectsForDrawing[utteranceObjectsForDrawing.length - 1];

      const minusWidth =
        lastUtteranceObjectForDrawing.beginningPointOfXY +
        lastUtteranceObjectForDrawing.width;
      //console.log("minusWidth", minusWidth);
      const adjustedWidth = (this.svgWidth - minusWidth) / 2;

      const adjustedHeight = (this.svgHeight - minusWidth) / 2;
      //console.log(adjustedWidth, adjustedHeight);
      this.svgGSelection.attr(
        "transform",
        `translate(${adjustedWidth}, ${adjustedHeight})`
      );
      if (this._zoomListener) {
        const element = document.createElement("div");
        const transform = zoomTransform(element);
        this._zoomListener(transform.translate(adjustedWidth, adjustedHeight));
      }
      return { adjustedWidth, adjustedHeight };
    } else {
      console.warn("no utteranceObjectsForDrawing");
    }
  }

  public set zoomListener(zoomListener: (transform: d3.ZoomTransform) => void) {
    this._zoomListener = zoomListener;
  }

  public setupHoverHighlight() {
    d3.selectAll("text")
      .on("mouseover", (event, data) => (this.handleMouseOver(event), console.log(d3.selectAll("text"))))
      .on("mouseout", () => this.handleMouseOut());
  }

  private handleMouseOver(event: MouseEvent) {
    // 현재 D3Drawer의 SVG 그룹 강조
    d3.select(this.svgGSelection.node()).style("opacity", 1);

    // 나머지 D3Drawer의 SVG 그룹 흐리게 처리
    D3Drawer.allDrawers.forEach((drawer) => {
      if (drawer !== this) {
        d3.select(drawer.svgGSelection.node()).style("opacity", 0.2);
      }
    });
  }

  private handleMouseOut() {
    // 모든 D3Drawer의 SVG 그룹을 원래 상태로 복구
    D3Drawer.allDrawers.forEach((drawer) => {
      d3.select(drawer.svgGSelection.node()).style("opacity", 1);
    });
  }
}

export function wrapText(text: any, width: number) {
  text.each(function () {
    //@ts-ignore
    const text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      lineHeight = 1.1, // ems
      x = text.attr("x"), // get the x position
      y = text.attr("y"), // get the y position
      dyVal = text.attr("dy");

    let dy = parseFloat(dyVal); // Change const to let

    if (isNaN(dy)) dy = 0; // Add this line

    let line: string[] = [],
      lineNumber = 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x) // add the x position
        .attr("y", y) // add the y position
        .attr("dy", dy + "em"),
      word: string | null | undefined = undefined;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      //@ts-ignore
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x) // add the x position
          .attr("y", y) // add the y position
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
