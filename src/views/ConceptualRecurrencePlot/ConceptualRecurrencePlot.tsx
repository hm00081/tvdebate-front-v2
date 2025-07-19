/* eslint-disable no-dupe-else-if */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./ConceptualRecurrencePlot.scss";
import { SimilarityBlock, UtteranceObjectForDrawing } from "./interfaces";
import { D3Drawer } from "./Drawers/D3Drawer";
import { useLocation } from "react-router-dom";
import TranscriptViewer, {
  TranscriptViewerMethods,
} from "./TranscriptViewer/TranscriptViewer";
import { RootState } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { StandardSimilarityScoreState } from "../../redux/reducers/standardSimilarityScoreReducer";
import {
  DebateDataSet,
  EvaluationDataSet,
} from "../../interfaces/DebateDataInterface";
import {
  DataStructureManager,
  DataStructureSet,
} from "./DataStructureMaker/DataStructureManager";
import DataImporter, { DebateName, TermType } from "./DataImporter";
import { CHANGE_STANDARD_SIMILARITY_SCORE } from "../../redux/actionTypes";
import CombinedEGsMaker from "./DataStructureMaker/CombinedEGsMaker";
import Header from "./../Header/Header";
import debateLegendSvg from '../Header/image/debateLegend.svg';
import * as d3 from "d3";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import _ from "lodash";

// TODO: 상태관리 Redux 사용하여 한곳에 관리하도록 추후 변경하기
function ConceptualRecurrencePlot() {
  const query = new URLSearchParams(useLocation().search);
  const debateNameOfQuery = query.get("debate_name") as DebateName;
  const termTypeOfQuery = query.get("term_type") as TermType;
  const svgGRef = useRef<SVGGElement>(null);
  const transcriptViewerRef = useRef<TranscriptViewerMethods>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [debateDataset, setDebateDataset] = useState<DebateDataSet | null>(
    null
  );
  const [dataStructureManager, setDataStructureManager] =
    useState<DataStructureManager | null>(null);
  const [dataStructureSet, setDataStructureSet] = useState<DataStructureSet>();

  const [evaluationDataSet, setEvaluationDataSet] =
    useState<EvaluationDataSet | null>(null);
  const [combinedEGsMaker, setCombinedEGsMaker] =
    useState<CombinedEGsMaker | null>(null); // relate similarity
  const [d3Drawer, setD3Drawer] = useState<D3Drawer | null>(null);

  // const conceptualMapModalRef = React.useRef<ConceptualMapModalRef>(null);
  const standardSimilarityScore = useSelector<
    RootState,
    number
  >((state) => state.standardSimilarityScoreReducer.standardSimilarityScore);
  const dispatch = useDispatch();
  const d3Container = useRef<SVGSVGElement>(null);
  // variables for tooltip
  const [mouseoveredUtterance, setMouseoveredUtterance] =
    useState<UtteranceObjectForDrawing | null>(null);
  const [mouseoveredSimilarity, setMouseoveredSimilarity] =
    useState<SimilarityBlock | null>(null);
  // const [transform, setTransform] = useState<d3.ZoomTransform | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  //250516
  const [initialTransform, setInitialTransform] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const transformWrapperRef = useRef<ReactZoomPanPinchRef | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const zoomLevels = [0.75, 0.9, 1.15, 1.4];
  const [zoomScale, setZoomScale] = useState(0.9);

  const EPSILON = 0.01;

  const isAtMaxZoom = (scale: number) =>
    scale >= zoomLevels[zoomLevels.length - 1] - EPSILON;
  
  const isAtMinZoom = (scale: number) =>
    scale <= zoomLevels[0] + EPSILON;  

  const getClosestZoomLevelIndex = (scale: number) => {
    let closestIndex = 0;
    let minDiff = Infinity;
  
    zoomLevels.forEach((level, index) => {
      const diff = Math.abs(scale - level);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });
  
    return closestIndex;
  };

  const handleZoomIn = () => {
    const currentIndex = getClosestZoomLevelIndex(zoomScale);
  
    // 아직 최대보다 살짝 작은 경우에는 바로 최대 확대
    if (zoomScale < zoomLevels[zoomLevels.length - 1] - EPSILON && transformWrapperRef.current && wrapperRef.current) {
      const nextScale = zoomLevels[Math.min(currentIndex + 1, zoomLevels.length - 1)];
      const bounds = wrapperRef.current.getBoundingClientRect();
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 5;
      const x = centerX * (1 - nextScale);
      const y = centerY * (1 - nextScale);
  
      setZoomScale(nextScale);
      transformWrapperRef.current.setTransform(x, y, nextScale);
    }
  };
  
  const handleZoomOut = () => {
  const currentIndex = getClosestZoomLevelIndex(zoomScale);

  if (zoomScale > zoomLevels[0] + EPSILON && transformWrapperRef.current && wrapperRef.current) {
    const prevScale = zoomLevels[Math.max(currentIndex - 1, 0)];
    const bounds = wrapperRef.current.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 5;
    const x = centerX * (1 - prevScale);
    const y = centerY * (1 - prevScale);

    setZoomScale(prevScale);
    transformWrapperRef.current.setTransform(x, y, prevScale);
  }
};

  useEffect(() => {
    if (dataStructureManager) {
      // dataStructureManager에서 가져온 데이터가 undefined가 아닌지 확인
      const dataSet = dataStructureManager.dataStructureSet;
      if (dataSet) {
        // undefined가 아닌 경우에만 상태 업데이트
        setDataStructureSet(dataSet);
      }
    }
  }, [dataStructureManager]);

  // Import Debate Data
  useEffect(() => {
    if (!dataStructureManager) {
      if (
        debateNameOfQuery === "sample" ||
        debateNameOfQuery === "기본소득" ||
        debateNameOfQuery === "정시확대" ||
        debateNameOfQuery === "모병제" ||
        debateNameOfQuery === "기본소득clipped" ||
        debateNameOfQuery === "정시확대clipped" ||
        debateNameOfQuery === "모병제clipped"
      ) {
        const dataImporter = new DataImporter(debateNameOfQuery, termTypeOfQuery);
  
        const dataStructureMaker = new DataStructureManager(
          debateNameOfQuery,
          dataImporter.debateDataSet!
        );
  
        const combinedEGsMaker = new CombinedEGsMaker(
          dataStructureMaker.dataStructureSet.similarityBlockManager.similarityBlockGroup,
          dataImporter.debateDataSet!.utteranceObjects
        );
  
        dispatch({
          type: CHANGE_STANDARD_SIMILARITY_SCORE,
          payload: {
            standardSimilarityScore:
              dataStructureMaker.dataStructureSet.maxSimilarityScore,
          },
        });
  
        setDebateDataset(dataImporter.debateDataSet);
        setDataStructureManager(dataStructureMaker);
        setCombinedEGsMaker(combinedEGsMaker);
        setEvaluationDataSet(dataImporter.evaluationDataSet);
      }
    }
  }, [
    dataStructureManager,
    debateNameOfQuery,
    termTypeOfQuery,
    dispatch,
  ]);
  

  // Control MapModal (각 토론 주제 클릭 시 모달창)
  useEffect(() => {
    if (dataStructureManager && debateDataset) {
      const dataStructureSet = dataStructureManager.dataStructureSet;
      const datasetOfManualEGs = dataStructureManager.datasetOfManualEGs;
      const manualMiddleEGs = datasetOfManualEGs.manualMiddleEGs;
      const manualMiddleEGTitles = datasetOfManualEGs.manualMiddleEGTitles;
      const manualSmallEGs = datasetOfManualEGs.manualSmallEGs;
      const manualSmallEGTitles = datasetOfManualEGs.manualSmallEGTitles;
  
      d3.select(svgGRef.current).selectAll("*").remove();
  
      const d3Drawer = new D3Drawer(
        debateDataset,
        dataStructureSet,
        termTypeOfQuery,
        transcriptViewerRef
      );
  
      // 클릭 리스너 설정
      d3Drawer.setupClickListener(transcriptViewerRef);
  
      d3Drawer.manualSmallTGsDrawer.topicGroups = manualSmallEGs;
      d3Drawer.manualSmallTGsDrawer.topicGroupTitles = manualSmallEGTitles;
      d3Drawer.manualMiddleTGsDrawer.topicGroups = manualMiddleEGs;
      d3Drawer.manualMiddleTGsDrawer.topicGroupTitles = manualMiddleEGTitles;
  
      requestAnimationFrame(() => {
        d3Drawer.participantBlocksDrawer.update();
        d3Drawer.similarityBlocksDrawer.standardHighPointOfSimilarityScore =
          standardSimilarityScore;
        d3Drawer.similarityBlocksDrawer.update();  
        d3Drawer.CP1Drawer.update();
        d3Drawer.CP2Drawer.update();
        d3Drawer.CP3Drawer.update();
        d3Drawer.CP4Drawer.update();
        d3Drawer.CP5Drawer.update();
        d3Drawer.CP6Drawer.update();
        d3Drawer.CP7Drawer.update();
  
        d3Drawer.PlotChartDrawer.update();
        d3Drawer.manualSmallTGsDrawer.update();
        d3Drawer.manualMiddleTGsDrawer.update();
        d3Drawer.manualPeopleTGsDrawer.update();
  
        setD3Drawer(d3Drawer);
      });
    }
  }, [dataStructureManager, debateDataset, d3Container.current, transcriptViewerRef]);

  return (
    <div className="root-div" style={{ overflow: "hidden" }}>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />  
      <div className="vis-area">
        <div
          className="concept-recurrence-plot"
          style={{ marginTop: "0px", overflow: "hidden" }}
        >
          <div
            style={{
              position: "fixed",
              overflow: "hidden",
              zIndex: "1000",
              fontWeight: "550",
              backgroundColor: "white",
              marginTop: "0px",
              fontSize: "14px",
              height: "25px",
              textAlign: "left",
              marginLeft: "15px",
            }}
          ></div>

          <TransformWrapper
            ref={transformWrapperRef}
            initialScale={0.9}
            minScale={0.75}
            maxScale={1.4}
            wheel={{ step: 0.25 }}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: true }}
            onZoomStop={({ state }) => {
              const currentScale = state.scale;
            
              // 가장 가까운 zoom level로 스냅
              const closest = zoomLevels.reduce((prev, curr) =>
                Math.abs(curr - currentScale) < Math.abs(prev - currentScale) ? curr : prev
              );
            
              // 허용 오차 이내면 정확히 맞춰줌
              if (Math.abs(closest - currentScale) < EPSILON) {
                setZoomScale(closest);
              } else {
                setZoomScale(currentScale); // 애매한 경우 그대로 유지
              }
            }}
          >
            <div ref={wrapperRef}>
              <TransformComponent>
                <svg
                  className="fullSvg"
                  ref={d3Container}
                  style={{
                    overflow: "visible",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <g className="svgG" ref={svgGRef}></g>
                </svg>
              </TransformComponent>
            </div>
          </TransformWrapper>
        </div>
      </div>
  
      <div className={`debateLegend ${isOpen ? "open" : "closed"}`}>
        <img src={debateLegendSvg} alt="Debate Legend" />
      </div>

      <div className={`zoom-button-container ${isOpen ? "open" : "closed"}`}>
        <button
          onClick={handleZoomIn}
          disabled={isAtMaxZoom(zoomScale)}
          style={{
            color: isAtMaxZoom(zoomScale) ? "#aaa" : "#000",
          }}
        >
          +
        </button>

        <button
          onClick={handleZoomOut}
          disabled={isAtMinZoom(zoomScale)}
          style={{
            color: isAtMinZoom(zoomScale) ? "#aaa" : "#000",
          }}
        >
          -
        </button>

      </div>
      <TranscriptViewer
        isOpen={isOpen}
        dataStructureMaker={dataStructureManager}
        ref={transcriptViewerRef}
      />
    </div>
  );  
}
export default ConceptualRecurrencePlot;