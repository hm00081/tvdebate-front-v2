/* eslint-disable no-unused-vars */
// useRef와 forwardRef는 React에서 제공하는 훅과 API로,
//컴포넌트 내에서 DOM 요소나 React 요소에 직접 접근하거나,
// 부모 컴포넌트에서 자식 컴포넌트의 특정 함수를 호출
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./ConceptualMapModal.module.scss";
import { Modal } from "antd";
import { ConceptualMapDrawer } from "./ConceptualMapDrawer";
import { SimilarityBlock } from "../interfaces";
import { GraphDataStructureMaker } from "./GraphDataStructureMaker";
import * as math from "mathjs";
import _ from "lodash";
import ConceptualMapControllers from "./ConceptualMapControllers/ConceptualMapControllers";
import { ParticipantDict } from "../../../common_functions/makeParticipants";
import { UtteranceObject } from "../../../interfaces/DebateDataInterface";
import { TermType } from "../DataImporter";
import { NodeDatum } from "./GraphDataStructureMaker";

const modalContentWidth: number = 800;
const modalContentHeight: number = 600;
const conceptualMapDivClassName: string = "conceptual-map";

export interface ConceptualMapModalRef {
  openModal: (modalTitle: string, engagementGroup: SimilarityBlock[][]) => void;
}
interface ComponentProps {
  participantDict: ParticipantDict;
  utteranceObjects: UtteranceObject[];
  termUtteranceBooleanMatrixTransposed: number[][];
  termList: string[];
  termType: TermType;
}

function ConceptualMapModal(
  props: ComponentProps,
  ref: Ref<ConceptualMapModalRef>
) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [maxCooccurrence, setMaxCooccurrence] = useState<number>(0);
  const [standardTermCountToGenerateNode, setStandardTermCountToGenerateNode] =
    useState<number>(0);
  const [maxOfLinksPerNode, setMaxOfLinksPerNode] = useState<number>(3);
  const [showNodeNotHavingLinks, setShowNodeNotHavingLinks] =
    useState<boolean>(true);
  const [conceptualMapDrawer, setConceptualMapDrawer] =
    useState<ConceptualMapDrawer>();
  const [graphDataStructureMaker, setGraphDataStructureMaker] =
    useState<GraphDataStructureMaker>();

  useEffect(() => {
    const modalPadding = 24;
    const conrollerWidth = 200;
    setConceptualMapDrawer(
      new ConceptualMapDrawer(
        `.${conceptualMapDivClassName}`,
        modalContentWidth - modalPadding * 2 - conrollerWidth,
        modalContentHeight - modalPadding * 2,
        props.participantDict
      )
    );
  }, []); // 마운트 될때만 실행.

  useEffect(() => {
    if (conceptualMapDrawer) {
      conceptualMapDrawer.setParticipantDict(props.participantDict);
    }
  }, [props.participantDict]); // 참가자 dict는 의존성으로 계속 변경되야함, 각 주제별로 관리.
  // useImperativeHAndle: 자식 컴포넌트에서 부모 컴포넌트로 함수나 변수를 노출
  useImperativeHandle(ref, () => ({
    openModal: (modalTitle: string, engagementGroup: SimilarityBlock[][]) => {
      setModalVisible(true);
      setModalTitle(modalTitle);
      //console.log("engagementGroup", engagementGroup);
      conceptualMapDrawer!.removeDrawing();

      const graphDataStructureMaker = new GraphDataStructureMaker(
        engagementGroup,
        props.participantDict,
        props.utteranceObjects,
        props.termType
      );

      const cooccurrenceMatrixOfEG =
        graphDataStructureMaker.getCooccurrenceMatrixOfEG();
      //@ts-ignore
      const ceiledMedian = Math.ceil(math.mean(cooccurrenceMatrixOfEG));

      const nodeLinkDict = graphDataStructureMaker.generateNodesAndLinks(
        ceiledMedian,
        maxOfLinksPerNode,
        showNodeNotHavingLinks
      );
      const createNodeDictionary = (
        nodes: NodeDatum[]
      ): { [key: string]: number } => {
        const result: { [key: string]: number } = {};

        nodes.forEach((node) => {
          result[node.id] = node.count;
        });

        return result;
      };

      const sortedNodeDictionary = (nodeDictionary: {
        [key: string]: number;
      }): { term: string; count: number }[] => {
        const nodeArray = Object.entries(nodeDictionary).map(
          ([term, count]) => {
            return { term, count };
          }
        );

        const sortedNodeArray = nodeArray.sort((a, b) => b.count - a.count);

        return sortedNodeArray;
      };

      const nodeDictionary = createNodeDictionary(nodeLinkDict.nodes);
      const sortedNodeArray = sortedNodeDictionary(nodeDictionary);
      for (let i = 0; i < sortedNodeArray.length; i++) {
        console.log();
      }
      const termFreqKeywrods = sortedNodeArray.slice(0, 15);
      const emptyArr: string[] = [];
      termFreqKeywrods.forEach((eg, i) => {
        emptyArr.push(termFreqKeywrods[i].term);
      });

      conceptualMapDrawer!.setGraphData(nodeLinkDict);
      conceptualMapDrawer!.updateGraph();

      const maxCooccurrence = _.max(
        _.map(
          cooccurrenceMatrixOfEG,
          (cooccurrenceVector) => _.orderBy(cooccurrenceVector, [], ["desc"])[1] // TODO [0] or [1]
        )
      ) as number;

      setStandardTermCountToGenerateNode(ceiledMedian);
      setMaxCooccurrence(maxCooccurrence);
      setGraphDataStructureMaker(graphDataStructureMaker);
    },
  }));

  return (
    <Modal
      title={modalTitle}
      visible={modalVisible}
      width={modalContentWidth}
      bodyStyle={{ height: modalContentHeight }}
      onCancel={() => {
        // this.setState({ modalVisible: false });
        setModalVisible(false);
      }}
      maskClosable={false}
    >
      <div className={styles.conceptualMapModalContent} ref={modalRef}>
        <ConceptualMapControllers
          conceptualMapDrawer={conceptualMapDrawer}
          graphDataStructureMaker={graphDataStructureMaker}
          showNodeNotHavingLinks={showNodeNotHavingLinks}
          maxCooccurrence={maxCooccurrence}
          maxOfLinksPerNode={maxOfLinksPerNode}
          standardTermCount={standardTermCountToGenerateNode}
          standardTermCountSliderListener={(changedValue) => {
            setStandardTermCountToGenerateNode(changedValue);
          }}
          maxOfLinksPerNodeSliderListener={(changedValue) => {
            setMaxOfLinksPerNode(changedValue);
          }}
          showNodeNotHavingLinksCheckboxListener={(checked: boolean) => {
            setShowNodeNotHavingLinks(checked);
          }}
        ></ConceptualMapControllers>
        <div className={conceptualMapDivClassName}></div>
      </div>
    </Modal>
  );
}
// forwardRef: 부모 컴포넌트에서 자식 컴포넌트 안의 DOM element에 접근하려고 할 때
export default forwardRef(ConceptualMapModal) || ConceptualMapModal;
