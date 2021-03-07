import React from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import Task from './Task'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`
const Title = styled.h3`
  padding: 8px;
`
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => props.isDraggingOver ? 'skyblue' : 'white'};
  flex-grow: 1;
  min-height: 100px;
`

const InnerList = React.memo(function ({ tasks }) {
  return tasks.map((task, idx) => <Task key={task.id} task={task} index={idx} />)
})

const Column = (props) => {
  const { column, tasks, index } = props

  return (
    <Draggable
      draggableId={column.id}
      index={index}
    >
      {(provided) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Title
            {...provided.dragHandleProps}
          >
            {column.title}
          </Title>
          <Droppable
            droppableId={column.id}
            type="task"
          >
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <InnerList tasks={tasks} />
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  )
}

export default Column