import { Controllers } from "./Controllers";

class ControllersUtils {
  public selectMethodEasily(
    this: Controllers,
    groupSimilaritiesWeight: number,
    lineSimilaritiesWeight: number,
    pointSimilaritiesWeight: number
  ) {
    this.props.combinedEGsMaker!.groupSimilaritiesWeight = groupSimilaritiesWeight;
    this.props.combinedEGsMaker!.lineSimilaritiesWeight = lineSimilaritiesWeight;
    this.props.combinedEGsMaker!.pointSimilaritiesWeight = pointSimilaritiesWeight;

    // const engagementGroups = this.props.combinedEGsMaker!.make();
    const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
      this.state.numberOfTopicGroups
    );
    this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
    this.props.d3Drawer!.topicGroupsDrawer.update();
    this.props.d3Drawer!.similarityBlocksDrawer.update();

    this.setState({
      groupSimilaritiesWeight,
      borderSimilaritiesWeight: lineSimilaritiesWeight,
      pointSimilaritiesWeight,
    });
  }
}

export default new ControllersUtils();
