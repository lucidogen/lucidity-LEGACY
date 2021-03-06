import { JSX, connect } from '../../Component'
import { signal } from 'cerebral/tags'
import getSelection from '../lib/getSelection'
import { doOperation } from '../../../modules/editor/lib/doOperation'

export default connect
( { applyOp: signal`editor.applyOpTriggered`
  }
, function Select ( { applyOp } ) {
    const click = ( e, op ) => {
      const selection = getSelection ()
      const composition = // FIXME
      const ops = doOperation ( composition, selection, op )
      applyOp ( { ops } )
      e.preventDefault ()
    }
    const onMouseDown = e => e.preventDefault ()
    return (
      <div className='ToolBox-menu'>
        <div className='ToolBox-item'
          onClick={e => click(e, 'B')}
          onMouseDown={onMouseDown}>
          <i className='strong'>B</i>
        </div>
        <div className='ToolBox-item'
          onClick={e => click(e, 'I')}>
          <i className='em'>I</i>
        </div>
        <div className='ToolBox-item'
          onClick={e => click(e, 'A')}>
          <i className='em'>link</i>
        </div>
      </div>
    )
  }
)
