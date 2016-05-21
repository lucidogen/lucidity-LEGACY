import { defaultUILayout } from './uilayout'
import { GraphType
       , UIGhostBlockType
       , UINodeType, UINodeByIdType
       , UIGraphType
       , UILayoutType
       , UIPosType
       , UISlotType } from '../types'

import { Block } from './Block'

import { minSize } from './minSize'

/** Compute svg path of a box with up and down slots.
 * The sizes have to be computed first in the 'info' field.
 */
const path = function
( boxdef : UINodeType
, layout : UILayoutType
) {
  const { size, sextra }  = boxdef
  const { us, ds, w, wd, wde, wu, h } = size
  const r    = layout.RADIUS

  // path starts at top-left corner + RADIUS in x direction.
  // top-left is (0,0) because we translate with a <g> tag.
  const res = [ `M${r} 0` ]

  for ( let i = 0; i < us; i += 1 ) {
    res.push ( `h${layout.SPAD}` )
    res.push ( `l${layout.SLOT} ${-layout.SLOT}` )
    res.push ( `l${layout.SLOT} ${ layout.SLOT}` )
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +-----------+
  // |--------- wu ----------|
  // |--------- w  -----------------|
  const rpadu = w - wu
  if ( rpadu > 0 ) {
    res.push ( `h${ rpadu + layout.SPAD }` )
  }
  else {
    res.push ( `h${ layout.SPAD }` )
  }

  res.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )

  res.push ( `v${ h - 2 * r }`      )

  res.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  const rpadd = w - wd - wde + ( sextra [ ds ] || 0 )
  if ( rpadd > 0 ) {
    res.push ( `h${ -rpadd - layout.SPAD }` )
  }
  else {
    res.push ( `h${ -layout.SPAD }` )
  }

  for ( let i = ds - 1; i >= 0; i -= 1 ) {
    res.push ( `l${ -layout.SLOT } ${ -layout.SLOT }` )
    res.push ( `l${ -layout.SLOT } ${  layout.SLOT }` )
    res.push ( `h${ -layout.SPAD - ( sextra [ i ] || 0 ) }` )
  }

  res.push ( `a${r} ${r} 0 0 1 ${-r} ${-r}` )

  res.push ( `v${ -h + 2 * r }`    )
  res.push ( `a${r} ${r} 0 0 1 ${ r} ${-r}` )

  // res.push ( `a50 50 0 0 1 50 50` )
  // res.push ( `l50 50` )

  return res.join ( ' ' )
}

/** Compute a class name from an object.
 *
 * @param {object} obj    - the object definition
 * @param {object} layout - constants and tmp svg element
 *
 * @returns {string}   - the class name
 */
const className = function ( obj, layout : UILayoutType ) {
  if ( obj.type !== 'block' ) {
    return obj.type
  }

  const name = obj.name.split ( '.' ) [ 0 ]
  let num = 7
  for ( let i = 0; i < name.length; i += 1 ) {
    num += name.charCodeAt ( i )
  }
  return `box${1 + num % layout.PCOUNT}`
}

/** Compute box position.
 */
const boxPosition = function
( graph: GraphType
, id: string
, layout: UILayoutType
, uigraph: UIGraphType
, ghost: UIGhostBlockType
, ctx: UIPosType
) {
  const obj  = graph.blocksById [ id ]

  // store our position given by ctx
  uigraph.uiNodeById [ id ].pos = ctx
  let dy = layout.HEIGHT

/*
  if ( graph.type === 'files' ) {
    dy += layout.SUBPADY
  }
  else {
  */
    dy += layout.VPAD
    /*
  }
  */

  let x  = ctx.x

  const link = graph.nodesById [ id ]
  const len  = Math.max ( link.children.length, ( obj.input || [] ).length )
  const ghostbelow = ghost && ( ghost.y > ctx.y + dy )
  const onchildren = ghost && ( ghost.y <= ctx.y + 2 * dy )
  const sextra = uigraph.uiNodeById [ id ].sextra

  // get children
  for ( let i = 0; i < len + 1; i += 1 ) {
    const cname = link.children [ i ]
    const wtonext = ( sextra [ i ] || 0 ) + layout.SPAD + 2 * layout.SLOT
    if ( ghostbelow ) {
      // ghost is hovering on our children
      if ( ghost.x > x && ghost.x <= x + wtonext ) {
        // simulate drop
        if ( onchildren || !cname ) {
          // precise drop on children row
          // or dropping from far below on free slot
          const boxid = Block.nextNodeId ( graph.blocksById )
          ghost.linkpos = i
          ghost.parentId = id
          ghost.nodeId = boxid

          const gbox =
          Object.assign
          ( {}
          , ghost.uinode
          , { pos: { x: x, y: ctx.y + dy }
            , id: boxid
            , isGhost: true
            }
          )
          // this is to draw the ghost
          uigraph.nodes.push ( boxid )
          uigraph.uiNodeById [ boxid ] = gbox

          x += ghost.uinode.size.w + layout.BPAD
        }
      }
    }

    if ( cname ) {
      boxPosition
      ( graph, cname, layout, uigraph, ghost
      , { x, y: ctx.y + dy }
      )
      x += layout.BPAD + uigraph.uiNodeById [ cname ].size.w
    }
    else if ( ghostbelow || cname === null ) {
      // we add x to continue checking drop on all slots
      x += layout.SPAD + 2 * layout.SLOT
    }
  }

  /*
  if ( link.sub || link.next ) {
    // files rendering
    if ( obj.sub ) {
      dy += boxPosition
      ( graph, obj.sub, layout, uigraph, ghost
      , { x: x + layout.SUBPADX
        , y: ctx.y + dy
        }
      )
    }

    if ( obj.next ) {
      dy += boxPosition
      ( graph, obj.next, layout, uigraph, ghost
      , { x
        , y: ctx.y + dy
        }
      )
    }
  }
  */

  return dy
}


const uimapOne = function
( graph: GraphType
, id: string
, layout: UILayoutType
, uigraph: UIGraphType
, ghost: UIGhostBlockType
, cachebox: UINodeByIdType
) {
  uigraph.uiNodeById [ id ] = <UINodeType> { id }
  /*
  if ( graph.type !== 'processing' ) {
    // not in graph: draw parent first
    uigraph.list.push ( id )
  }
  */

  const uibox = uigraph.uiNodeById [ id ]
  const cache = cachebox [ id ] || <UINodeType>{}

  const obj  = graph.blocksById [ id ]
  const link = graph.nodesById [ id ]

  uibox.name = obj.name
  uibox.type = obj.type
  uibox.className = uibox.name === cache.name
                  ? cache.className
                  : className ( obj, layout )
  // FIXME: only store text size in cache
  const ds = Math.max ( ( obj.input || [] ).length, ( link.children || [] ).length )

  let size = cache.size
  if ( !size ||
        size.cacheName !== obj.name ||
        size.us   !== ( obj.output ? 1 : 0 ) ||
        size.ds   !== ds
        ) {
    size = minSize ( obj, link, layout )
  }
  else {
    // cache.size is immutable
    size = Object.assign ( {}, size )
  }

  size.wde = 0

  const input = obj.input
  const slots : UISlotType[] = []
  const sl = layout.SLOT

  const sextra = [ 0 ] // extra spacing before slots
                       // first has 0 extra spacing
                       // second has spacing dependent on first child, etc

  if ( input ) {
    let   x = layout.RADIUS + layout.SPAD
    const y = layout.HEIGHT
    const len = Math.max ( link.children.length, input.length )


    // Compute sizes for all children
    for ( let i = 0; i < len; i += 1 ) {
      if ( ! input [ i ] ) {
        // extra links outside of inputs...
        const spath = `M${x} ${y} h${2 * sl}`
        slots.push
        ( { path: spath, className: 'slot detached' } )
      }
      else {
        const spath = `M${x} ${y} l${sl} ${-sl} l${sl} ${sl}`
        slots.push
        ( { path: spath, className: 'slot' } )
      }
      const cname = link.children [ i ]
      if ( cname ) {
        // We push in sextra the delta for slot i
        const w  = uimapOne ( graph, cname, layout, uigraph, ghost, cachebox )
        if ( i === len - 1 ) {
          // last
          sextra.push ( w + layout.BPAD - 2 * layout.SPAD - 4 * layout.SLOT )
        }
        else {
          sextra.push ( w + layout.BPAD - layout.SPAD - 2 * layout.SLOT )
        }
        x += w
      }
      else {
        x += 0
        sextra.push ( 0 )
      }
    }

    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    if ( sextra.length > 0 ) {
      size.wde = sextra.reduce ( ( sum, e ) => sum + e )
    }
    // sextra.pop ()

    size.w = Math.max ( size.w, size.wd + size.wde )
  }

  uibox.sextra = sextra

/*
  if ( obj.sub ) {
    uimapOne ( graph, obj.sub, layout, uigraph, ghost, cachebox )
  }

  if ( obj.next ) {
    uimapOne ( graph, obj.next, layout, uigraph, ghost, cachebox )
  }
  */

  uibox.size = size

  uibox.path  = path ( uibox, layout )
  uibox.slots = slots
  /*
  if ( graph.type === 'processing' ) {
    // list contains children before self so that we
    // draw the parent above the child (slots).
    uigraph.list.push ( id )
  }
  */
  return uibox.size.w
}

/** Compute the layout of a graph.
 */
export const uimap =
( graph: GraphType
, alayout?: UILayoutType
, cache?: UIGraphType
, aghost?: UIGhostBlockType
) : UIGraphType => {
  const layout = alayout || defaultUILayout
  const cachebox : UINodeByIdType = cache ? cache.uiNodeById : {}

  const startpos =
  { x: 0.5
  , y: 0.5 + layout.SLOT + layout.RADIUS
  }

  const uigraph : UIGraphType =
  { nodes: []
  , grabpos:
    { x: startpos.x + layout.RADIUS + layout.SPAD + layout.SLOT
    , y: startpos.y - layout.RADIUS + 6 // why do we need this 6 ?
    }
  , uiNodeById: {}
  }

  let ghost
  if ( aghost ) {
    // We want cx, cy to be the up slot.
    const cx = aghost.x - uigraph.grabpos.x // + aghost.uibox.size.w / 2
    const cy = aghost.y - uigraph.grabpos.y // + aghost.uibox.size.h / 2
    ghost = Object.assign ( {}, aghost, { x: cx, y: cy } )
    uigraph.dropghost = ghost
  }

  uimapOne
  ( graph, Block.rootNodeId, layout, uigraph, ghost, cachebox )

  boxPosition
  ( graph, Block.rootNodeId, layout, uigraph, ghost, startpos )

  return uigraph
}
