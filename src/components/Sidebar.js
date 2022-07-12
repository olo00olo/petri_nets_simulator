import React from 'react';

export default ({ nodes }) => {
    
  // const onDragCircle = (event, nodeType) => {
  //   event.dataTransfer.setData('application/reactflow', nodeType);
  //   event.dataTransfer.effectAllowed = 'move';
  // };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div >
      <div className="dndnode place" onDragStart={(event) => onDragStart(event, 'place')} draggable>
      </div>
      <div className="dndnode transition" onDragStart={(event) => onDragStart(event, 'transition')} draggable>
      </div>
      <button>+</button>
      <p>----------</p>
      <div className="title">Nodes</div>
      {nodes.map((node) => (
        <div key={node.id}>
          Node {node.id} - x: {node.position.x.toFixed(2)}, y: {node.position.y.toFixed(2)}, value: {node.value}
        </div>
      ))}
    </div>
  );
};
