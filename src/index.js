import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import '@atlaskit/css-reset'

import initialData from './initial-data'
import Column from './Column'

const Container = styled.div`
  display: flex;
`

const InnerList = React.memo(function(props) {
  const { column, taskMap, index } = props

  return <Column
    column={column}
    tasks={column.taskIds.map(elem => taskMap[elem])}
    index={index}
  />
})

const App = () => {
  const [state, setState] = useState(initialData)

  const onDragEnd = useCallback((result) => {
    const { source, destination, draggableId, type } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    if (type === 'column') {
      const newColumnOrder = Array.from(state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      setState({
        ...state,
        columnOrder: newColumnOrder
      })

      return
    }

    const start = state.columns[source.droppableId]
    const finish = state.columns[destination.droppableId]
    if (start.id === finish.id) {
      const newTaksIds = Array.from(start.taskIds)
      newTaksIds.splice(source.index, 1)
      newTaksIds.splice(destination.index, 0, draggableId)

      const newColumn = { ...start, taskIds: newTaksIds }

      setState({
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn
        }
      })
      return
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = { ...start, taskIds: startTaskIds }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = { ...finish, taskIds: finishTaskIds }

    setState({
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    })
  }, [state])

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Droppable
        droppableId='all-columns'
        direction='horizontal'
        type='column'
      >
        {(provided) => (
          <Container
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
          {
            state.columnOrder.map((columnId, idx) => {
              const column = state.columns[columnId]

              return (
                <InnerList
                  key={column.id}
                  column={column}
                  taskMap={state.tasks}
                  index={idx}
                />
              )
            })
          }
          {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
