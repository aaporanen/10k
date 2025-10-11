import * as React from 'react';
import type IThrowResult from '../models/IThrowResult';
import Dice from './Dice';

const ScoreArea: React.FC<{
    throwHistory: IThrowResult[],
}> = ({ throwHistory }) => {
    const total = throwHistory.map(_ => _.score).reduce((previous, current) => {
        if (!previous) {
            previous = 0;
        }
        return previous += (current ?? 0);
    }, 0);
    return <div>
        <div><b>Total: {total}</b></div>
        {throwHistory.map((_, index) => <div
                key={_.throwId}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}
            >
                <div>{index + 1}. {_.score}</div><div style={{ display: 'flex' }}>{_.dices.map(dice => <Dice dice={dice} size={2} />)}</div>
        </div>)}
    </div>
}

export default ScoreArea;