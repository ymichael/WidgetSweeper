const { widget } = figma;
const {
  AutoLayout,
  SVG,
  Frame,
  Rectangle,
  Ellipse,
  Text,
  useEffect,
  useSyncedState,
  useSyncedMap,
  usePropertyMenu,
} = widget;

const JAM_SVG = `<svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.5 7.36363C0.5 4.87835 2.51472 2.86363 5 2.86363H9C11.4853 2.86363 13.5 4.87835 13.5 7.36363V13.5455C13.5 14.9262 12.3807 16.0455 11 16.0455H3C1.61929 16.0455 0.5 14.9262 0.5 13.5455V7.36363Z" stroke="#F330BD"/>
<rect x="0.5" y="0.5" width="13" height="1.36364" rx="0.681818" fill="#F330BD" stroke="#F330BD"/>
<rect x="0.5" y="2.27272" width="13" height="1.36364" rx="0.681818" fill="#F330BD" stroke="#F330BD"/>
<rect x="0.5" y="4.04546" width="13" height="1.36364" rx="0.681818" fill="#F330BD" stroke="#F330BD"/>
</svg>
`;
const HAPPY_SVG = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="30" height="30" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_5:20" transform="scale(0.00714286)"/>
</pattern>
<image id="image0_5:20" width="140" height="140" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
`;
const SAD_SVG = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="30" height="30" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_5:22" transform="scale(0.00714286)"/>
</pattern>
<image id="image0_5:22" width="140" height="140" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
`;
const CELL_SIZE = 30;
const CELL_GAP = 5;
const PRIMARY_COLOR = "#8610E3";
const SECONDARY_COLOR = "#F0E8F5";

type TCell = { row: number; col: number };

function range(to: number): number[] {
  const ret = [];
  for (let i = 0; i < to; i++) {
    ret.push(i);
  }
  return ret;
}

const toCellKey = ({ row, col }: TCell): string => {
  return `${row}:${col}`;
};

const fromCellKey = (cellKey: string): TCell => {
  const [row, col] = cellKey.split(":");
  return { row: +row, col: +col };
};

const getNeighbors = ({
  cell,
  rowSize,
  colSize,
}: {
  cell: TCell;
  rowSize: number;
  colSize: number;
}): TCell[] => {
  const { row, col } = cell;
  return [
    row !== 0 && { row: row - 1, col }, // top
    row < rowSize - 1 && { row: row + 1, col }, // bottom
    col !== 0 && { row, col: col - 1 }, // left
    col < colSize - 1 && { row, col: col + 1 }, // right
    row < rowSize - 1 && col < colSize - 1 && { row: row + 1, col: col + 1 }, // bottom-right
    row < rowSize - 1 && col !== 0 && { row: row + 1, col: col - 1 }, // bottom-left
    row !== 0 && col < colSize - 1 && { row: row - 1, col: col + 1 }, // top-right
    row !== 0 && col !== 0 && { row: row - 1, col: col - 1 }, // top-left
  ].filter(Boolean);
};

function genAllLocations({
  rowSize,
  colSize,
}: {
  rowSize: number;
  colSize: number;
}): TCell[] {
  const allLocations = [];
  range(rowSize).forEach((row) => {
    range(colSize).forEach((col) => {
      allLocations.push({ row, col });
    });
  });
  return allLocations;
}

function randomMineLocations({
  rowSize,
  colSize,
  numMines,
}: {
  rowSize: number;
  colSize: number;
  numMines: number;
}): { [key: string]: boolean } {
  const mines = [];
  const allLocations = genAllLocations({ rowSize, colSize });

  while (mines.length !== numMines) {
    const randIdx = Math.floor(Math.random() * allLocations.length);
    mines.push(...allLocations.splice(randIdx, 1));
  }

  const ret = {};
  mines.forEach((mine) => {
    ret[toCellKey(mine)] = true;
  });

  return ret;
}

function UnknownCell({ onReveal }: { key: string; onReveal?: () => void }) {
  const clickProps = onReveal ? { onClick: onReveal } : {};
  return (
    <AutoLayout
      width={CELL_SIZE}
      height={CELL_SIZE}
      cornerRadius={2}
      stroke={PRIMARY_COLOR}
      strokeWidth={1}
      fill={SECONDARY_COLOR}
      {...clickProps}
    ></AutoLayout>
  );
}

function RevealedCell({ mineCount }: { key: string; mineCount: number }) {
  return (
    <AutoLayout
      width={CELL_SIZE}
      height={CELL_SIZE}
      cornerRadius={2}
      stroke={mineCount === 0 ? PRIMARY_COLOR : "#8610E3"}
      strokeWidth={1}
      fill={
        mineCount === 0
          ? {
              type: "solid",
              color: PRIMARY_COLOR,
              opacity: 0.3,
            }
          : "#8610E3"
      }
      verticalAlignItems="center"
      horizontalAlignItems="center"
    >
      {mineCount !== 0 && (
        <Text fontFamily="Inter" fontWeight={900} fill="#FFFFFF" fontSize={18}>
          {mineCount}
        </Text>
      )}
    </AutoLayout>
  );
}

function RevealedMine() {
  return (
    <AutoLayout
      width={CELL_SIZE}
      height={CELL_SIZE}
      cornerRadius={2}
      stroke="#F330BD"
      strokeWidth={1}
      fill="#F6B1E3"
      verticalAlignItems="center"
      horizontalAlignItems="center"
    >
      <SVG src={JAM_SVG} />
    </AutoLayout>
  );
}

function Widget() {
  const [mines, setMines] = useSyncedState("mines", {});
  const revealedCells = useSyncedMap<boolean>("revealCells");
  const [[rowSize, colSize, numMines], setGridSize] = useSyncedState(
    "gridSize",
    [8, 8, 10]
  );
  usePropertyMenu(
    [
      {
        itemType: "action",
        tooltip: "Restart",
        propertyName: "restart",
      },
      {
        itemType: "action",
        propertyName: "new-easy",
        tooltip: "New Game (Easy)",
      },
      {
        itemType: "action",
        propertyName: "new-med",
        tooltip: "New Game (Medium)",
      },
      {
        itemType: "action",
        propertyName: "new-expert",
        tooltip: "New Game (Expert)",
      },
      {
        itemType: "action",
        tooltip: "Cheat",
        propertyName: "cheat",
      },
    ],
    ({ propertyName }) => {
      if (propertyName === "restart") {
        revealedCells.keys().forEach((key) => revealedCells.delete(key));
        setMines({});
      } else if (propertyName.startsWith("new-")) {
        revealedCells.keys().forEach((key) => revealedCells.delete(key));
        setMines({});
        if (propertyName === "new-expert") {
          setGridSize([16, 30, 99]);
        } else if (propertyName === "new-med") {
          setGridSize([16, 16, 40]);
        } else {
          setGridSize([8, 8, 10]);
        }
      } else if (propertyName === "cheat") {
        genAllLocations({ rowSize, colSize }).forEach((cell) => {
          const key = toCellKey(cell);
          if (!mines[key]) {
            revealedCells.set(key, true);
          }
        });
      }
    }
  );

  useEffect(() => {
    if (Object.keys(mines).length === 0) {
      setMines(randomMineLocations({ colSize, rowSize, numMines }));
    }
  });

  const totalCells = rowSize * colSize;
  const isGameLost = Object.keys(mines).some((m) => !!revealedCells.get(m));
  const isGameWon =
    !isGameLost &&
    totalCells === revealedCells.size + Object.keys(mines).length;
  const isGameOver = isGameLost || isGameWon;

  const getMineCount = (cell: TCell): number => {
    const neighbors = getNeighbors({ cell, rowSize, colSize });
    return neighbors.reduce((count: number, neighbor: TCell) => {
      return count + (mines[toCellKey(neighbor)] ? 1 : 0);
    }, 0);
  };

  const revealCell = (cell: TCell) => {
    const { row, col } = cell;
    const key = toCellKey(cell);
    revealedCells.set(key, true);
    if (mines[key]) {
      return;
    }

    const mineCount = getMineCount(cell);
    if (mineCount !== 0) {
      return;
    }

    const toVisit = getNeighbors({ cell, rowSize, colSize });
    const revealedCellsSet = new Set(...revealedCells.keys());
    while (toVisit.length) {
      const currCell = toVisit.pop();
      const currCellKey = toCellKey(currCell);
      if (revealedCellsSet.has(currCellKey)) {
        continue;
      }

      const currCellCount = getMineCount(currCell);
      revealedCellsSet.add(currCellKey);
      revealedCells.set(currCellKey, true);
      if (currCellCount === 0) {
        toVisit.push(...getNeighbors({ cell: currCell, rowSize, colSize }));
      }
    }
  };

  return (
    <AutoLayout
      fill={SECONDARY_COLOR}
      stroke={PRIMARY_COLOR}
      direction="vertical"
      width="hug-contents"
      strokeWidth={2}
      cornerRadius={5}
      padding={CELL_GAP}
    >
      <AutoLayout
        height={50}
        width="fill-parent"
        direction="horizontal"
        spacing="auto"
        verticalAlignItems="center"
        horizontalAlignItems="center"
      >
        <AutoLayout width={120}>
          <AutoLayout padding={{ left: 5 }}>
            <AutoLayout
              cornerRadius={2}
              stroke="#F330BD"
              strokeWidth={1}
              fill="#F6B1E3"
              padding={5}
            >
              <Text
                fontFamily="Inter"
                fontWeight={900}
                fill="#FFFFFF"
                fontSize={18}
              >
                {isGameWon ? "YOU WON" : isGameLost ? "YOU LOST" : numMines}
              </Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
        <SVG src={isGameLost ? SAD_SVG : HAPPY_SVG} />
        <AutoLayout width={120}></AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={CELL_GAP} padding={CELL_GAP}>
        {range(rowSize).map((row) => {
          return (
            <AutoLayout key={row} spacing={CELL_GAP} direction="horizontal">
              {range(colSize).map((col) => {
                const cell = { row, col };
                const cellKey = toCellKey(cell);
                if (revealedCells.get(cellKey)) {
                  if (!!mines[cellKey]) {
                    return <RevealedMine key={cellKey} />;
                  } else {
                    return (
                      <RevealedCell
                        mineCount={getMineCount(cell)}
                        key={cellKey}
                      />
                    );
                  }
                } else {
                  return (
                    <UnknownCell
                      key={cellKey}
                      onReveal={
                        isGameOver ? undefined : revealCell.bind(null, cell)
                      }
                    />
                  );
                }
              })}
            </AutoLayout>
          );
        })}
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
