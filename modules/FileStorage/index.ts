export * from './signals/start'
export * from './signals/stop'
import { FileChanged, DocLoad } from './helper/types'

export interface FileStorageSignalsType {
  changed ( opt: { type: string, message?: string } )
  file ( opt: FileChanged )
  doc ( opt: DocLoad )
  library ( opt: { path: string, op: string, source: string } )
}

import { changed } from './signals/changed'
import { doc } from './signals/doc'
import { file } from './signals/file'
import { start } from './helper/FileStorageHelper'

export const FileStorage =
(options = {}) => {
  return (module, controller) => {
    module.addState
    ( { status: 'offline'
      }
    )

    module.addSignals
    ( { changed
      , doc
      , file
      }
    )

    start ( { controller } )

    return {} // meta information
  }
}
