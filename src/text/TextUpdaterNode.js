import { Handle, Position } from 'react-flow-renderer';

const handleStyle = { bottom: 0 };

var i = 5;
function TextUpdaterNode() {
  function increment() {
    document.getElementById('inc').innerHTML = ++i;
  }

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} />
      <div>
        <button type="button" onClick={increment}></button><br></br>
        {/* <input type="text" id="inc" value="0"></input> */}
        <h5 id="inc">{i}</h5>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} />
    </div>
  );
}

export default TextUpdaterNode;
