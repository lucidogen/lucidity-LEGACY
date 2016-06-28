import { SignalType } from '../../context.type'
import { docAction } from '../actions/docAction'
import { save } from '../../Data/signals/save'
import * as copy from 'cerebral-addons/copy'
import { debounce } from '../../Utils'
import { status } from '../../Status/actions/status'
import * as unset from 'cerebral-addons/unset'
import { update } from '../../Data/actions/update'

export const doc: SignalType =
[ docAction
, { success:
    [ update // Optimistic write in state. This can trigger a 'sources' update.
    , ...save
    ]
  , error: [ status ]
  }
]
