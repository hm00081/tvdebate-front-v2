import { hexToRgb } from "../../../../common_functions/hexToRgb";
import { ParticipantDict } from "../../../../common_functions/makeParticipants";
import { SimilarityBlock, UtteranceObjectForDrawing } from "../../interfaces";
import { ColoringSelfSimilarities } from "../SimilarityBlocksDrawer";
import { finalColors, adjustedOpacityValues } from "./Color";

export function fillColorOfSimilarityBlock(
  similarityBlock: SimilarityBlock,
  utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
  conceptSimilarityMatrix: SimilarityBlock[][],
  participantDict: ParticipantDict,
  limitConstant: number,
  coloringSelfSimilarities: ColoringSelfSimilarities,
  coloringRebuttal: boolean
): string {
  let opacity: number = 0;
  const indexDiff = Math.abs(
    similarityBlock.columnUtteranceIndex - similarityBlock.rowUtteranceIndex
  ); // 발화자 간 거리.
  const realWeightValue = similarityBlock.weight * similarityBlock.similarity;

  const weightedSimilaritySample =
    ((realWeightValue / indexDiff) * 10) / 16.3560974414804;

  if (realWeightValue > limitConstant) {
    opacity = 1;
  } else {
    opacity = weightedSimilaritySample;
  }

  let color = `rgba(247, 191, 100, ${opacity * 0})`; // pyramid color

  const rowUtteranceObject =
    utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];

  // Update Coloring Self Similarities
  if (!similarityBlock.other) {
    switch (coloringSelfSimilarities) {
      case "oneColor":
        color = `rgba(198, 66, 66, ${opacity})`;
        break;
      case "participantColors":
        // eslint-disable-next-line no-case-declarations
        const rgb = hexToRgb(participantDict[rowUtteranceObject.name].color);
        color = `rgba(${rgb!.r}, ${rgb!.g}, ${rgb!.b}, ${opacity})`;
        // color = `rgba(198, 66, 66, ${opacity})`;
        break;
    }
  }
  function hexToRGBA(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (coloringRebuttal && similarityBlock.refutation) {


    let selectedColor;

    // adjust opacity
    const adjustedOpacity =
      (opacity /
        Math.sqrt(
          Math.abs(
            similarityBlock.columnUtteranceIndex -
              similarityBlock.rowUtteranceIndex
          )
        )) *
      50;

    let finalOpacity: number = 1;


    if (opacity >= 1) {
      selectedColor = finalColors[0];
    } else if (opacity > 0.57) {
      selectedColor = finalColors[1];
    } else if (opacity > 0.5) {
      selectedColor = finalColors[2];
    } else if (opacity > 0.4) {
      selectedColor = finalColors[3];
    } else if (opacity > 0.3) {
      selectedColor = finalColors[4];
    } else if (opacity > 0.2) {
      selectedColor = finalColors[5];
    } else if (opacity > 0.15) {
      selectedColor = finalColors[6];
    } else if (opacity >= 0.083147) {
      selectedColor = finalColors[7];
    } else if (opacity >= 0.059303) {
      selectedColor = finalColors[8];
    } else if (opacity >= 0.044627) {
      selectedColor = finalColors[9];
    } else if (opacity >= 0.036694) {
      selectedColor = finalColors[10];
    } else if (opacity >= 0.031783) {
      selectedColor = finalColors[11];
    } else if (opacity >= 0.028122) {
      selectedColor = finalColors[12];
    } else if (opacity >= 0.023232) {
      selectedColor = finalColors[13];
    } else if (opacity >= 0.020771) {
      selectedColor = finalColors[14];
    } else if (opacity >= 0.018342) {
      selectedColor = finalColors[15];
    } else if (opacity >= 0.014674) {
      selectedColor = finalColors[16];
    } else if (opacity >= 0.012841) {
      selectedColor = finalColors[17];
    } else if (opacity >= 0.011471) {
      selectedColor = finalColors[18];
    } else if (opacity >= 0.010447) {
      selectedColor = finalColors[19];
    } else if (opacity >= 0.008954) {
      selectedColor = finalColors[20];
    } else if (opacity >= 0.005116) {
      selectedColor = finalColors[21];
    } else if (opacity >= 0.003529) {
      selectedColor = finalColors[22];
    } else if (opacity >= 0.002281) {
      selectedColor = finalColors[23];
    } else selectedColor = finalColors[24];

    if (adjustedOpacity >= adjustedOpacityValues[0]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 1;
      } else {
        finalOpacity = 0.74;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[1]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.96;
      } else {
        finalOpacity = 0.7;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[2]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.92;
      } else {
        finalOpacity = 0.68;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[3]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.88;
      } else {
        finalOpacity = 0.64;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[4]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.84;
      } else {
        finalOpacity = 0.6;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[5]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.8;
      } else {
        finalOpacity = 0.56;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[6]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.76;
      } else {
        finalOpacity = 0.52;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[7]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.72;
      } else {
        finalOpacity = 0.48;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[8]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.68;
      } else {
        finalOpacity = 0.44;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[9]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.64;
      } else {
        finalOpacity = 0.4;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[10]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.6;
      } else {
        finalOpacity = 0.36;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[11]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.55;
      } else {
        finalOpacity = 0.31;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[12]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.5;
      } else {
        finalOpacity = 0.26;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[13]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.45;
      } else {
        finalOpacity = 0.21;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[14]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.43;
      } else {
        finalOpacity = 0.19;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[15]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.4;
      } else {
        finalOpacity = 0.16;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[16]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.36;
      } else {
        finalOpacity = 0.12;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[17]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.32;
      } else {
        finalOpacity = 0.08;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[18]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.25;
      } else {
        finalOpacity = 0.05;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[19]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.2;
      } else {
        finalOpacity = 0.04;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[20]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.16;
      } else {
        finalOpacity = 0.035;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[21]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.14;
      } else {
        finalOpacity = 0.033;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[22]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.11;
      } else {
        finalOpacity = 0.03;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[23]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.08;
      } else {
        finalOpacity = 0.025;
      }
    } else if (adjustedOpacity >= adjustedOpacityValues[24]) {
      if (
        similarityBlock.rowUtteranceIndex -
          similarityBlock.columnUtteranceIndex <
        33
      ) {
        finalOpacity = 0.06;
      } else {
        finalOpacity = 0.02;
      }
    } else {
      finalOpacity = 0.05;
    }
    const rgbaColor = hexToRGBA(selectedColor, finalOpacity * 0.9);
    color = rgbaColor;
  }
  return color;
}
