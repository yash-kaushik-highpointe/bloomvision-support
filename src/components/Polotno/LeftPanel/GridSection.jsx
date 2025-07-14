import { useState } from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { Grid2x2 as Grid } from "lucide-react";

import { generateGrid, clearGrid } from "../utils";

export default {
  name: "grid",
  Tab: (props) => (
    <SectionTab name="Grid" {...props}>
      <div className="flex items-center w-full justify-center">
        <Grid />
      </div>
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    const [rows, setRows] = useState(2);
    const [columns, setColumns] = useState(2);

    const handleApplyGrid = () => {
      generateGrid(store, rows, columns);
    };

    const handleRemoveGrid = () => {
      clearGrid(store);
    };

    return (
      <div className="p-4">
        <div className="text-lg text-gray-500 text-center">
          Grid: {rows} × {columns}
        </div>

        <hr className="w-[calc(100%+3rem)] -mx-6 my-5 border-t-2 border-[#cdd1bc]" />

        <div className="mt-[2rem]">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Rows:</label>
            <div className="w-25">
              <input
                type="number"
                min={2}
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <label className="text-sm font-medium text-gray-700">
              Columns:
            </label>
            <div className="w-25">
              <input
                type="number"
                min={2}
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 mt-5">
          <button
            onClick={handleApplyGrid}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#7a7a3a] rounded-md focus:outline-none"
          >
            Apply
          </button>
          <button
            onClick={handleRemoveGrid}
            className="w-full px-4 py-2 text-sm font-medium text-[#7a7a3a] rounded-md border border-[#7a7a3a] mt-3 focus:outline-none"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }),
};
