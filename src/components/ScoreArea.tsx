import * as React from 'react';
import type IThrowResult from '../models/IThrowResult';
import Dice from './Dice';
import utils from '../utils';
import type IDice from '../models/IDice';

const ScoreArea: React.FC<{
    throwHistory: IThrowResult[],
}> = ({ throwHistory }) => {
    const total = throwHistory.map(_ => _.score).reduce((previous, current) => {
        if (!previous) {
            previous = 0;
        }
        return previous += (current ?? 0);
    }, 0);

    const groupedDices = (dices: IDice[]) => {
        const groupedDices: { throwId: string, dices: IDice[] }[] = [];
        utils.groupBy(dices, _ => _.throwId).forEach((values, key) => {
            groupedDices.push({ throwId: key, dices: values });
        });
        return groupedDices;
    }

    return <>
    <div style={{ borderBottom: '1px solid black' }}><b>Total: {total}</b></div>
    <div
        style={{
            maxHeight: "100%",
            overflow: "auto"
        }}
    >     
        {throwHistory.map((_, index) => <div
                key={`throw-history-${_.resultId}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    borderBottom: '1px solid black'
                }}
            >
                <div style={{ width: '20%'}}>{index + 1}. {_.score}</div>
                <div style={{ width: '80%'}}>
                    {groupedDices(_.dices).map(group => 
                    <div key={`throw-history-dices-${group.throwId}`} style={{ display: 'flex'}}>
                        {group.dices.map(dice => <Dice key={`history-dice-${dice.key}`} dice={dice} size={2} />)}
                    </div>)}
                </div>
        </div>)}
    </div>
    </>
}

export default ScoreArea;