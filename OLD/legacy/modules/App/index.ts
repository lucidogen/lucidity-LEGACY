import { mounted } from './signals/mounted'
import { homeUrl } from './signals/homeUrl'
import { mode } from './signals/mode'
import { projectUrl } from './signals/projectUrl'
import { projectsUrl } from './signals/projectsUrl'
import { resized } from './signals/resized'
import { userUrl } from './signals/userUrl'

export interface AppSignalsType {
  homeUrl ()
  mode ( { mode: string } )
  projectUrl ( { _id: string } )
  projectsUrl ()
  userUrl ()
}

export const App =
(options = {}) => {
  return (module, controller) => {
    // no state added

    module.addSignals
    ( { mounted
      , homeUrl
      , mode
      , projectUrl
      , projectsUrl
      , userUrl
      , resized
      }
    )

    return {} // meta information
  }
}
