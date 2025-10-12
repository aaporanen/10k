import type IDice from "./models/IDice";
import { mdiDice1Outline, mdiDice2Outline, mdiDice3Outline, mdiDice4Outline, mdiDice5Outline, mdiDice6Outline } from '@mdi/js'
import type IThrowResult from "./models/IThrowResult";

const getRandomInteger = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const getDiceIcon = (dice: IDice): string => {
    switch (dice.value) {
        case 1:
            return mdiDice1Outline;
        case 2:
            return mdiDice2Outline;
        case 3:
            return mdiDice3Outline;
        case 4:
            return mdiDice4Outline;
        case 5:
            return mdiDice5Outline;
        case 6:
            return mdiDice6Outline;
        default:
            throw "could not get dice icon";
    }
}

function groupBy<T>(list: T[], keyGetter: (item: T) => any) {
    const map = new Map<any, T[]>();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
};

const hasOfAKind = (values: number[], count: number) => {
    let has = false;
    const map = groupBy(values, _ => _);
    map.forEach(value => {
        if (value.length === count) {
            has = true;
        }
    });
    return has;
}

const isStraight = (values: number[]) => {
    return values.indexOf(1) != -1
        && values.indexOf(2) != -1
        && values.indexOf(3) != -1
        && values.indexOf(4) != -1
        && values.indexOf(5) != -1
        && values.indexOf(6) != -1
}

const getSpecialThrowText = (result: IThrowResult) => {
    const { dices } = result;
    const diceValues = dices.map(_ => _.value);
    const sixOfAKind = diceValues.length === 6 && new Set(diceValues).size == 1;
    if (sixOfAKind) {
        return "Kymppitonni!";
    }
    const threeAndTree = diceValues.length === 6 && new Set(diceValues).size == 2 && hasOfAKind(diceValues, 3)
    if (threeAndTree) { // 3 + 3
        return "3 + 3!";
    }
    const fourAndTwo = diceValues.length === 6 && new Set(diceValues).size == 2 && hasOfAKind(diceValues, 4)
    if (fourAndTwo) { // 4 + 2
        return "4 + 2!"
    }
    const twoAndTwoAndTwo = diceValues.length === 6 && new Set(diceValues).size == 3 && diceValues.every(value => hasOfAKind(diceValues.filter(_ => _ === value), 2));
    if (twoAndTwoAndTwo) { // 2 + 2 + 2
        return "2 + 2 + 2!"
    }
    const straight = diceValues.length === 6 && isStraight(diceValues)
    if (straight) {
        return "Suora!"
    }
    const fiveOfAKind = !sixOfAKind && diceValues.length <= 6 && hasOfAKind(diceValues, 5);
    if (fiveOfAKind) {
        return "Vitoset!"
    }
    const takeAll = diceValues.every(value => {
        const values = diceValues.filter(_ => _ == value);
        const hasFiveOfAKind = hasOfAKind(values, 5);
        const hasFourOfAKind = hasOfAKind(values, 4);
        const hasThreeOfAKind = hasOfAKind(values, 3);

        const hasTwoOnes = value === 1 ? hasOfAKind(values, 2) : false;
        const hasTwoFives = value === 5 ? hasOfAKind(values, 2) : false;

        const hasOneOne = value === 1 ? hasOfAKind(values, 1) : false;
        const hasOneFive = value === 5 ? hasOfAKind(values, 1) : false;

        return hasFiveOfAKind || hasFourOfAKind || hasThreeOfAKind || hasTwoOnes || hasTwoFives || hasOneOne || hasOneFive;
    });

    if (takeAll) {
        return "Kaikki käy!";
    }

    const nothing = calculateScore(result) === 0;
    return nothing ? "Ja roskiin" : "";
}

const calculateScore = (result: IThrowResult) => {
    let totalScore = 0;
    const { dices } = result;
    const dicesByThrow = groupBy(dices, _ => _.throwId);

    dicesByThrow.forEach((value, key, map) => {
        let throwScore = 0;
        const diceValues = value.map(_ => _.value);
        const sixOfAKind = diceValues.length === 6 && new Set(diceValues).size == 1;
        if (sixOfAKind) {
            throwScore += 10000;
        }
        const threeAndTree = diceValues.length === 6 && new Set(diceValues).size == 2 && hasOfAKind(diceValues, 3)
        if (threeAndTree) { // 3 + 3
            throwScore += 2500;
        }
        const fourAndTwo = diceValues.length === 6 && new Set(diceValues).size == 2 && hasOfAKind(diceValues, 4)
        if (fourAndTwo) { // 4 + 2
            throwScore += 2000;
        }
        const twoAndTwoAndTwo = diceValues.length === 6 && new Set(diceValues).size == 3 && diceValues.every(value => hasOfAKind(diceValues.filter(_ => _ === value), 2));
        if (twoAndTwoAndTwo) { // 2 + 2 + 2
            throwScore += 1500;
        }
        const straight = diceValues.length === 6 && isStraight(diceValues)
        if (straight) {
            throwScore += 1500;
        }
        const fiveOfAKind = !sixOfAKind && diceValues.length <= 6 && hasOfAKind(diceValues, 5);
        if (fiveOfAKind) {
            throwScore += 2000;
        }
        const fourOfAKind = !fiveOfAKind && !fourAndTwo && diceValues.length <= 6 && hasOfAKind(diceValues, 4)
        if (fourOfAKind) {
            throwScore += 1000;
        }
        const noGreaterKind = !sixOfAKind && !fiveOfAKind && !fourOfAKind;
        const noSpecialThrow = !sixOfAKind && !fiveOfAKind && !fourAndTwo && !twoAndTwoAndTwo && !threeAndTree && !straight;
        const threeSixes = noGreaterKind && noSpecialThrow && diceValues.length <= 6 && hasOfAKind(diceValues.filter(_ => _ === 6), 3);
        if (threeSixes) {
            throwScore += 600;
        }
        const threeFives = noGreaterKind && noSpecialThrow && diceValues.length <= 6 && hasOfAKind(diceValues.filter(_ => _ === 5), 3);
        if (threeFives) {
            throwScore += 500;
        }
        const threeFours = noGreaterKind && noSpecialThrow && diceValues.length <= 6 && hasOfAKind(diceValues.filter(_ => _ === 4), 3);
        if (threeFours) {
            throwScore += 400;
        }
        const threeThrees = noGreaterKind && noSpecialThrow && diceValues.length <= 6 && hasOfAKind(diceValues.filter(_ => _ === 3), 3);
        if (threeThrees) {
            throwScore += 300;
        }
        const threeTwos = noGreaterKind && noSpecialThrow && diceValues.length <= 6 && hasOfAKind(diceValues.filter(_ => _ === 2), 3);
        if (threeTwos) {
            throwScore += 200;
        }
        const threeOnes = noGreaterKind && noSpecialThrow && diceValues.length <= 6 && hasOfAKind(diceValues.filter(_ => _ === 1), 3);
        if (threeOnes) {
            throwScore += 300;
        }
        const twoOnes = noGreaterKind && noSpecialThrow && diceValues.length <= 6 && hasOfAKind(diceValues.filter(_ => _ === 1), 2);
        if (twoOnes) {
            throwScore += 200;
        }
        const twoFives = noGreaterKind && noSpecialThrow && hasOfAKind(diceValues.filter(_ => _ === 5), 2);
        if (twoFives) {
            throwScore += 100;
        }
        const oneOne = hasOfAKind(diceValues.filter(_ => _ === 1), 1);
        if (oneOne) {
            throwScore += 100;
        }
        const oneFive = hasOfAKind(diceValues.filter(_ => _ === 5), 1);
        if (oneFive) {
            throwScore += 50;
        }
        totalScore += throwScore;
    });

    return totalScore;
}

export default {
    getRandomInteger,
    getDiceIcon,
    calculateScore,
    groupBy,
    getSpecialThrowText
}