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
      // TODO game is over
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
      <AutoLayout height={50} width="fill-parent"></AutoLayout>
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
