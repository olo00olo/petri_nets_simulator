import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'react-flow-renderer';

import Sidebar from './Sidebar';

import './index.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    style: {backgroundColor: "lightblue",
            borderColor: "#0041d0",
            borderRadius: "50%",
            height: "45px",
            width: "45px"},
    position: { x: 250, y: 5 },
  },
];

const initialEdges = [{
  id: '1-2',
  source: 1,
  target: 2,
  type: 'straight'
}]

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      var style;
      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if(type == 'input') {
        style = { backgroundColor: "lightblue",
        borderColor: "#0041d0",
        borderRadius: "50%",
        height: "45px",
        width: "45px"};
      }
      else if(type == 'default') {
        style = { backgroundColor: "lightblue",
        borderColor: "#0041d0",
        height: "60px",
        width: "30px",
        borderRadius: "0px"};
        console.log(style)
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        style,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="dndflow">
      <Sidebar />
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
