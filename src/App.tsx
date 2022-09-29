import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api";
import { useDrop } from "react-dnd";

import { Op, OpItem } from "./op";

import handleChange from "./functions/handleChange";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");
  const [opArr, setOpArr] = useState<string[]>([]);
  const [opBank, setOpBank] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const findCard = useCallback(
    (id: string) => {
      let index: number;
      let bank: boolean;

      const find = opBank.find((c) => c === id);

      if (find !== undefined) {
        index = opBank.indexOf(id);
        bank = true;
      } else {
        index = opArr.indexOf(id);
        bank = false;
      }

      return {
        index: index,
        bank,
      };
    },
    [opArr, opBank]
  );

  const moveCard = useCallback(
    (id: string, to: number, toBank: boolean) => {
      const { index, bank } = findCard(id);

      const newOpBank = [...opBank];
      const newOpArr = [...opArr];

      if (bank) {
        newOpBank.splice(index, 1);
      } else {
        newOpArr.splice(index, 1);
      }

      if (toBank) {
        newOpBank.splice(to, 0, id);
      } else {
        newOpArr.splice(to, 0, id);
      }

      setOpBank(newOpBank);
      setOpArr(newOpArr);
    },
    [findCard, opArr, setOpArr, opBank, setOpBank]
  );

  const onArrHover = useCallback(
    ({ id: draggedId }: OpItem) => {
      if (opArr.length === 0) {
        moveCard(draggedId, 0, false);
      }
    },
    [opArr, moveCard]
  );

  const [, arrDrop] = useDrop(
    () => ({
      accept: "op",
      hover: onArrHover,
    }),
    [onArrHover]
  );

  const onBankHover = useCallback(
    ({ id: draggedId }: OpItem) => {
      if (opBank.length === 0) {
        moveCard(draggedId, 0, true);
      }
    },
    [opBank, moveCard]
  );

  const [, bankDrop] = useDrop(
    () => ({
      accept: "op",
      hover: onBankHover,
    }),
    [onBankHover]
  );

  useEffect(() => {
    invoke("get_ops").then((ops) => {
      setOpBank(ops as string[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    invoke("transform", { message, ops: opArr }).then((transformed) => {
      setOutput(transformed as string);
    });
  }, [message, opArr]);

  const onMessageChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(setMessage)(event);
      const transformed = (await invoke("transform", {
        message: event.target.value,
        ops: opArr,
      })) as string;
      setOutput(transformed);
    },
    [opArr]
  );

  return loading ? null : (
    <main className="flex h-screen w-screen flex-col bg-gradient-to-t from-yellow-600 to-red-600">
      <h1 className="p-5 text-center font-display text-5xl">Text Ops</h1>
      <input
        placeholder="Message"
        className="m-5 rounded"
        type="text"
        value={message}
        onChange={onMessageChange}
      />
      <p className="text-center">{output}</p>
      <div
        ref={arrDrop}
        className="m-5 flex flex-row justify-evenly rounded bg-gray-600 p-5 text-white"
      >
        {opArr.length == 0 ? (
          <p draggable="false">Empty</p>
        ) : (
          opArr.map((op, i) => {
            return (
              <Op
                key={i}
                id={op}
                findCard={findCard}
                moveCard={moveCard}
                bank={false}
              />
            );
          })
        )}
      </div>
      <div
        ref={bankDrop}
        className="m-5 flex flex-row justify-evenly rounded bg-gray-600 p-5 text-white"
      >
        {opBank.map((op, i) => {
          return (
            <Op
              key={i}
              id={op}
              findCard={findCard}
              moveCard={moveCard}
              bank={true}
            />
          );
        })}
      </div>
    </main>
  );
}

export default App;
