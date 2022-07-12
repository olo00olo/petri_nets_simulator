import DnDFlow from './components/draganddrop';
// import NodeAsHandleFlow from './test/test';
import NodeAsHandleFlow from './test2/test';
// import NodeAsHandleFlow from './straight/test';
import TextUpdaterNode from './text/App';

function App() {
  return (
    <div className="root" style={{width: '100%', height: '100vh'}}>
      <NodeAsHandleFlow/>
      {/* <TextUpdaterNode/> */}
    </div>
  );
}

export default App;
