import { ActionContextType } from '../../context.type'
import { FileChanged } from '../helper/types'
import { createGraph, updateGraphSource } from '../../Graph/helper/GraphHelper'
import { Immutable as IM } from '../../Graph'
import { rootBlockId } from '../../Block'
import { createComponent } from '../../Library'

const nameRe = /^(.+)\.ts$/

export const libraryAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const msg: FileChanged = input
  const odoc = state.get ( [ 'data', 'component', msg._id ] )
  if ( !odoc ) {
    // new component
    createGraph ( name, msg.source )
    .then ( ( graph ) => {
        const doc = createComponent ( graph, msg._id )
        output.success ( { doc } )
      }
    )
    .catch ( ( errors ) => {
      const message = errors [ 0 ].message
      output.error ( { status: { type: 'error', message } } )
    })
  }
  else {
    // update
    if ( msg.op === 'rename' ) {
      let doc = IM.update ( odoc, 'name', name )
      doc = IM.update ( odoc, 'graph', 'blocksById', rootBlockId, 'name', name )
      output.success ( { doc } )
    }

    else {
      updateGraphSource ( odoc.graph, msg.blockId, msg.source, ( errors, graph ) => {
        if ( errors ) {
          output.error
          ( { status: { type: 'error', message: errors [ 0 ].message } } )
        }
        else {
          const doc = IM.update ( odoc, 'graph', graph )
          output.success ( { doc } )
        }
      })
    }

  }
}

libraryAction [ 'async' ] = true
