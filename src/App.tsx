import React, { useState, ChangeEvent } from 'react';
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
    <main className="w-screen h-screen flex flex-col bg-gradient-to-t from-yellow-600 to-red-600">
      <h1 className="text-center text-5xl p-5 font-display">Text Ops</h1>
      <input placeholder="Message" className="m-5 rounded" type="text" value={message} onChange={onMessageChange} />
      <p className="text-center">{output}</p>
      <form className="m-5 flex flex-row justify-evenly bg-gray-600 p-5 rounded text-white">
        <label>
          Reverse&nbsp;&nbsp;
          <input id="reverse" type="checkbox" checked={checkboxes.reverse} onChange={onOpsChange} />
        </label>

        <label>
          Weirdify&nbsp;&nbsp;
          <input id="weirdify" type="checkbox" checked={checkboxes.weirdify} onChange={onOpsChange} />
        </label>

        <label>
          Capitalize&nbsp;&nbsp;
          <input id="capitalize" type="checkbox" checked={checkboxes.capitalize} onChange={onOpsChange} />
        </label>

        <label>
          Uncapitalize&nbsp;&nbsp;
          <input id="uncapitalize" type="checkbox" checked={checkboxes.uncapitalize} onChange={onOpsChange} />
        </label>

        <label>
          Owoify&nbsp;&nbsp;
          <input id="owoify" type="checkbox" checked={checkboxes.owoify} onChange={onOpsChange} />
        </label>

        <label>
          Uwuify&nbsp;&nbsp;
          <input id="uwuify" type="checkbox" checked={checkboxes.uwuify} onChange={onOpsChange} />
        </label>
        
        <label>
          Uvuify&nbsp;&nbsp;
          <input id="uvuify" type="checkbox" checked={checkboxes.uvuify} onChange={onOpsChange} />
        </label>
      </form>
    </main>
  );
}

export default App
