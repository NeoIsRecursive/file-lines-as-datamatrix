import "./App.css";
import { useEffect, useState } from "react";
import { Datamatrix } from "./components/datamatrix";
import { Input } from "./components/input";
import useLocalStorage from "./hooks/use-local-storage";

const KEYS = {
  REGEXP: "regexp",
  PRINT_DATA: "print-data",
  PRINT_REST: "print-rest",
  ITEMS_TO_SHOW: "items-to-show",
  FILE_CONTENTS: "fileContents",
};

function App() {
  const [fileContents, setFileContents] = useLocalStorage<string[]>(
    KEYS.FILE_CONTENTS,
    []
  );
  const [itemSpanToShow, setItemSpanToShow] = useLocalStorage(
    KEYS.ITEMS_TO_SHOW,
    String(9)
  );
  const [list, setList] = useState<string[]>([]);
  const [regex, setRegex] = useLocalStorage<RegExp | null>(KEYS.REGEXP, null, {
    serializer: (value) => value?.source ?? "",
    deserializer: (value) => (value ? new RegExp(value) : null),
  });
  const [printMatchedDataValue, setPrintMatchedDataValue] = useLocalStorage(
    KEYS.PRINT_DATA,
    false
  );
  const [printRestValue, setPrintRestValue] = useLocalStorage(
    KEYS.PRINT_REST,
    true
  );

  useEffect(() => {
    let [start, end] = itemSpanToShow.split("-").map((n) => Number(n));

    if (!end || isNaN(end)) {
      end = start;
      start = 0;
    }

    if (end < start) {
      end = start + 12;
    }

    setList(fileContents.slice(start, end));
  }, [fileContents, itemSpanToShow]);

  return (
    <>
      <div className="menu-bar exclude-from-print">
        <Input
          label="Data Regexp"
          id="regexp"
          type="text"
          value={regex?.source ?? ""}
          onChange={(e) => {
            if (!e.currentTarget.value) return setRegex(null);
            try {
              const regexp = new RegExp(e.currentTarget.value);
              setRegex(regexp);
            } catch (e) {
              setRegex(null);
            }
          }}
        />
        <Input
          label="Print data value"
          id="print-data"
          checked={printMatchedDataValue}
          type="checkbox"
          onChange={(e) => {
            setPrintMatchedDataValue(e.currentTarget.checked);
          }}
        />
        <Input
          label="Print rest value"
          id="print-rest"
          type="checkbox"
          checked={printRestValue}
          onChange={(e) => {
            setPrintRestValue(e.currentTarget.checked);
          }}
        />
      </div>
      <div className="menu-bar exclude-from-print">
        <Input
          label="Upload a file"
          id="file-input"
          type="file"
          onChange={(e) => {
            e.currentTarget.files?.[0].text().then((text) => {
              setFileContents(text.split("\n"));
            });
          }}
        />
        <Input
          id="items-to-show"
          label="Items to show"
          type="text"
          value={itemSpanToShow}
          onChange={(e) => {
            setItemSpanToShow(e.target.value);
          }}
        />
        {fileContents.length ? (
          <div>
            <p>
              Showing {list.length} of {fileContents.length} items
            </p>
            <br />
            <button onClick={() => window.print()}>Print</button>
            <br />
            <button onClick={() => setFileContents([])}>Clear</button>
          </div>
        ) : (
          <p>
            Upload a text file and we will render a datamatrix for each line.
            Will persist in localstorage
          </p>
        )}
      </div>

      <ul>
        {list.map((data, index) => {
          let match: string | null = data;
          if (regex) match = data?.match(regex)?.[0] ?? null;
          if (!match) return null;

          const rest = match ? data.replace(match, "") : data;
          return (
            <li key={index} className="matrix-item">
              <Datamatrix data={match} />

              <p className={printMatchedDataValue ? "" : "exclude-from-print"}>
                {match}
              </p>
              {rest && (
                <p className={printRestValue ? "" : "exclude-from-print"}>
                  {rest}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
