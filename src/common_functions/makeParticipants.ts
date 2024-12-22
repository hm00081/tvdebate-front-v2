import _ from 'lodash';
import { UtteranceObject } from '../interfaces/DebateDataInterface';
import { DebateName } from '../views/ConceptualRecurrencePlot/DataImporter';

export interface Participant {
    name: string;
    color: string;
    team: number;
}

export interface ParticipantDict {
    [participant: string]: Participant;
}

/**
 * make participants information inclduing name, color
 * @param debateUtterances
 */
export function makeParticipants(debateName: DebateName, debateUtterances: UtteranceObject[]): Participant[] {
    // 참가자 노드 생성 구간
    const nameDictionary: { [name: string]: string } = {};
    // arrange participants
    //@ts-ignore
    _.forEach(debateUtterances, (utteranceObject) => {
        nameDictionary[utteranceObject.name] = utteranceObject.name;
    });
    const names: string[] = _.values(nameDictionary).sort();
    console.log('names', names);

    let participants: Participant[] = [];

    if (debateName === 'sample') {
        const colorDictionary: { [index: number]: string } = {
            0: '#C941AF',
            1: '#C98E41',
            2: '#4161C9',
            3: '#41C9C9',
            4: '#333333',
        };
        //@ts-ignore
        participants = _.map(names, (name: string, index: number) => {
            let team: number;
            switch (index) {
                case 0:
                    team = 2;
                    break;
                case 1:
                    team = 1;
                    break;
                case 2:
                    team = 1;
                    break;
                case 3:
                    team = 2;
                    break;
                case 4:
                    team = -1;
                    break;
                default:
                    team = -3;
            }

            return {
                name,
                color: colorDictionary[index],
                team,
            };
        });
    } else if (debateName === '기본소득') {
        const colorDictionary: { [index: number]: string } = {
            0: 'rgba(128, 128, 128)', // 아나운서
            1: 'rgba(141, 223, 95)', // 박기성
            2: 'rgba(56, 146, 3)', // 오세훈
            3: 'rgba(134, 82, 255)', // 이원재
            4: 'rgba(0, 0, 216)', // 이재명
            5: 'rgba(51, 51, 51)', // 사회자
        };
        //@ts-ignore
        participants = _.map(names, (name: string, index: number) => {
            let team: number;
            switch (index) {
                case 0:
                    team = -1;
                    break;
                case 1:
                    team = 2;
                    break;
                case 2:
                    team = 2;
                    break;
                case 3:
                    team = 1;
                    break;
                case 4:
                    team = 1;
                    break;
                case 5:
                    team = -2;
                    break;
                default:
                    team = -3;
            }
            return {
                name,
                color: colorDictionary[index],
                team,
            };
        });
    } else if (debateName === '기본소득clipped') {
        const colorDictionary: { [index: number]: string } = {
            0: '#FF0000',
            1: '#00FF00',
            2: '#3CB043',
            3: '#A020F0',
            4: '#333333',
        };
        participants = _.map(names, (name: string, index: number) => {
            let team: number;
            switch (index) {
                case 0:
                    team = 2;
                    break;
                case 1:
                    team = 2;
                    break;
                case 2:
                    team = 1;
                    break;
                case 3:
                    team = 1;
                    break;
                case 4:
                    team = -2;
                    break;
                default:
                    team = -3;
            }
            return {
                name,
                color: colorDictionary[index],
                team,
            };
        });
    } else if (debateName === '정시확대' || debateName === '정시확대clipped') {
        const colorDictionary: { [index: number]: string } = {
            0: '#FF0000',
            1: '#00FF00',
            2: '#3CB043',
            3: '#A020F0',
            4: '#333333',
        };
        participants = _.map(names, (name: string, index: number) => {
            let team: number;
            switch (index) {
                case 0:
                    team = 1;
                    break;
                case 1:
                    team = 2;
                    break;
                case 2:
                    team = 1;
                    break;
                case 3:
                    team = 2;
                    break;
                case 4:
                    team = -2;
                    break;
                default:
                    team = -3;
            }
            return {
                name,
                color: colorDictionary[index],
                team,
            };
        });
    } else if (debateName === '모병제' || debateName === '모병제clipped') {
        const colorDictionary: { [index: number]: string } = {
            // 0: "#FF0000",
            // 1: "#00FF00",
            // 2: "#3CB043",
            // 3: "#A020F0",
            // 4: "#333333",
            // 0: "rgba(134, 82, 255, 1)", // 김종대
            // 1: "rgba(141, 223, 95, 1)", // 박휘락
            // 2: "rgba(56, 146, 3,1)", // 이준석
            // 3: "rgba(0, 0, 216, 1)", // 장경태
            // 4: "rgba(51, 51, 51, 1)", // 사회자
            //초파주빨
            //#00AB6E #122CAB #C7611E #B60E3C
            // kor
            0: '#00AB6E', // 김종대, host
            1: '#C7611E', // 박휘락, 장경태
            2: '#B60E3C', // 이준석, 김종대
            3: '#00a0e2', // 장경태, 이준석
            4: '#808080', // 사회자, 박휘락
            //0905 바뀜. 1023 change
            // eng
            // 0: "#808080", // 김종대, host
            // 1: "#00a0e2", // 박휘락, 장경태
            // 2: "#00AB6E", // 이준석, 김종대
            // 3: "#B60E3C", // 장경태, 이준석
            // 4: "#C7611E", // 사회자, 박휘락
        };
        participants = _.map(names, (name: string, index: number) => {
            let team: number;
            switch (index) {
                case 0:
                    team = 1;
                    //team = -2;
                    break;
                case 1:
                    team = 2;
                    //team = 1;
                    break;
                case 2:
                    team = 2;
                    //team = 1;
                    break;
                case 3:
                    team = 1;
                    //team = 2;
                    break;
                case 4:
                    team = -2;
                    //team = 2;
                    break;
                default:
                    team = -3;
            }
            return {
                name,
                color: colorDictionary[index],
                team,
            };
        });
    } else if (debateName === '집값') {
        const colorDictionary: { [index: number]: string } = {
            0: '#000000', // 김수지
            1: '#C941AF', // 김현아
            2: '#C98E41', // 송석준
            3: '#41C9C9', // 진성준
            4: '#333333', // 진행자
            5: '#4161C9', // 최배근
        };
        participants = _.map(names, (name: string, index: number) => {
            let team: number;
            switch (index) {
                case 0:
                    team = -1;
                    break;
                case 1:
                    team = 2;
                    break;
                case 2:
                    team = 2;
                    break;
                case 3:
                    team = 1;
                    break;
                case 4:
                    team = -2;
                    break;
                case 5:
                    team = 1;
                    break;
                default:
                    team = -3;
            }
            return {
                name,
                color: colorDictionary[index],
                team,
            };
        });
    } else if (debateName === '정년연장') {
        const colorDictionary: { [index: number]: string } = {
            0: '#41C9C9', // 김범중
            1: '#4161C9', // 박연미
            2: '#C98E41', // 이지만
            3: '#C941AF', // 정영진
            4: '#333333', // 진행자
        };
        //@ts-ignore
        participants = _.map(names, (name: string, index: number) => {
            let team: number;
            switch (index) {
                case 0:
                    team = 2;
                    break;
                case 1:
                    team = 2;
                    break;
                case 2:
                    team = 1;
                    break;
                case 3:
                    team = 1;
                    break;
                case 4:
                    team = -2;
                    break;
                default:
                    team = -3;
            }
            return {
                name,
                color: colorDictionary[index],
                team,
            };
        });
    }

    return participants;
}
