import React, {useState, useRef, useCallback} from "react";
import ReactFlow, {
  ReactFlowProvider,
  updateEdge,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "react-flow-renderer";

import FloatingEdge from "./FloatingEdge.js";
import FloatingConnectionLine from "./FloatingConnectionLine.js";
import { createNodesAndEdges } from "./utils.js";
import Sidebar from '../components/Sidebar';

import "./index.css";

const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges();

const edgeTypes = {
  floating: FloatingEdge
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const NodeAsHandleFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes,setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = (params) =>
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: "floating",
          markerEnd: { type: MarkerType.Arrow }
        },
        eds
      )
    );

    const onEdgeUpdate = (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els));

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
        var placeType;
        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          console.log(type)
          return;
        }
  
        if(type == 'place') {
          placeType = 'default';
          style = { backgroundColor: "lightblue",
          borderColor: "#0041d0",
          borderRadius: "100%",
          height: "60px",
          width: "60px"};
        }
        else if(type == 'transition') {
          placeType = 'default';
          style = { backgroundColor: "lightblue",
          borderColor: "#0041d0",
          height: "80px",
          width: "5px",
          borderRadius: "0px"};
          console.log(style)
        }
  
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
  
        const newNode = {
          id: getId(),
          type: placeType,
          position,
          style,
          //data: { label: 'Node 1' },
        };
  
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance]
    );

  return (
    <div className="floatingedges">
      <Sidebar/>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          edgeTypes={edgeTypes}
          connectionLineComponent={FloatingConnectionLine}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeUpdate={onEdgeUpdate}
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default NodeAsHandleFlow;
