import store from '../../../../redux/store';
import { finalColors, adjustedOpacityValues, hexToRGBA } from './SimlarityConstant';
import { ParticipantDict } from '../../../../common_functions/makeParticipants';
import { SimilarityBlock, UtteranceObjectForDrawing } from '../../interfaces';

export type ColoringSelfSimilarities = 'none' | 'oneColor' | 'participantColors';

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
  const { filter } = store.getState().matrixFilter;
  const [minOpacity, maxOpacity] = [filter[0] / 100, filter[1] / 100];
  const indexDiff = Math.abs(similarityBlock.columnUtteranceIndex - similarityBlock.rowUtteranceIndex);
  const realWeightValue = similarityBlock.weight * similarityBlock.similarity;
  const weightedSimilaritySample = ((realWeightValue / indexDiff) * 10) / 16.3560974414804;

  opacity = realWeightValue > limitConstant ? 1 : weightedSimilaritySample;
  let color = `rgba(247, 191, 100, ${opacity * 0})`;

  const rowUtteranceObject = utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];

  if (!similarityBlock.other) {
    switch (coloringSelfSimilarities) {
      case 'oneColor':
        color = `rgba(198, 66, 66, ${opacity})`;
        break;
      case 'participantColors':
        const rgb = participantDict[rowUtteranceObject.name]?.color;
        if (rgb) {
          const rgba = hexToRGBA(rgb, opacity);
          color = rgba;
        }
        break;
    }
  }

  if (coloringRebuttal && similarityBlock.refutation) {
    let selectedColor = finalColors[finalColors.length - 1];
    const adjustedOpacity = (opacity / Math.sqrt(indexDiff)) * 50;

    for (let i = 0; i < adjustedOpacityValues.length; i++) {
      if (adjustedOpacity >= adjustedOpacityValues[i]) {
        selectedColor = finalColors[Math.min(i, finalColors.length - 1)];
        break;
      }
    }

    let finalOpacity = 0.05;
    const diff = similarityBlock.rowUtteranceIndex - similarityBlock.columnUtteranceIndex;

    const getOpac = (strong: number, weak: number) => (diff < 33 ? strong : weak);
    if (adjustedOpacity >= adjustedOpacityValues[0]) finalOpacity = getOpac(1, 0.74);
    else if (adjustedOpacity >= adjustedOpacityValues[1]) finalOpacity = getOpac(0.96, 0.7);
    else if (adjustedOpacity >= adjustedOpacityValues[2]) finalOpacity = getOpac(0.92, 0.68);
    else if (adjustedOpacity >= adjustedOpacityValues[3]) finalOpacity = getOpac(0.88, 0.64);
    else if (adjustedOpacity >= adjustedOpacityValues[4]) finalOpacity = getOpac(0.84, 0.6);
    else if (adjustedOpacity >= adjustedOpacityValues[5]) finalOpacity = getOpac(0.8, 0.56);
    else if (adjustedOpacity >= adjustedOpacityValues[6]) finalOpacity = getOpac(0.76, 0.52);
    else if (adjustedOpacity >= adjustedOpacityValues[7]) finalOpacity = getOpac(0.72, 0.48);
    else if (adjustedOpacity >= adjustedOpacityValues[8]) finalOpacity = getOpac(0.68, 0.44);
    else if (adjustedOpacity >= adjustedOpacityValues[9]) finalOpacity = getOpac(0.64, 0.4);
    else if (adjustedOpacity >= adjustedOpacityValues[10]) finalOpacity = getOpac(0.6, 0.36);
    else if (adjustedOpacity >= adjustedOpacityValues[11]) finalOpacity = getOpac(0.55, 0.31);
    else if (adjustedOpacity >= adjustedOpacityValues[12]) finalOpacity = getOpac(0.5, 0.26);
    else if (adjustedOpacity >= adjustedOpacityValues[13]) finalOpacity = getOpac(0.45, 0.21);
    else if (adjustedOpacity >= adjustedOpacityValues[14]) finalOpacity = getOpac(0.43, 0.19);
    else if (adjustedOpacity >= adjustedOpacityValues[15]) finalOpacity = getOpac(0.4, 0.16);
    else if (adjustedOpacity >= adjustedOpacityValues[16]) finalOpacity = getOpac(0.36, 0.12);
    else if (adjustedOpacity >= adjustedOpacityValues[17]) finalOpacity = getOpac(0.32, 0.08);
    else if (adjustedOpacity >= adjustedOpacityValues[18]) finalOpacity = getOpac(0.25, 0.05);
    else if (adjustedOpacity >= adjustedOpacityValues[19]) finalOpacity = getOpac(0.2, 0.04);
    else if (adjustedOpacity >= adjustedOpacityValues[20]) finalOpacity = getOpac(0.16, 0.035);
    else if (adjustedOpacity >= adjustedOpacityValues[21]) finalOpacity = getOpac(0.14, 0.033);
    else if (adjustedOpacity >= adjustedOpacityValues[22]) finalOpacity = getOpac(0.11, 0.03);
    else if (adjustedOpacity >= adjustedOpacityValues[23]) finalOpacity = getOpac(0.08, 0.025);
    else if (adjustedOpacity >= adjustedOpacityValues[24]) finalOpacity = getOpac(0.06, 0.02);

    if (finalOpacity < minOpacity || finalOpacity > maxOpacity) {
      finalOpacity = 0;
    }

    color = hexToRGBA(selectedColor, finalOpacity * 0.9);
  }

  return color;
}
