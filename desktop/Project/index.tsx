import './style.scss'
import { Component } from '../Component'
import { editable, pane } from '../../modules/Factory'
import { Graph } from '../Graph'

const ProjectName = editable ( [ 'project', 'name' ] )

const ProjectOptions = pane ( 'project-opts' )

export const Project = Component
( { graph: [ 'project', 'graph' ]
  , project: [ 'project' ]
    // update ui on project name edit
  , editing: ProjectName.path
    // ensure that we redraw on pane changes
  , pane: ProjectOptions.path
    // update graph ui
  , blockId: [ 'user', 'blockId' ]
  }
, ( { state, signals } ) => (
    <div class='Project'>
      <div class='bar'>
        <ProjectOptions.toggle class='fa fa-diamond'/>
        <ProjectName class='name'/>
      </div>
      <ProjectOptions>
        <div class='button delete'>delete</div>
        <div class='button'>duplicate</div>
      </ProjectOptions>
      <Graph key='project.graph'
        selectedBlockId={ state.blockId }
        ownerType={ 'project' }
        graph={ state.graph } />
    </div>
  )
)
