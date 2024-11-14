import _ from "lodash";
import { SimilarityBlock } from "../interfaces";
import { make1EngagementGroup as make1TopicGroup } from "./make1EngagementGroup";

export function makeManualTGs(
  totalSimilarityBlockGroup: SimilarityBlock[][],
  startRowIndexesForSplit: number[]
): SimilarityBlock[][][] {
  const manualTGs: SimilarityBlock[][][] = [];

  for (let i = 0; i < startRowIndexesForSplit.length; i++) {
    const startRowIndex = startRowIndexesForSplit[i];
    const endRowIndex =
      i < startRowIndexesForSplit.length - 1
        ? startRowIndexesForSplit[i + 1]
        : totalSimilarityBlockGroup.length;
    const topicGroup = make1TopicGroup(
      totalSimilarityBlockGroup,
      startRowIndex,
      endRowIndex
    );
    manualTGs.push(topicGroup);
  }

  return manualTGs;
}

export function makeManualMTGs(
  totalSimilarityBlockGroup: SimilarityBlock[][],
  startRowIndexesForSplit: number[]
): SimilarityBlock[][][] {
  const manualTGs: SimilarityBlock[][][] = [];

  for (let i = 0; i < startRowIndexesForSplit.length; i++) {
    const startRowIndex = startRowIndexesForSplit[i];
    const endRowIndex =
      i < startRowIndexesForSplit.length - 1
        ? startRowIndexesForSplit[i + 1]
        : totalSimilarityBlockGroup.length;
    const topicGroup = make1TopicGroup(
      totalSimilarityBlockGroup,
      startRowIndex,
      endRowIndex
    );
    manualTGs.push(topicGroup);
  }

  return manualTGs;
}

// export function getBasicIncomeManualSmallEGTitles(): string[] {
//   return [
//     "찬반 of 긴급재난지원금 경제적 효과",
//     "기본소득 정의 및 평가",
//     "보수진영에서 기본소득이 이슈화된 이유는?",
//     "안심소득 소개 및 이해과정",
//     "찬반(증세 및 조세저항) of 안심소득 vs 기본소득",
//     "찬반(증세,경제 효과) of 안심소득 vs 기본소득 in 이재명 vs 오세훈",
//     "현실적 방안인지 찬반 of 안심소득 vs 기본소득",
//     "기본소득, 안심소득의 기존 복지 제도 통합에 대해 서로들 오해하고 있음 => 서로 의견 주고 받음..",
//     "시청자 의견 소개",
//     "기본소득의 실현가능성 찬반",
//     "미래의 노동공급과 생존에 대한 서로 다른 복지정책의 접근",
//     "기본소득의 근로의욕 반대 의견 및 팩트체크",
//   ];
// }

export function getBasicIncomeManualMiddleEGTitles(): string[] {
  return [
    // "찬반 of 긴급재난지원금 경제적 효과",
    // "기본소득 정의 및 평가",
    // "안심소득 소개 및 이해과정",
    "안심소득 vs 기본소득의 찬반(증세, 조세저항, 경제 효과)대립",
    // "안심소득 vs 기본소득의 현실적 방안",
    "기본소득, 안심소득의 기존 복지 제도 통합에 대한 의견 대립",
    // "시청자 의견 소개",
    // "기본소득 실현가능방법 증세의 찬반",
    // "기본소득의 노동공급, 근로의욕에 대한 긍정 vs 부정",
  ];
}

export function getBasicIncomeManualBigEGTitles(): string[] {
  return [
    "찬반 of 긴급재난지원금 경제적 효과",
    "기본소득 정의 및 평가",
    "안심소득 소개 및 이해과정",
    "안심소득 vs 기본소득",
    "기본소득 실현가능방법 증세의 찬반",
    "기본소득의 노동공급, 근로의욕에 대한 긍정 vs 부정",
  ];
}

export function getInsistenceRefutationEGTitles(): string[] {
  return [
    "논쟁심화구긴1",
    "논쟁심화구긴2",
    "논쟁심화구긴3",
    "논쟁심화구긴4",
    "논쟁심화구긴5",
    "논쟁심화구긴6",
  ];
} // 논쟁 심화 구간 나눠주는 요소도 추가해야 사용자 입장에서 탐색이 더 쉽게 보일듯함.

export function getSatManualSmallEGTitles(): string[] {
  return [];
}

export function getSatManualMiddleEGTitles(): string[] {
  return [];
}

export function getSatManualBigEGTitles(): string[] {
  return [
    "정시확대 방침에 대한 참가자들의 의견소개",
    "전교조의 수시에 대한 입장(학생부교과전형) 및 (부정적)반응",
    "학생부종합전형 보완 vs 수능 정시 확대",
    "선생님들의 학종에 관한 역량 필요성 찬반",
    "사교육 문제에 대한 정시 vs 학종",
    "학생들의 혼란을 줄여줘야 하지 않겠느냐에 대한 의견",
    "모든 고등학교를 일반고 전환에 대한 의견",
    "이번 대입개편안에 대한 필수요소에 대해 각자의 의견",
  ];
}

export function getMilitaryManualSmallEGTitles(): string[] {
  return [
    "토론 시작 및 모병제 도입", // 0-18, 1
    //"Start the discussion and introduce all volunteer military system(AVMS)", // 1
    "쓰레기값",
    // "군대, 모병, 사람, 감군, 병력, 징병, 유지, 정예",
    "모병제, 병력 충원에 문제 없나?", // 24-58, 3
    //"All volunteer military system, a solution to recruitment?", // 3
    "쓰레기값",
    // "군대, 모병, 병사, 위협, 장교, 전문, 유지, 징병",
    "모병제, 질적 향상 및 간부확보 문제는?", // 73-106, 5
    //"AVMS, quality improvement, and cadre retention?", // 5
    "쓰레기값",
    // "모병, 국방예산, 국방, 군대, 유지, 여성, 예산, 병력",
    "국방 예산 이슈 및 토론 마무리", // 146-183, 7
    // "Defense budget issues and conclusion of debate", // 7
  ];
}

export function getMilitaryManualSmallEGOneTitles(): string[] {
  return [
    "토론 시작 및 모병제 도입", // 0-18, 1
    "쓰레기값",
  ];
}

export function getMilitaryManualMiddleEGTitles(): string[] {
  return [
    "인구절벽, 징병제에 미치는 영향", // 15-37, 2
    //"The population cliff and its impact on AVMS", // 2
    "쓰레기값",
    "모병제, 일자리 문제 해결책?", // 56-79, 4
    //"AVMS, a solution to the jobs problem?", // 4
    "쓰레기값",
    "여성 징집과 봉급체계", // 94-126, 6
    //"Female conscription and pay system", // 6
    "쓰레기값",
    "쓰레기값",
  ];
}

export function getMilitaryManualBigEGTitles(): string[] {
  return [
    "대논쟁구간",
    "대논쟁구간",
    "대논쟁구간",
    "대논쟁구간",
    "대논쟁구간",
    "대논쟁구간",
  ];
}

/**
 * Deprecated
 * @param conceptSimilarityMatrix
 * @param startUtteranceIndex
 * @param endUtteranceIndex
 */
export function make1EngagementGroupByUtteranceIndex(
  conceptSimilarityMatrix: SimilarityBlock[][],
  startUtteranceIndex: number,
  endUtteranceIndex: number
): SimilarityBlock[][] {
  return _.chain(conceptSimilarityMatrix)
    .slice(startUtteranceIndex, endUtteranceIndex - 1)
    .map((similarityBlocksIn1Row) => {
      return _.slice(
        similarityBlocksIn1Row,
        startUtteranceIndex,
        similarityBlocksIn1Row.length
      );
    })
    .value();
}
