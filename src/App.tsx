import { useState, ChangeEvent } from 'react';
import { invoke } from '@tauri-apps/api';

import handleChange from './functions/handleChange';

import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const [output, setOutput] = useState('');
  const [ops, setOps] = useState(['']);
  const [checkboxes, setCheckboxes] = useState({
    reverse: false,
    weirdify: false,
    capitalize: false,
    uncapitalize: false,
    owoify: false,
    uwuify: false,
    uvuify: false
  });

  async function onMessageChange(event: ChangeEvent<HTMLInputElement>) {
    handleChange(setMessage)(event);
    const transformed = await invoke('transform', { message: event.target.value, ops: ops[0] == '' ? [] : ops }) as string;
    setOutput(transformed);
  }

  async function onOpsChange(event: ChangeEvent<HTMLInputElement>) {
    const newCheckboxes = { ...checkboxes, [event.target.id]: event.target.checked };
    setCheckboxes(newCheckboxes);
    const newOps = Object.entries(newCheckboxes).map(([k, v]) => v == true ? k : null).filter(v => v != null) as string[]
    setOps(newOps);

    const transformed = await invoke('transform', { message, ops: newOps[0] == '' ? [] : newOps }) as string;
    setOutput(transformed);
  }

  return (
    <main>
      <h1>Text Ops</h1>
      <input type="text" value={message} onChange={onMessageChange} />
      <form>
        <label>
          Reverse
          <input id="reverse" type="checkbox" checked={checkboxes.reverse} onChange={onOpsChange} />
        </label>

        <label>
          Weirdify
          <input id="weirdify" type="checkbox" checked={checkboxes.weirdify} onChange={onOpsChange} />
        </label>

        <label>
          Capitalize
          <input id="capitalize" type="checkbox" checked={checkboxes.capitalize} onChange={onOpsChange} />
        </label>

        <label>
          Uncapitalize
          <input id="uncapitalize" type="checkbox" checked={checkboxes.uncapitalize} onChange={onOpsChange} />
        </label>

        <label>
          Owoify
          <input id="owoify" type="checkbox" checked={checkboxes.owoify} onChange={onOpsChange} />
        </label>

        <label>
          Uwuify
          <input id="uwuify" type="checkbox" checked={checkboxes.uwuify} onChange={onOpsChange} />
        </label>
        
        <label>
          Uvuify
          <input id="uvuify" type="checkbox" checked={checkboxes.uvuify} onChange={onOpsChange} />
        </label>
      </form>
      <p>{output}</p>
    </main>
  );
}

export default App
