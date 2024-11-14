/* eslint-disable no-unused-vars */
import _ from "lodash";
import { UtteranceObject } from "../../../interfaces/DebateDataInterface";
import { SimilarityBlock } from "../interfaces";
import { make1EngagementGroup } from "./make1EngagementGroup";

export default class CombinedEGsMaker {
  // TODO
  private readonly minEngagementGroupSize: number = 1;
  private _standardSemanticConsistency: number = 1000;
  private _groupSimilaritiesWeight: number = 1;
  private _lineSimilaritiesWeight: number = 0;
  private _pointSimilaritiesWeight: number = 0;

  constructor(
    private readonly similarityBlockGroup: SimilarityBlock[][],
    private readonly utteranceObjects: UtteranceObject[]
  ) {}
  /**
   * Maybe Depreacted
   * @returns
   */
  public make(): SimilarityBlock[][][] {
    // initiate engagementPoints
    _.forEach(this.similarityBlockGroup, (rowSimilarityLine) => {
      _.forEach(rowSimilarityLine, (similarityBlock) => {
        similarityBlock.engagementPoint = false;
      });
    });

    const engagementGroups = this.trySplit2EGs(
      this.similarityBlockGroup,
      this.minEngagementGroupSize,
      this._standardSemanticConsistency
    );
    return engagementGroups;
  }

  /**
   * Make topic segments by number_of_segments
   * @param numOfSegments
   * @returns
   */
  public makeByNumOfSegments(numOfSegments: number): SimilarityBlock[][][] {
    // initiate engagementPoints
    _.forEach(this.similarityBlockGroup, (rowSimilarityLine) => {
      _.forEach(rowSimilarityLine, (similarityBlock) => {
        similarityBlock.engagementPoint = false;
      });
    });

    // while (segmentCounting < numOfSegments)
    //   2 new zones to include (2 new topicGroups)
    //   1 old zone to delete (1 old topicGroup)
    //   existing zones (existing topicGroups)
    //   make new zones (new topicGroups)
    //   choose topic group from candidates
    //     : return old zone(old topicGroup), new zones(new topicGroups)
    //   segmentCounting++

    let topicGroups: SimilarityBlock[][][] = [this.similarityBlockGroup];

    while (topicGroups.length < numOfSegments) {
      const choosedDataSet = findNew2TopicGroups.call(
        this,
        topicGroups,
        this.minEngagementGroupSize
      );

      if (choosedDataSet !== null) {
        // make new topicGroups
        topicGroups = _.chain(topicGroups)
          .filter((topicGroup) => topicGroup !== choosedDataSet.oldTopicGroup)
          .concat(choosedDataSet.new2TopicGroups)
          .value();
      } else {
        break;
      }
    }

    return topicGroups;

    function findNew2TopicGroups(
      this: CombinedEGsMaker,
      topicGroups: SimilarityBlock[][][],
      minEngagementGroupSize: number
    ) {
      const topicGroupsCandidatesOfEachTop: SimilarityBlock[][][][] = [];
      const semanticConsistenciesOfEachTop: number[] = [];

      _.forEach(topicGroups, (topicGroup) => {
        const dataSetOfTopicGroupCandidates = getDataSetOfTopicGroupCandidates.call(
          this,
          topicGroup,
          minEngagementGroupSize
        );

        // find top topicGroupsCandidate & semanticConsistency
        const dataSetOfTopTopicGroupsCandidate = findTopTopicGroupsCandidate(
          dataSetOfTopicGroupCandidates.topicGroupsCandidates,
          dataSetOfTopicGroupCandidates.semanticConsistencies
        );

        if (dataSetOfTopTopicGroupsCandidate) {
          topicGroupsCandidatesOfEachTop.push(
            dataSetOfTopTopicGroupsCandidate.topicGroups
          );
          semanticConsistenciesOfEachTop.push(
            dataSetOfTopTopicGroupsCandidate.semanticConsistency
          );
        } else {
          topicGroupsCandidatesOfEachTop.push([]);
          semanticConsistenciesOfEachTop.push(0);
        }
      });
      //console.log(topicGroupsCandidatesOfEachTop);

      // find topicGroup from topicGroupsCandidatesOfEachTop
      if (semanticConsistenciesOfEachTop.length !== 0) {
        const maxValue = _.max(semanticConsistenciesOfEachTop);
        const indexOfMax = _.indexOf(semanticConsistenciesOfEachTop, maxValue);
        const new2TopicGroups = topicGroupsCandidatesOfEachTop[indexOfMax];
        const oldTopicGroup: SimilarityBlock[][] = topicGroups[indexOfMax];

        return {
          oldTopicGroup,
          new2TopicGroups,
        };
      } else {
        return null;
      }

      function getDataSetOfTopicGroupCandidates(
        this: CombinedEGsMaker,
        topicGroup: SimilarityBlock[][],
        minEngagementGroupSize: number
      ) {
        const topicGroupsCandidates: SimilarityBlock[][][][] = [];
        const semanticConsistencies: number[] = [];

        const lastRowBlocks = topicGroup[topicGroup.length - 1];
        for (
          let i = minEngagementGroupSize;
          i < lastRowBlocks.length - minEngagementGroupSize;
          i++
        ) {
          // for each point, calculate semantic consistency of 2EGs
          const engagementGroup1 = make1EngagementGroup(topicGroup, 0, i + 1);
          const engagementGroup2 = make1EngagementGroup(
            topicGroup,
            i + 1,
            topicGroup.length
          );

          // Calulate with Together => Good Splits
          const scOfEG1 = this.getSumOfSimilarities({
            similarityBlockGroup: engagementGroup1,
            utteranceObjects: this.utteranceObjects,
            groupSimilaritiesWeight: this._groupSimilaritiesWeight,
            borderSimilaritiesWeight: this._lineSimilaritiesWeight,
            pointSimilaritiesWeight: this._pointSimilaritiesWeight,
          });
          const scOfEG2 = this.getSumOfSimilarities({
            similarityBlockGroup: engagementGroup2,
            utteranceObjects: this.utteranceObjects,
            groupSimilaritiesWeight: this._groupSimilaritiesWeight,
            borderSimilaritiesWeight: this._lineSimilaritiesWeight,
            pointSimilaritiesWeight: this._pointSimilaritiesWeight,
          });
          // const semanticConsistency =
          //   ((scOfEG1 + scOfEG2) /
          //     ((engagementGroup1.length * (engagementGroup1.length + 1) / 2) +
          //       (engagementGroup2.length * (engagementGroup2.length + 1)) / 2)) *
          //   ((topicGroup.length * (topicGroup.length + 1)) / 2);
          let semanticConsistency =
            ((scOfEG1 + scOfEG2) /
              (this.getNumberOfSimilartyBlocks(
                engagementGroup1,
                this._groupSimilaritiesWeight,
                this._lineSimilaritiesWeight,
                this._pointSimilaritiesWeight
              ) +
                this.getNumberOfSimilartyBlocks(
                  engagementGroup2,
                  this._groupSimilaritiesWeight,
                  this._lineSimilaritiesWeight,
                  this._pointSimilaritiesWeight
                ))) *
            this.getNumberOfSimilartyBlocks(
              topicGroup,
              this._groupSimilaritiesWeight,
              this._lineSimilaritiesWeight,
              this._pointSimilaritiesWeight
            );

          // for exception
          if (
            this._groupSimilaritiesWeight === 0 &&
            this._lineSimilaritiesWeight === 0 &&
            this._pointSimilaritiesWeight > 0
          ) {
            semanticConsistency *=
              (topicGroup.length * (topicGroup.length + 1)) / 2;
          }

          if (!isNaN(semanticConsistency)) {
            topicGroupsCandidates.push([engagementGroup1, engagementGroup2]);
            semanticConsistencies.push(semanticConsistency);
          }
        }

        return { topicGroupsCandidates, semanticConsistencies };
      }

      function findTopTopicGroupsCandidate(
        topicGroupsCandidates: SimilarityBlock[][][][],
        semanticConsistencies: number[]
      ) {
        const maxSemanticConsistency = _.max(semanticConsistencies);
        if (maxSemanticConsistency) {
          const indexOfMax = _.indexOf(
            semanticConsistencies,
            maxSemanticConsistency
          );

          const topTopicGroups = topicGroupsCandidates[indexOfMax];
          return {
            topicGroups: topTopicGroups,
            semanticConsistency: maxSemanticConsistency,
          };
        } else {
          return null;
        }
      }
    }
  }

  private trySplit2EGs(
    egCandidate: SimilarityBlock[][],
    minEngagementGroupSize: number,
    standardSemanticConsistency: number
  ): SimilarityBlock[][][] {
    // mark engagement_point
    const engagementPoint = egCandidate[egCandidate.length - 1][0];
    engagementPoint.engagementPoint = true;

    const engagementGroupsCandidates: SimilarityBlock[][][][] = [];
    const semanticConsistencies: number[] = [];

    const lastRowBlocks = egCandidate[egCandidate.length - 1];
    for (
      let i = minEngagementGroupSize;
      i < lastRowBlocks.length - minEngagementGroupSize;
      i++
    ) {
      // for each point, calculate semantic consistency of 2EGs
      const engagementGroup1 = make1EngagementGroup(egCandidate, 0, i + 1);
      const engagementGroup2 = make1EngagementGroup(
        egCandidate,
        i + 1,
        egCandidate.length
      );

      // Calulate with Together => Good Splits
      const scOfEG1 = this.getSumOfSimilarities({
        similarityBlockGroup: engagementGroup1,
        utteranceObjects: this.utteranceObjects,
        groupSimilaritiesWeight: this._groupSimilaritiesWeight,
        borderSimilaritiesWeight: this._lineSimilaritiesWeight,
        pointSimilaritiesWeight: this._pointSimilaritiesWeight,
      });
      const scOfEG2 = this.getSumOfSimilarities({
        similarityBlockGroup: engagementGroup2,
        utteranceObjects: this.utteranceObjects,
        groupSimilaritiesWeight: this._groupSimilaritiesWeight,
        borderSimilaritiesWeight: this._lineSimilaritiesWeight,
        pointSimilaritiesWeight: this._pointSimilaritiesWeight,
      });
      // const semanticConsistency =
      //   ((scOfEG1 + scOfEG2) /
      //     ((engagementGroup1.length * (engagementGroup1.length + 1) / 2) +
      //       (engagementGroup2.length * (engagementGroup2.length + 1)) / 2)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      let semanticConsistency =
        ((scOfEG1 + scOfEG2) /
          (this.getNumberOfSimilartyBlocks(
            engagementGroup1,
            this._groupSimilaritiesWeight,
            this._lineSimilaritiesWeight,
            this._pointSimilaritiesWeight
          ) +
            this.getNumberOfSimilartyBlocks(
              engagementGroup2,
              this._groupSimilaritiesWeight,
              this._lineSimilaritiesWeight,
              this._pointSimilaritiesWeight
            ))) *
        this.getNumberOfSimilartyBlocks(
          egCandidate,
          this._groupSimilaritiesWeight,
          this._lineSimilaritiesWeight,
          this._pointSimilaritiesWeight
        );

      // for exception
      if (
        this._groupSimilaritiesWeight === 0 &&
        this._lineSimilaritiesWeight === 0 &&
        this._pointSimilaritiesWeight > 0
      ) {
        semanticConsistency *=
          (egCandidate.length * (egCandidate.length + 1)) / 2;
      }

      if (semanticConsistency >= standardSemanticConsistency) {
        engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
        semanticConsistencies.push(semanticConsistency);
      }
    }

    let engagementGroups: SimilarityBlock[][][];
    if (semanticConsistencies.length !== 0) {
      const maxValue = _.max(semanticConsistencies);
      const indexOfMax = _.indexOf(semanticConsistencies, maxValue);
      const engagementGroupsCandidate = engagementGroupsCandidates[indexOfMax];

      const splittdEGs1 = this.trySplit2EGs(
        engagementGroupsCandidate[0],
        this.minEngagementGroupSize,
        standardSemanticConsistency
      );
      const splittdEGs2 = this.trySplit2EGs(
        engagementGroupsCandidate[1],
        this.minEngagementGroupSize,
        standardSemanticConsistency
      );
      engagementGroups = _.concat(splittdEGs1, splittdEGs2);
    } else {
      engagementGroups = [egCandidate];
    }

    return engagementGroups;
  }

  private trySplit2Groups(
    egCandidate: SimilarityBlock[][],
    minEngagementGroupSize: number,
    numOfSegments: number
  ): SimilarityBlock[][][] {
    // mark engagement_point
    const engagementPoint = egCandidate[egCandidate.length - 1][0];
    engagementPoint.engagementPoint = true;

    const engagementGroupsCandidates: SimilarityBlock[][][][] = [];
    const semanticConsistencies: number[] = [];

    const lastRowBlocks = egCandidate[egCandidate.length - 1];
    for (
      let i = minEngagementGroupSize;
      i < lastRowBlocks.length - minEngagementGroupSize;
      i++
    ) {
      // for each point, calculate semantic consistency of 2EGs
      const engagementGroup1 = make1EngagementGroup(egCandidate, 0, i + 1);
      const engagementGroup2 = make1EngagementGroup(
        egCandidate,
        i + 1,
        egCandidate.length
      );

      // Calulate with Together => Good Splits
      const scOfEG1 = this.getSumOfSimilarities({
        similarityBlockGroup: engagementGroup1,
        utteranceObjects: this.utteranceObjects,
        groupSimilaritiesWeight: this._groupSimilaritiesWeight,
        borderSimilaritiesWeight: this._lineSimilaritiesWeight,
        pointSimilaritiesWeight: this._pointSimilaritiesWeight,
      });
      const scOfEG2 = this.getSumOfSimilarities({
        similarityBlockGroup: engagementGroup2,
        utteranceObjects: this.utteranceObjects,
        groupSimilaritiesWeight: this._groupSimilaritiesWeight,
        borderSimilaritiesWeight: this._lineSimilaritiesWeight,
        pointSimilaritiesWeight: this._pointSimilaritiesWeight,
      });
      // const semanticConsistency =
      //   ((scOfEG1 + scOfEG2) /
      //     ((engagementGroup1.length * (engagementGroup1.length + 1) / 2) +
      //       (engagementGroup2.length * (engagementGroup2.length + 1)) / 2)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      let semanticConsistency =
        ((scOfEG1 + scOfEG2) /
          (this.getNumberOfSimilartyBlocks(
            engagementGroup1,
            this._groupSimilaritiesWeight,
            this._lineSimilaritiesWeight,
            this._pointSimilaritiesWeight
          ) +
            this.getNumberOfSimilartyBlocks(
              engagementGroup2,
              this._groupSimilaritiesWeight,
              this._lineSimilaritiesWeight,
              this._pointSimilaritiesWeight
            ))) *
        this.getNumberOfSimilartyBlocks(
          egCandidate,
          this._groupSimilaritiesWeight,
          this._lineSimilaritiesWeight,
          this._pointSimilaritiesWeight
        );

      // for exception
      if (
        this._groupSimilaritiesWeight === 0 &&
        this._lineSimilaritiesWeight === 0 &&
        this._pointSimilaritiesWeight > 0
      ) {
        semanticConsistency *=
          (egCandidate.length * (egCandidate.length + 1)) / 2;
      }

      // if (semanticConsistency >= standardSemanticConsistency) {
      engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
      semanticConsistencies.push(semanticConsistency);
      // }
    }

    return [];
  }

  private getSumOfSimilarities(p: {
    similarityBlockGroup: SimilarityBlock[][];
    utteranceObjects: UtteranceObject[];
    groupSimilaritiesWeight: number;
    borderSimilaritiesWeight: number;
    pointSimilaritiesWeight: number;
  }): number {
    let sum: number = 0;

    _.forEach(p.similarityBlockGroup, (rowSimilarityBlocks, rowIndex) => {
      _.forEach(rowSimilarityBlocks, (similarityBlock, colIndex) => {
        let groupLinePointWeight: number = 0;

        // group
        groupLinePointWeight += p.groupSimilaritiesWeight;

        // line
        if (rowIndex === p.similarityBlockGroup.length - 1 || colIndex === 0) {
          groupLinePointWeight += p.borderSimilaritiesWeight;
        }

        // point
        if (rowIndex === p.similarityBlockGroup.length - 1 && colIndex === 0) {
          groupLinePointWeight += p.pointSimilaritiesWeight;
        }

        sum +=
          groupLinePointWeight *
          similarityBlock.weight *
          similarityBlock.similarity;
      });
    });

    return sum;
  }

  private getNumberOfSimilartyBlocks(
    similarityBlockGroup: SimilarityBlock[][],
    groupSimilaritiesWeight: number,
    borderSimilaritiesWeight: number,
    pointSimilaritiesWeight: number
  ): number {
    // group
    const numberOfGroupSimilarityBlocks: number =
      groupSimilaritiesWeight *
      ((similarityBlockGroup.length * (similarityBlockGroup.length + 1)) / 2);

    // line
    const numberOfLineSimilarityBlocks: number =
      borderSimilaritiesWeight * (2 * similarityBlockGroup.length - 1);

    // point
    const numberOfPointSimilarityBlocks: number = pointSimilaritiesWeight * 1;

    return (
      numberOfGroupSimilarityBlocks +
      numberOfLineSimilarityBlocks +
      numberOfPointSimilarityBlocks
    );
  }

  public set standardSemanticConsistency(standardSemanticConsistency: number) {
    this._standardSemanticConsistency = standardSemanticConsistency;
  }
  public set groupSimilaritiesWeight(groupSimilaritiesWeight: number) {
    this._groupSimilaritiesWeight = groupSimilaritiesWeight;
  }
  public set lineSimilaritiesWeight(lineSimilaritiesWeight: number) {
    this._lineSimilaritiesWeight = lineSimilaritiesWeight;
  }
  public set pointSimilaritiesWeight(pointSimilaritiesWeight: number) {
    this._pointSimilaritiesWeight = pointSimilaritiesWeight;
  }
  public set borderSimilaritiesWeight(borderSimilaritiesWeight: number) {
    this._lineSimilaritiesWeight = borderSimilaritiesWeight;
  }
}
