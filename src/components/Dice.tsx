import * as React from 'react';
import type IDice from '../models/IDice';
import utils from '../utils';
import Icon from '@mdi/react';

const Dice: React.FC<{
    dice: IDice,
    size?: number | string,
    onClick?: (dice: IDice) => void,
}> = ({ dice, size, onClick }) => {

    return <div
        role="button"
        style={{
            cursor: "pointer"
        }}
        onClick={() => onClick && onClick(dice)}
    >
        <Icon
            path={utils.getDiceIcon(dice)}
            size={size ?? 3}
            horizontal
            vertical
        />
    </div>
}

export default Dice;