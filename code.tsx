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
<image id="image0_5:20" width="140" height="140" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAPDElEQVR4Ae2dPY/cxhnH7yPwA6hQ6XQq7F5JbQQqhaSICgFuBcSlAB0g7Z6RRJCAqJDc5AwkgAtDcgIIcOFEB8hN1EhV0nl13AtcpDggX2CDH7mzIh8+Q3KXHHKGnAMO3DeS8/Kb//PMMy88OprJ33GyShbJ6toiSW8tkvPjRZL+aZmsXyyS9dtlcrHK/9ebZaL9775/tUzWrziXa9xPVjfuJ6vrXHsmxTjNbFKBVOQyOb8DFPUwaIAc8lm6ygHMQIoQ+Y4WgCyS88cogK4Sh0DQ+ZxXpIm0+V5+k0+fUZGtabn0CBKLWVtfklbM2OQrx6cMFpRkb0j++NGbzdef/mXz8vbDzeu7v928e/Lrzb9Pf7n5z3efZP//e3dlo/2b7/kt53Au1+BaX378DxsgNZ+nq9wPWl3zqWwnkxbUZOuPtDY3wEGl/vOLzzY/fvNzFQQNjkM/4x7c6/nNZ3tBhNONIz6ZyhozI4CySNb3lsm6UU0eXvnX5sXNZ1ml/feHnzkHpAmsi+8+ydQIgIC32WSiOut7x8nq6phlHuS924ICJKgIpqKpAsf+njS2gyeC0xratqB8df1vQUBigxQ/CP+nXnVycFoX3tx+eD9Jb9TFS1CT7+8cb3wwNzYQ9v0cs9WsOpmDHH0c0yBOkp+u1sVOpgiKBItGgMPc4Ou8mL1/8yCPxKoO7RxAkeDwvgkcHGPT2GZzbFKVqZkeDYy6zzBVlIHdx0lXs1GbOlXBmSVIVleYc/rO+DgaOItkfUlZTlZl8uBb+kjLPOaHnsOcYNgnr/VmKn1E2U4KHExQPo2gOphH93JKPZ99QNjnt3Vqs0wmZKIWycU1rbuMqjAms0+hxd9e2by++/mGsqsqNd3vi7DHph4kF7/RwvpPPnoTfRXLQGebRoHa2LrglHmQ5mk7BlRpCc9vPo0mqAMsBijMOEG/qtKsN8F1vW2wfH/nXjRBPcBioOFo634HA40NljdffBZh6RkWAw5+TZBKo8GCgxbCaLIp/FCPhCU0Z9hbpbHBMsTkpVArue90U9ZBQLPtDZVkkYRHWPQpn32DUryeDRpvek95nKUckIuwDA9KEzQMJYwep8kHEVnkVQYmhvnHBQZ48BtlvYwaEc7HhqqwxOjt+LAYtWEMSkLDEM0oY0/LpDqQGOMs/sBioNHjNOmjQaPB2ykKJXqZsW8SGY9+gUN0XSrNYFMjtpOfSrPkGBuKI85+QVJstNSNHHvCCR5kEpYceaZHFCc9+QuLAYcBSyVG88qpadKCc9HJ9R8WA402hODMNG1NUckWRr8lHFgMNHI9lDPTlO+z8iHeEue0hAcL0ODPODdNLBaXXnYcfQ4TGKAhsCrrk4WEvfkz0tGNpihcWIxpYoVGGZpsXnD3yeSaoxt7ReEDQ6+pDAwz9c6PO6mMNlYUo7nhw2JURkaBtw7w4Soj1SU6utOBxeYAH6wymrpER3dawABNbyqjqYuRsnicDjhaN/sglZE9o6gu04FENvjOKiPjLnFwcbqwAI+mMnsNGSyz7dQ/RHVj3GXawACNVBk2eWrVxdbm6Ma4y/SBQWVkXOZ+sm7ewXyZpKfFExmskjYvvp8mQDL6y7b3jSojnd13T34VgXG0YtG3hicnjjcG8pbZTpYffBecXd8yFdPjVt3kSHatWZLmyCdnFxvLsMRX1/+6s7Xs8x9qd9/X/Ly8/Ydd+eKa8EwEq1mSe7n4sia6bj8UMhXakIXP+dHMkgpM/kAqP82RnMBcdMrN65BiRb7np5VZ2j6caidHvpgjbTGWgUQeQxhJDyE/cqMitbckd+P2pXe0z/OI8G98d4pDyI8CdTmIly97/WCOaLm+BOukijS99x2YpvTL78fIjxbEKy2vlf7Llx//3ZuWKguw6f0YBbzPPZvSL7/f59p9/lb6WaXuNcPZxYT64r9QADL6WEynfO0T6LbKCyU/sntdGoxcJOm3xcL3KbahDIrtHPNimnntU7ptwISSH+nHwMiuey2HA3zaOQp7KuVRgsL7UKLSoeTnx29+IRpmusqA0RxeW+sY63OfA12HlEko+ZENM3N8fXZ4ZWUgk8VuKf4AEk+rlb8N4b3v+ZHKnm15Jgcc43QGt4N7IYBs0lhdh53eOpI9JLxjc0I8zhse2VPKJofLEeq4fce8ISmKBCwU/Zhs5NrXIYFiwuPrcSCWi/azrrUExpcpDRGScSAplruc6sDigKNlsn5flB1fxpCKCY+vx4GH7n+RDfb5jcDMZL7uIY3OBkyJokMuHM8ZRwGGKPeywqw3KEwEJqqMNZQi+YjARFissKBgEZgISC0g0sxFYCIwERjZKuL7/pxwTWFiHCaqjqo6tm51BCYCsxcwb4uyM8TQAPNXYkS5P7PhygRXhwbSsyM5n9fVeiRGPpmQY1bVhTBh21VFhHJdOfi4TNKzo6GmN8i5FYATSsH5mk4q1OX8a3V6w1ATqOQsdMxgNEuHmyXpkDJ1tW93QjbybALViXjwhKspmtVZ6OuNK/PnqyL0ma6quVj3rjZyiuYyWd04knvauVyuYfwX42TH6aCHK4xs/ZRpn0ByreKEe65/wp53Qy4zkav+Qlg833cl9HU9WZkuytI0bHPcra+Wk6hcOVLaqr9Ql4j0VfGHXEf6L1QoZXvItWznVF2I7UI2VrPJrrWrJafVfv16Eyed72+WtA5E3w6vvIdYKnt+x8gOR5e+hfRjXEiprdVM5XNp2l34nfJZ11kPySyuZiuHIjAuEmAqS3PWollqrzKaOXKx24b0kTKH1wCjOb6uKlEzSyFsNWaAH/uo+YF9myMNyp3Da6CRy01c+TEUuDRLvHcF6NgV3Pf95XpnF9agGuNJzwwnu+OQmyJqrcQloH1X2ljXk44oboSLclP8l+oW8tKPodW7KhjURKqMi5biKv1jXVeqC2XoYnhF3qfkv+wk5uiICeGXRee3b9tYLGhNZWIX2+78auriwtmVPibPGygyUnotR65ddq81lYm+jA4MTqhs9TRsF+pSNUc1W8cPaZZQG01lXt7+vTNTWFS4kF7LSgQWVz3LKpirGyVVKb7Zdq8HM0uaylAYLk1hSKCQVoZpim4Cr/H3XKiL0jvK97UrQiJfy96S60js67ufqwUSu9n5sxirLd5Nzwg45XSG2ieZGHCkWYJo15UnQ93c88XNp7M3TZopoqxcqKQWrMv2tDNg1B1lEM+VvTQZJ7Gymw00c+41af6dq2409aDA+baOkdJ3y6Q8GDlE70UzTUAzR3+m6kvkGya4CNIBCxZEmj4eRV2Cou6N5vy6VhkSrg1MAqur+TlG4Xw6kldNbV2GOKoxnsLclzpQit/JyeFDqAyky1FSVMZVr8AnUEiLLd7iOgpeVZf1cZGFVq/HUpm6Qpuy0pA3WXFDNBZNXY6T1dVWkMgfjaEydS0NlcO++6YMXdODn6aZIdfKqjXORXKAuhhwxlIZKsBmy2l1Q/hTXSFoe75cLEb++Acg14pa7Ymlq4PVxUAjVYbMuIgyagVsk2nSQJzGdXxIS1Nfn5F2pSubwYKyuIYFdTFwmmMndTHA5CpzsTIX5eg6+lusFE02TVpcS3YxHX2+xgRp/gr5GipPVVgP6BkZSORRPsCCjA3pS9RBQ1oYsBxK9bqAg6pooQPTAOghDpGPqqObPdC8fdxFAqK9l9HfIbrZsnLqCpuW6SqwJdNxyHt8Fc2xNbCQtyFMrNb4SktItMo/5LOT5KercoKVq3XYdRVC66greJ/AAQDSazM/wEJehhwCqZqi9aazo2sD6kFyUVq/RIaHzKwBiVaiDVia1soRcOhNDSHxJl3mCCjcuw5s0kgehkyf1iPrxdG1AcPnmmkaMtOmUjg2tV4DEE465splOoGECuFe5r6249CqQlnRyKoA9+jo2qDRTBOteQj7W4TFvKYgqvGE8u7mxYrDscRfwGnvAhDncg2u1QYS0kCFkdahy4r7KWbx0pkpkvBopmns+SuA8/zmM6UV2eExlUiF449R+VQo/6gX/6gG7/mOSdcAV22pzfcYAxTTqDS/hTqU9er0/SJZPy62XF77EIEFnLamSqa/7/djKYoBhSOgynxRd07h0C6+HTYo7cBJwnzq2hIgQ3UUOa4UoizUQ98DycvbD72Yx6M5uTzziLrT6tT5Z7k/U44CU9A+TnoiTbS2pt7VvqAACNfk2j7lG/+qmpcexoq6UrXd8qy00oBCdD0WUpTdQ16TPgqVisZ/odJRItIuC5rP+A7/BT8GBcHs+ZpH0qXlo/Uc3a5QNJ3PdD6tkH0t0EMAC+UcOyx7TLlsqvA+vicAFKHRVy4OBZsdlg5zXPqAw3YNGzRI/1CFNtf74D/pZshTWAxEGjQoDx77XCvTdb7pmUp1573zsL+p9K5HGzQ+xGlcV97Q19fiLEHBYmCzQRP6TLmhgbDdj3C/FsENEpYP0FR7T2SIsacu4zi2QpzL50SzLcHIy70WoJmK8umYx2mqwT0ctOjX7N+rosw055YIrjdxlq4A2iLCqA0mKqpNMziYoK8//bPNuX072MhzVxjans/4hTZgaUyUT2NQvpk2whK6qmQ9ocejjQ21rfwuv9tOjSgNJQBNVJuqyuCr1My1uRx8ikKXiu9ybp2JApyxplb6oiyYH8rANKTqMT2bnAlqA5St600B+TSZeyiQDCg288Mk/Nmoig0g1EY+TaXYogw4FOZQFTf0fVqAsuEBnbNUFRs4+Yh3tftt4AGcqfWoWoKyup+k9p0sbQU6l89zM2UHB4CYvxLygCYDhTXOrPFdLimLSfeA+oI6N1NMl6gHx6iOTzPdbOaMNDKRvMY/iaB0BagtOMZJxmShPD4EAjE3zMpjhl4LSIAlKkpXYIrn5z5O+s74NE3HfDrl02xS+hAz/7gHgKAilnEeoyDimJ6xCWU0PcXa7vH175KLa/kzEerNlQYUEJn1R4zJoEaYChSpTpXM9/yWczgXMLjWfnDs1i9dsoG29SkhPZZXvFShBPJtSNJTuUmABosHn10uk/NTIIlqUqjEsV5SEfm290j8riUL+R/68/QsKslYROxxX1rwFqDjkyT9tqm31RNg7/N7nd+JKrJHZfn6UwMRZizft+/8lOhp/r9+Lx/2LiDafp++20JxyjVOkvQWPtWcTMz/AW17nhrR2xKfAAAAAElFTkSuQmCC"/>
</defs>
</svg>
`;
const COOL_SVG = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="30" height="30" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_12:50" transform="scale(0.00714286)"/>
</pattern>
<image id="image0_12:50" width="140" height="140" xlink:href="data:image/png;base64,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"/>
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
        tooltip: "Easy",
      },
      {
        itemType: "action",
        propertyName: "new-med",
        tooltip: "Medium",
      },
      {
        itemType: "action",
        propertyName: "new-expert",
        tooltip: "Expert",
      },
      // {
      //   itemType: "action",
      //   tooltip: "Cheat",
      //   propertyName: "cheat",
      // },
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
        <SVG src={isGameLost ? SAD_SVG : isGameWon ? COOL_SVG : HAPPY_SVG} />
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
