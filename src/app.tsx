import { useMemo, useState } from "react";
import { Datamatrix } from "./components/datamatrix";
import useLocalStorage from "./hooks/use-local-storage";

export const App = () => {
  const [fileContents, setFileContents] = useState<string[]>([]);
  const [usedCiids, setUsedCiids] = useLocalStorage<string[]>("usedCiids", []);

  const processedLines = useMemo(() => {
    return fileContents
      .map((x) => x.trim())
      .filter(Boolean)
      .map((line) => {
        const [ciid, , winType, amount] = line.split(";").map((part) => part.trim());
        return { ciid, winType: winType ?? "none", amount };
      });
  }, [fileContents]);

  const hasUploadedFile = fileContents.length > 0;

  return (
    <main className="max-w-md mx-auto">
      {!hasUploadedFile && (
        <input
          type="file"
          onChange={(e) => {
            e.currentTarget.files?.[0].text().then((text) => {
              setFileContents(text.split("\n"));
            });
          }}
        />
      )}
      <ul className="grid">
        {hasUploadedFile &&
          (processedLines.length === 0 ? (
            <div className="h-dvh snap-center">
              <p className="text-center">No valid lines found.</p>
              <button onClick={() => setFileContents([])}>Reset file</button>
            </div>
          ) : (
            <>
              {processedLines.map((line, index) => {
                const isUsed = usedCiids.includes(line.ciid);
                return (
                  <li
                    key={line.ciid}
                    data-order={index}
                    className={`h-dvh snap-center max-w-full flex flex-col gap-4 justify-center ${isUsed ? "bg-red-300" : ""}`}
                  >
                    <p className="text-xl text-center">
                      {line.winType}: {line.amount}
                    </p>
                    <Datamatrix data={line.ciid} />
                    <p className="text-center text-lg">ciid: {line.ciid}</p>

                    <button
                      onClick={() => {
                        setUsedCiids([...usedCiids, line.ciid]);
                        document.querySelector(`[data-order="${index + 1}"]`)?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      {isUsed ? "Already scanned" : "Mark as scanned"}
                    </button>
                  </li>
                );
              })}
              <li className="h-dvh snap-center flex flex-col gap-4 justify-center">
                <button onClick={() => setFileContents([])}>Upload new file</button>
              </li>
            </>
          ))}
      </ul>
    </main>
  );
};
