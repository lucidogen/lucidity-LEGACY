import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { selectAction } from '../actions/selectAction'
import { save } from '../../Data/signals/save'

export const name: SignalType =
[ nameAction
, ...save
]
