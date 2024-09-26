import { useDroppable, useDraggable } from '@dnd-kit/core';

// Draggable Item
export const DraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} >
      {children}
    </div>
  );
};

// Droppable Container
export const DroppableContainer = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={{ minHeight: "600" }}>
      {children}
    </div>
  );
};

