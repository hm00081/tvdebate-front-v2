/* eslint-disable no-dupe-else-if */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./ConceptualRecurrencePlot.scss";
import _ from "lodash";
import { SimilarityBlock, UtteranceObjectForDrawing } from "./interfaces";
import { D3Drawer } from "./Drawers/D3Drawer";
import ConceptualMapModal, {
  ConceptualMapModalRef,
} from "./ConceptualMapModal/ConceptualMapModal";
import { useLocation } from "react-router-dom";
import TranscriptViewer, {
  TranscriptViewerMethods,
} from "./TranscriptViewer/TranscriptViewer";
// import { CombinedState } from "redux";
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
import HeaderTwoKor from "../Header/HeaderTwoKor";
import * as d3 from "d3";
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

  const conceptualMapModalRef = React.useRef<ConceptualMapModalRef>(null);
  // const standardSimilarityScore = useSelector<
  //   RootState<{
  //     standardSimilarityScoreReducer: StandardSimilarityScoreState;
  //   }>,
  //   number
  // >((state) => state.standardSimilarityScoreReducer.standardSimilarityScore);
  const standardSimilarityScore = useSelector(
    (state: RootState) =>
      state.standardSimilarityScoreReducer.standardSimilarityScore
  );
  const dispatch = useDispatch();
  const d3Container = useRef<SVGSVGElement>(null);
  // variables for tooltip
  const [mouseoveredUtterance, setMouseoveredUtterance] =
    useState<UtteranceObjectForDrawing | null>(null);
  const [mouseoveredSimilarity, setMouseoveredSimilarity] =
    useState<SimilarityBlock | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

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
        const dataImporter = new DataImporter(
          debateNameOfQuery,
          termTypeOfQuery
        );

        const dataStructureMaker = new DataStructureManager(
          debateNameOfQuery,
          dataImporter.debateDataSet!
        );
        // use dispatch
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
  }, []); // 마운트 될 때마다 dispath

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
      
      // settings of d3Drawer
      const d3Drawer = new D3Drawer(
        debateDataset,
        dataStructureSet,
        termTypeOfQuery,
        transcriptViewerRef
      );

      d3Drawer.zoomListener = (transform) => {
        setTransform(transform);
      };
      d3Drawer.participantBlocksDrawer.mouseoverListener = (
        mouseEvent,
        utteranceObjectForDrawing
      ) => {
        setMouseoveredUtterance(utteranceObjectForDrawing);
        setTooltipVisible(true);
      };
      d3Drawer.participantBlocksDrawer.mouseoutLisener = () => {};
      d3Drawer.similarityBlocksDrawer.mouseoverListener = (
        mouseEvent,
        similarityBlock
      ) => {
        setMouseoveredSimilarity(similarityBlock);
        setTooltipVisible(true);
      };
      d3Drawer.similarityBlocksDrawer.mouseoutLisener = () => {};
      // 클릭 리스너 설정
      d3Drawer.setupClickListener(transcriptViewerRef);
      d3Drawer.manualSmallTGsDrawer.topicGroups = manualSmallEGs;
      d3Drawer.manualSmallTGsDrawer.topicGroupTitles = manualSmallEGTitles;
      d3Drawer.manualSmallTGsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        conceptualMapModalRef.current?.openModal(
          `Manual Small Engagement Group ${engagementGroupIndex}`,
          engagementGroup
        );
      };
      d3Drawer.manualSmallTGsDrawer.visible = true;

      // Manual Middle Engagement Group Drawer's Settings
      d3Drawer.manualMiddleTGsDrawer.topicGroups = manualMiddleEGs;
      d3Drawer.manualMiddleTGsDrawer.topicGroupTitles = manualMiddleEGTitles;
      d3Drawer.manualMiddleTGsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        conceptualMapModalRef.current?.openModal(
          `Manual Middle Engagement Group ${engagementGroupIndex}`,
          engagementGroup
        );
      };
      d3Drawer.manualMiddleTGsDrawer.visible = true;

      d3Drawer.manualPeopleTGsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        conceptualMapModalRef.current?.openModal(
          `Manual People Engagement Group ${engagementGroupIndex}`,
          engagementGroup
        );
      };
      d3Drawer.centerConceptualRecurrentPlot();
      d3Drawer.participantBlocksDrawer.update();
      d3Drawer.insistenceMarkersDrawer.update();
      d3Drawer!.similarityBlocksDrawer.standardHighPointOfSimilarityScore =
        standardSimilarityScore;
      d3Drawer.similarityBlocksDrawer.update(); // 얘가 문제
      d3Drawer.CP1Drawer.update();
      d3Drawer.CP2Drawer.update();
      d3Drawer.CP3Drawer.update();
      d3Drawer.CP4Drawer.update();
      d3Drawer.CP5Drawer.update();
      d3Drawer.CP6Drawer.update();
      d3Drawer.CP7Drawer.update();
      d3Drawer.PlotChartDrawer.update(); // test
      d3Drawer.manualSmallTGsDrawer.update();
      d3Drawer.manualMiddleTGsDrawer.update();
      d3Drawer.manualPeopleTGsDrawer.update();
      setD3Drawer(d3Drawer);
    }
  }, [
    dataStructureManager,
    debateDataset,
    d3Container.current,
    transcriptViewerRef,
  ]);

  return (
    <div className="root-div" style={{ overflow: "hidden" }}>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <HeaderTwoKor isOpen={isOpen} setIsOpen={setIsOpen} />
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
          <svg
          // className="fullSvg"
          // ref={d3Container}
          // style={{ overflow: "visible" }}
          >
            {/* <g
            
              className="zoomable"
               transform={transform ? transform.toString() : undefined}
             > */}
            {/* <g className="svgG" ref={svgGRef}></g> */}
            <g className="svgG"></g>
            {/* </g> */}
          </svg>
        </div>
      </div>
      <TranscriptViewer
        isOpen={isOpen}
        dataStructureMaker={dataStructureManager}
        ref={transcriptViewerRef}
      ></TranscriptViewer>
      <ConceptualMapModal
        ref={conceptualMapModalRef}
        participantDict={
          dataStructureManager
            ? dataStructureManager.dataStructureSet.participantDict
            : {}
        }
        utteranceObjects={debateDataset ? debateDataset.utteranceObjects : []}
        termList={debateDataset ? debateDataset.termList : []}
        termUtteranceBooleanMatrixTransposed={
          debateDataset
            ? debateDataset.termUtteranceBooleanMatrixTransposed
            : []
        }
        termType={termTypeOfQuery}
      ></ConceptualMapModal>
    </div>
  );
}
export default ConceptualRecurrencePlot;
