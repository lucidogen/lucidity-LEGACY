import { NodeType, UILayoutType, UINodeSize } from '../types'
import { BlockType } from '../../Block'

/** Compute the minimum size to display the element.
 */
export const minSize =
( block: BlockType
, node: NodeType
, layout: UILayoutType
) : UINodeSize => {
  const ds = block.meta.children
           // exact children length (and cope for extra detached)
           ? Math.max
             ( block.meta.children.length, node.children.length )
           // always keep a free slot for untyped children
           : node.children.length + 1
  const us = 1 // alwasy show up slot.
  // has update = block.meta.isvoid || block.meta.update ? 1 : 0

  const tb = layout.tsizer ( block.name )

  let w : number = tb.width + 2 * layout.TPAD

  // width down (taken by inlets)
  const wd = layout.RADIUS +
    ds * ( layout.SPAD + 2 * layout.SLOT ) +
    layout.SPAD + layout.RADIUS

  // width up (taken by outlets)
  const wu = layout.RADIUS +
    us * ( layout.SPAD + 2 * layout.SLOT ) +
    layout.SPAD + layout.RADIUS

  w = Math.ceil
  ( Math.max ( w, wd, wu ) / layout.GRIDH ) * layout.GRIDH

  return { cacheName: block.name // cache reference
         , w
         , h: layout.HEIGHT
         , tx: layout.TPAD
         , ty: layout.HEIGHT / 2 + layout.THEIGHT / 4
         , wd
         , wu
         , ds
         , us
         , wde: 0
         }
}
