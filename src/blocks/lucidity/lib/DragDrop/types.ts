import { BlockType } from '../Block'
import { NodeType, UIGraphType, GraphType } from '../Graph'
interface PosType {
  x: number
  y: number
}

// This is the dragged node
export interface DragStartType {
  // 'library', 'project', 'scene'
  ownerType: string
  // relative position on node
  nodePos: PosType

  // Used for library start drag operation
  componentId?: string

  // Used to identify starting node for scene/graph op.
  nodeId?: string

  // Dragged graph (computed on drag start)
  dgraph?: GraphType
  // Rest of the graph
  rgraph?: GraphType

  // Computed on drag start
  uigraph?: UIGraphType
  copy?: boolean
}

// This is the drop zone
export interface DragMoveType {
  // insert: slip the element between parentId and existing child
  // add: fill an empty slot
  target: string
  // absolute position
  clientPos: PosType
  copy?: boolean
}

// This is the drop zone
export interface DragDropType {
  target: string
  // owner 'library', 'project', 'scene'
  ownerType: string
  // new graph. Not needed on library drop
  graph?: GraphType
  // Target nodeId
  nodeId?: string
  // Target slot index
  slotIdx?: number
  copy?: boolean
}
