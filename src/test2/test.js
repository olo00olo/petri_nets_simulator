import React, {useState, useEffect, useRef, useCallback} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  updateEdge,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'react-flow-renderer';

import FloatingEdge from './FloatingEdge.js';
import FloatingConnectionLine from './FloatingConnectionLine.js';
import { createNodesAndEdges } from './utils.js';
import Sidebar from '../components/Sidebar';
import TextUpdaterNode from '../text/TextUpdaterNode';

import './index.css';

const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges();
const nodeTypes = { textUpdater: TextUpdaterNode };

const edgeTypes = {
  floating: FloatingEdge,
};

let id = 0;
const getId = () => `${id++}`;
var value = [1]

const NodeAsHandleFlow = () => {
  const reactFlowWrapper = useRef(null);
  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [placeValue, setPlaceValue] = useState([]);
  const [activeNode, setActiveNode] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [count, setCount] = useState([])
  const [name, setName] = useState('Flavio')

  const onNodeClick = (event, activeNode) => {
    setActiveNode(activeNode);
    console.log("active node: ", activeNode.id);
  };

  const onConnect = (params) =>
    setEdges((eds) =>
      addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 3 }}, eds)
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
        var data
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
          width: "60px"}
          placeValue.push("0")
          data = {label: placeValue[id]}
        }
        else if(type == 'transition') {
          placeType = 'default';
          style = { backgroundColor: "lightblue",
          borderColor: "#0041d0",
          height: "80px",
          width: "5px",
          borderRadius: "0px"};
          placeValue.push("transition")
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
          data: data,
        };
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance]
    );

      function click(){
        //console.log([placeValue])
        //setPlaceValue([]);
        placeValue[activeNode.id]++;
        value[0]++;
        //console.log("values: ", placeValue)
      }

      useEffect(() => {
        console.log(placeValue)
        console.log("1")
      }, [`${value}`])

      useEffect(() => {
        console.log("XD")
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === activeNode.id) {
              // it's important that you create a new object here
              // in order to notify react flow about the change
              node.data = {
                ...node.data,
                label: placeValue[activeNode.id],
              };
            }
            return node;
          })
        );
      }, [JSON.stringify(placeValue[activeNode.id]), setNodes]);

  return (
    <div className="dndflow">
      <Sidebar nodes={nodes} />
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <button onClick={click}>+</button>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            //fitView
            edgeTypes={edgeTypes}
            connectionLineComponent={FloatingConnectionLine}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onEdgeUpdate={onEdgeUpdate}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            activeNode={activeNode}
          >
            <Background />
          </ReactFlow>
            
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default NodeAsHandleFlow;
