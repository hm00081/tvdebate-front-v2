/* eslint-disable no-unused-vars */
// 현재 사용 x
import React from "react";
import styles from "./Controllers.module.scss";
import { Checkbox } from "antd";
import { D3Drawer } from "../Drawers/D3Drawer";
import { changeStandardSimilarityScoreActionCreator } from "../../../redux/actions";
import { getStandardSimilarityScore } from "../../../redux/selectors";
import store from "../../../redux/store";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { CombinedState, ActionCreator } from "redux";
import { StandardSimilarityScoreState } from "../../../redux/reducers/standardSimilarityScoreReducer";
import { ChangeStandardSimilarityScoreAction } from "../../../redux/actions";
import SliderWithInput from "../../../components/SliderWithInput/SliderWithInput";
import CombinedEGsMaker from "../DataStructureMaker/CombinedEGsMaker";
import _ from "lodash";
import {
  DebateDataSet,
  EvaluationDataSet,
} from "../../../interfaces/DebateDataInterface";
import Evaluation from "../../../classes/Evaluation";
import {
  DataStructureManager,
  DataStructureSet,
} from "../DataStructureMaker/DataStructureManager";
interface ReduxProps {
  standardSimilarityScore: number;
  changeStandardSimilarityScore: ActionCreator<ChangeStandardSimilarityScoreAction>;
}
interface ComponentProps extends ReduxProps {
  maxSimilarityScore: number;
  d3Drawer: D3Drawer | null;
  combinedEGsMaker: CombinedEGsMaker | null;
  debateDataset: DebateDataSet | null;
  evaluationDataSet: EvaluationDataSet | null;
  dataStructureSet: DataStructureSet | null;
  dataStructureManager: DataStructureManager | null;
}
interface ComponentState {
  // Our Model's variables
  semanticConsistency: number;
  numberOfTopicGroups: number;
  groupSimilaritiesWeight: number;
  borderSimilaritiesWeight: number;
  pointSimilaritiesWeight: number;
  radioValueForMethods: string;
  otherConsistencyWeight: number;
  selfConsistencyWeight: number;
  refutationWeight: number;
  insistenceWeight: number;
  sentenceSentimentStandard: number;
  negativeSumStandard: number;
  positiveSumStandard: number;
  colUtteranceLongStandard: number;
  hostWeight: number;
  hostLongStandard: number;
  // evaluation's variables
  evaluation: Evaluation | null;
  numOfLCsegGroups: number;
  sentenceIndexesForSegmentsOfLCseg: number[];
  sentenceIndexesOfSegmentsOfCSseg: number[];
}

export class Controllers extends React.Component<
  ComponentProps,
  ComponentState
> {
  constructor(props: ComponentProps) {
    // default controller state
    super(props);
    this.state = {
      semanticConsistency: 1000,
      numberOfTopicGroups: 7,
      groupSimilaritiesWeight: 1,
      borderSimilaritiesWeight: 0,
      pointSimilaritiesWeight: 0,
      radioValueForMethods: "group",
      otherConsistencyWeight: 1,
      selfConsistencyWeight: 1,
      refutationWeight: 2,
      insistenceWeight: 2,
      sentenceSentimentStandard: 0.25,
      negativeSumStandard: 0.5,
      positiveSumStandard: 0.5,
      colUtteranceLongStandard: 100,
      hostWeight: 1,
      hostLongStandard: 100,
      evaluation: null,
      numOfLCsegGroups: 5,
      sentenceIndexesForSegmentsOfLCseg: [],
      sentenceIndexesOfSegmentsOfCSseg: [],
    };
  }

  // render() {
  //   return (
  //     <div
  //       // style={{ backgroundColor: "gray" }}
  //       className={styles.controllersZone}
  //     >
  //       <div
  //         className={styles.verticalSpace}
  //         // style={{ marginTop: "100px" }}
  //       ></div>
  //       <Checkbox
  //         className={styles.checkbox}
  //         defaultChecked
  //         onChange={(event) => {
  //           this.props.d3Drawer!.similarityBlocksDrawer.coloringRebuttal =
  //             event.target.checked;
  //           this.props.d3Drawer!.insistenceMarkersDrawer.visible =
  //             event.target.checked;

  //           this.props.d3Drawer!.similarityBlocksDrawer.update();
  //           this.props.d3Drawer!.insistenceMarkersDrawer.update();
  //         }}
  //         style={{ fontWeight: "bold" }}
  //       >
  //         Coloring Refutation/Insistence
  //       </Checkbox>
  //       <div
  //         style={{
  //           fontSize: 11,
  //           fontWeight: "bold",
  //           marginTop: "10px",
  //           marginBottom: "5px",
  //         }}
  //       >
  //         Conditions of insistence & refutation Weight
  //       </div>
  //       <div className={styles.verticalSpace}></div>
  //       <div>Insistence (주장)</div>
  //       <SliderWithInput
  //         min={0}
  //         max={5}
  //         value={this.state.insistenceWeight}
  //         step={0.1}
  //         onChangeListener={(changedValue) => {
  //           this.props.dataStructureSet!.similarityBlockManager.insistenceWeight =
  //             changedValue;

  //           // const engagementGroups = this.props.combinedEGsMaker!.make();
  //           const topicGroups =
  //             this.props.combinedEGsMaker!.makeByNumOfSegments(
  //               this.state.numberOfTopicGroups
  //             );
  //           this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
  //           this.props.d3Drawer!.topicGroupsDrawer.update();

  //           // find most similarity in similarityBlocks
  //           this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
  //           this.props.d3Drawer!.similarityBlocksDrawer.update();

  //           this.setState({
  //             insistenceWeight: changedValue,
  //           });
  //         }}
  //       ></SliderWithInput>
  //       <div>Refutation (반박)</div>
  //       <SliderWithInput
  //         min={0}
  //         max={5}
  //         value={this.state.refutationWeight}
  //         step={0.1}
  //         onChangeListener={(changedValue) => {
  //           this.props.dataStructureSet!.similarityBlockManager.refutationWeight =
  //             changedValue;

  //           // const engagementGroups = this.props.combinedEGsMaker!.make();
  //           const topicGroups =
  //             this.props.combinedEGsMaker!.makeByNumOfSegments(
  //               this.state.numberOfTopicGroups
  //             );
  //           this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
  //           this.props.d3Drawer!.topicGroupsDrawer.update();

  //           // find most similarity in similarityBlocks
  //           this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
  //           this.props.d3Drawer!.similarityBlocksDrawer.update();

  //           this.setState({
  //             refutationWeight: changedValue,
  //           });
  //         }}
  //       ></SliderWithInput>

  //       <div
  //         style={{
  //           fontSize: 11,
  //           fontWeight: "bold",
  //           marginTop: "10px",
  //           marginBottom: "5px",
  //         }}
  //       >
  //         Conditions of Sentiment & Length of Text Weight
  //       </div>
  //       <div className={styles.smallControllerTitle}>Positive</div>
  //       <SliderWithInput
  //         min={0}
  //         max={5}
  //         value={this.state.positiveSumStandard}
  //         step={0.1}
  //         sliderWidth={104}
  //         onChangeListener={(changedValue) => {
  //           // this.props.dataStructureSet?.utteranceObjectsForDrawing[0].
  //           this.props.dataStructureSet!.utteranceObjectsForDrawingManager.positiveSumStandard =
  //             changedValue;
  //           this.props.dataStructureSet!.similarityBlockManager.positiveSumStandard =
  //             changedValue;

  //           // make topic_segments
  //           const topicGroups =
  //             this.props.combinedEGsMaker!.makeByNumOfSegments(
  //               this.state.numberOfTopicGroups
  //             );

  //           // draw topic_segments
  //           this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
  //           this.props.d3Drawer!.topicGroupsDrawer.update();

  //           // draw similarity_blocks
  //           this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
  //           this.props.d3Drawer!.similarityBlocksDrawer.update();

  //           this.props.d3Drawer!.insistenceMarkersDrawer.update();

  //           this.setState({
  //             positiveSumStandard: changedValue,
  //           });
  //         }}
  //       ></SliderWithInput>
  //       <div className={styles.smallControllerTitle}>Negative</div>
  //       <SliderWithInput
  //         min={0}
  //         max={5}
  //         value={this.state.negativeSumStandard}
  //         step={0.1}
  //         sliderWidth={104}
  //         onChangeListener={(changedValue) => {
  //           // adjust weight of similarity_blocks
  //           this.props.dataStructureSet!.similarityBlockManager.negativeSumStandard =
  //             changedValue;

  //           // make topic_segments
  //           // const engagementGroups = this.props.combinedEGsMaker!.make();
  //           const topicGroups =
  //             this.props.combinedEGsMaker!.makeByNumOfSegments(
  //               this.state.numberOfTopicGroups
  //             );

  //           // draw topic_segments
  //           this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
  //           this.props.d3Drawer!.topicGroupsDrawer.update();

  //           // draw similarity_blocks
  //           this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
  //           this.props.d3Drawer!.similarityBlocksDrawer.update();

  //           this.setState({ negativeSumStandard: changedValue });
  //         }}
  //       ></SliderWithInput>
  //       <div className={styles.smallControllerTitle}>Text Length</div>
  //       <SliderWithInput
  //         min={0}
  //         max={300}
  //         value={this.state.colUtteranceLongStandard}
  //         sliderWidth={104}
  //         onChangeListener={(changedValue) => {
  //           // adjust weight of similarity_blocks
  //           this.props.dataStructureSet!.similarityBlockManager.colUtteranceLongStandard =
  //             changedValue;
  //           this.props.dataStructureSet!.utteranceObjectsForDrawingManager.colUtteranceLongStandard =
  //             changedValue;

  //           // make topic_segments
  //           // const engagementGroups = this.props.combinedEGsMaker!.make();
  //           const topicGroups =
  //             this.props.combinedEGsMaker!.makeByNumOfSegments(
  //               this.state.numberOfTopicGroups
  //             );

  //           // draw topic_segments
  //           this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
  //           this.props.d3Drawer!.topicGroupsDrawer.update();

  //           // draw similarity_blocks
  //           this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
  //           this.props.d3Drawer!.similarityBlocksDrawer.update();

  //           this.setState({
  //             colUtteranceLongStandard: changedValue,
  //           });
  //         }}
  //       ></SliderWithInput>
  //       <div className={styles.verticalSpace}></div>
  //       <div className={styles.verticalSpace}></div>
  //       <div className={styles.pkwd}></div>
  //       <div className={styles.verticalSpace}></div>
  //       <div className={styles.verticalSpace}></div>
  //     </div>
  //   );
  // }
}

const mapStateToProps: MapStateToProps<
  any,
  any,
  CombinedState<{
    standardSimilarityScoreReducer: StandardSimilarityScoreState;
  }>
> = (state) => {
  //@ts-ignore
  const standardSimilarityScore = getStandardSimilarityScore(store);
  return {
    standardSimilarityScore,
  };
};
const mapDispatchToProps: MapDispatchToProps<any, any> = {
  changeStandardSimilarityScore: changeStandardSimilarityScoreActionCreator,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controllers);
