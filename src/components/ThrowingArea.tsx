import * as React from 'react';
import { Button } from '@mui/material'
import utils from '../utils';
import type IDice from '../models/IDice';
import Dice from './Dice';
import { v4 as uuidv4 } from 'uuid'
import type IThrowResult from '../models/IThrowResult';

const ThrowingArea: React.FC<{
    onTake: (result: IThrowResult) => void,
}> = ({ onTake }) => {
    const _totalDiceCount = 6

    const throwDice = (throwId: string): IDice => {
        return { key: uuidv4(), value: utils.getRandomInteger(1, 7), throwId };
    }

    const [currentThrow, setCurrentThrow] = React.useState<IThrowResult>({ dices: [] });
    const [savedDices, setSavedDices] = React.useState<IDice[]>([]);

    const handleThrow = () => {
        let dicesToThrow = _totalDiceCount - savedDices.length;
        if (dicesToThrow < 1) dicesToThrow = 6;
        const throwId = uuidv4();
        let dices: IDice[] = [];

        for (let i = 0; i < dicesToThrow; i++) {
            dices.push(throwDice(throwId))
        }

        const throwResult: IThrowResult = {
            dices: dices,
            throwId: throwId,
        }

        setCurrentThrow(throwResult);
    }

    const handleTake = () => {
        const resultId = uuidv4();
        const result = { dices: savedDices, resultId };
        onTake({ ...result, score: utils.calculateScore(result) });
        setCurrentThrow({ dices: [] });;
        setSavedDices([]);
    }

    const handleTrash = () => {
        const resultId = uuidv4();
        const result = { dices: [], resultId };
        onTake({ ...result, score: utils.calculateScore(result) });
        setCurrentThrow({ dices: [] });;
        setSavedDices([]);
    }

    const handleToggleDice = (dice: IDice) => {
        const savedDice = savedDices.find(_ => _.key === dice.key)
        if (savedDice) {
            if (savedDice?.throwId === currentThrow.throwId) {
                setSavedDices(dices => dices.filter(_ => _.key !== dice.key));
                setCurrentThrow(current => ({ ...current, dices: [...current.dices, dice] }));
            }
        }
        else {
            setSavedDices(dices => [...dices, dice]);
            setCurrentThrow(current => ({ ...current, dices: current.dices.filter(_ => _.key !== dice.key) }));
        }
    }

    const style: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        height: '80vh',
        flexDirection: 'column',
        gap: '10vh'
    }

    return (
        <div style={style}>
            <div
                id="save"
                style={{
                    display: 'flex',
                }}
            >
                {savedDices.map(_ => <Dice dice={_} onClick={handleToggleDice} />)}
            </div>
            <div
                id="throw"
                style={{
                    display: 'flex',
                }}
            >
                {currentThrow.dices.toSorted((a: IDice, b: IDice) => a.value - b.value).map(_ => <Dice dice={_} onClick={handleToggleDice} />)}
            </div>
            <div
                id="actions"
                style={{
                    display: "flex",
                    flexDirection: 'column',
                    gap: "10px",
                }}
            >
                <Button
                    variant='contained'
                    color='success'
                    onClick={() => handleTake()}
                    disabled={!savedDices.find(_ => _.throwId === currentThrow.throwId) || utils.calculateScore({ resultId: uuidv4(), dices: savedDices }) < 300}
                >
                    Ota
                </Button>
                <Button
                    variant='contained'
                    color='error'
                    onClick={() => handleTrash()}
                    disabled={!currentThrow.dices.length}
                >
                    Roskiin
                </Button>
                <Button
                    variant='contained'
                    onClick={() => handleThrow()}
                    disabled={!!currentThrow.throwId && !savedDices.some(_ => _.throwId === currentThrow.throwId)}
                >
                    Heitä
                </Button>              
            </div>
        </div>
    )
}

export default ThrowingArea;