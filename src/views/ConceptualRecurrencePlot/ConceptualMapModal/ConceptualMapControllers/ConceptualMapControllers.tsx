import { Checkbox } from "antd";
import React, { useState } from "react";
import SliderWithInput from "../../../../components/SliderWithInput/SliderWithInput";
import { ConceptualMapDrawer } from "../ConceptualMapDrawer";
import { GraphDataStructureMaker } from "../GraphDataStructureMaker";
import styles from "./ConceptualMapControllers.module.scss";

interface ComponentProps {
  conceptualMapDrawer?: ConceptualMapDrawer;
  graphDataStructureMaker?: GraphDataStructureMaker;
  maxCooccurrence: number;
  standardTermCount: number;
  maxOfLinksPerNode: number;
  showNodeNotHavingLinks: boolean;
  standardTermCountSliderListener: (changedValue: number) => void;
  maxOfLinksPerNodeSliderListener: (changedValue: number) => void;
  showNodeNotHavingLinksCheckboxListener: (checked: boolean) => void;
}

const ConceptualMapControllers: React.FC<ComponentProps> = ({
  conceptualMapDrawer,
  graphDataStructureMaker,
  maxCooccurrence,
  standardTermCount,
  maxOfLinksPerNode,
  showNodeNotHavingLinks,
  standardTermCountSliderListener,
  maxOfLinksPerNodeSliderListener,
  showNodeNotHavingLinksCheckboxListener,
}) => {
  const [nodeSizeMultiplier, setNodeSizeMultiplier] = useState(1);
  // constructor(props: ComponentProps) {
  //   super(props);
  //   this.state = {
  //     nodeSizeMultiplier: 1,
  //   } ;
  // } not used anymore
  return (
    <div className={styles.conceptualMapControllers}>
      <div>Node Size Multiplier</div>
      <SliderWithInput
        min={1}
        max={10}
        value={nodeSizeMultiplier}
        onChangeListener={(changedValue) => {
          conceptualMapDrawer?.setNodeSizeMultiplier(changedValue);
          conceptualMapDrawer?.updateGraph();

          setNodeSizeMultiplier(changedValue);
        }}
      ></SliderWithInput>

      <div>Standard High Cooccurrence Count to Generate Links</div>
      <SliderWithInput
        min={0}
        max={maxCooccurrence}
        value={standardTermCount}
        onChangeListener={(changedValue) => {
          const nodesAndLinks = graphDataStructureMaker?.generateNodesAndLinks(
            changedValue,
            maxOfLinksPerNode,
            showNodeNotHavingLinks
          );
          if (nodesAndLinks) {
            conceptualMapDrawer?.setGraphData(nodesAndLinks);
            conceptualMapDrawer?.updateGraph();
          }
          standardTermCountSliderListener(changedValue);
        }}
      ></SliderWithInput>

      <div>Number of Links per a Node</div>
      <SliderWithInput
        min={0}
        max={10}
        value={maxOfLinksPerNode}
        onChangeListener={(changedValue) => {
          const nodesAndLinks = graphDataStructureMaker?.generateNodesAndLinks(
            standardTermCount,
            changedValue,
            showNodeNotHavingLinks
          );
          if (nodesAndLinks) {
            conceptualMapDrawer?.setGraphData(nodesAndLinks);
            conceptualMapDrawer?.updateGraph();
          }
          maxOfLinksPerNodeSliderListener(changedValue);
        }}
      ></SliderWithInput>

      <Checkbox
        className={styles.checkbox}
        defaultChecked={showNodeNotHavingLinks}
        onChange={(event) => {
          const checked = event.target.checked;
          const nodesAndLinks = graphDataStructureMaker?.generateNodesAndLinks(
            standardTermCount,
            maxOfLinksPerNode,
            checked
          );
          if (nodesAndLinks) {
            conceptualMapDrawer?.setGraphData(nodesAndLinks);
            conceptualMapDrawer?.updateGraph();
          }
          showNodeNotHavingLinksCheckboxListener(checked);
        }}
      >
        Nodes not having Link
      </Checkbox>

      <Checkbox
        className={styles.checkbox}
        onChange={(event) => {
          const checked = event.target.checked;
          if (conceptualMapDrawer) {
            conceptualMapDrawer.sentimentMarkerVisible = checked;
            conceptualMapDrawer.updateGraph();
          }
        }}
      >
        Sentiment Marker
      </Checkbox>
      {/* Delete Minimum Keyword + 세부 인터랙션이 필요한 곳에 대한 컴포넌트 만들 수 있다.*/}
      <Checkbox
        className={styles.checkbox}
        onChange={(event) => {
          const checked = event.target.checked;
          if (conceptualMapDrawer) {
            conceptualMapDrawer.sentimentMarkerVisible = checked;
            conceptualMapDrawer.updateGraph();
          }
        }}
      >
        Delete Min Count Keyword
      </Checkbox>

      <div style={{ marginBottom: 12 }}>
        checkbox for &apos;at least 1 link or not&apos;
      </div>
    </div>
  );
};

export default ConceptualMapControllers;
