import "./App.css";
import { useEffect, useState } from "react";
import { Datamatrix } from "./components/datamatrix";

const LOCAL_STORAGE_KEY = "fileContents";

function App() {
  const [fileContents, setFileContents] = useState<string[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]")
  );
  const [itemsToShow, setItemsToShow] = useState<number>(12);
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fileContents));
  }, [fileContents]);

  useEffect(() => {
    setList(fileContents.slice(0, itemsToShow));
  }, [fileContents, itemsToShow]);

  return (
    <>
      <div className="menu-bar">
        <div>
          <label htmlFor="file-input">Upload a file</label>
          <input
            id="file-input"
            type="file"
            onChange={(e) => {
              e.currentTarget.files?.[0].text().then((text) => {
                setFileContents(text.split("\n"));
              });
            }}
          />
        </div>
        <div>
          <label htmlFor="items-to-show">Items to show</label>
          <input
            id="items-to-show"
            type="number"
            value={itemsToShow}
            onChange={(e) => setItemsToShow(parseInt(e.target.value))}
          />
        </div>
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
        {list.map((data, index) => (
          <li key={index} className="matrix-item">
            <Datamatrix data={data} />

            <p>{data}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
