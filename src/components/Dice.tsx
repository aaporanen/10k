import * as React from 'react';
import type IDice from '../models/IDice';
import utils from '../utils';
import Icon from '@mdi/react';

const Dice: React.FC<{
    dice: IDice,
    size?: number | string,
    onClick?: (dice: IDice) => void,
    placeholder?: boolean,
}> = ({ dice, size, onClick, placeholder }) => {

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
            style={{
                visibility: placeholder ? "hidden" : "visible"
            }}
        />
    </div>
}

export default Dice;