import React, { useState } from "react";
import Svg, { Circle, Line, Rect, Path } from "react-native-svg";

import { Text as SvgText } from "react-native-svg";

const WeiqiBoard = ({
  boardSize,
  SCREEN_WIDTH,
  stones,
  markers,
  onPress,
  selectedLetter,
  currentMove,
}) => {
  const boardWidth = Math.floor(SCREEN_WIDTH * 0.91);
  const restWidth = Math.floor(SCREEN_WIDTH * 0.045);
  const gridSpacing = boardWidth / (boardSize - 1);
  const stoneRadius = Math.floor(gridSpacing * 0.48);
  const renderMarker = (markerType, x, y) => {
    const centerX = restWidth + x * gridSpacing;
    const centerY = restWidth + y * gridSpacing;
    const stoneColor = stones[y][x];
    const markerColor =
      stoneColor === 1 ? "white" : stoneColor === -1 ? "black" : "saddlebrown";

    const renderBackgroundCircle = () => {
      if (stoneColor === 0) {
        return (
          <Circle
            cx={centerX}
            cy={centerY}
            r={stoneRadius * 0.7}
            fill="burlywood"
            stroke="burlywood"
            strokeWidth={2}
          />
        );
      } else {
        return null;
      }
    };

    if (/^[A-Za-z]$/.test(markerType)) {
      return (
        <>
          {renderBackgroundCircle()}
          <SvgText
            x={centerX}
            y={centerY}
            fill={markerColor}
            fontSize={stoneRadius * 2}
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {markerType}
          </SvgText>
        </>
      );
    }

    switch (markerType) {
      case "cir":
        return (
          <>
            {renderBackgroundCircle()}
            <Circle
              cx={centerX}
              cy={centerY}
              r={stoneRadius * 0.5}
              stroke={markerColor}
              strokeWidth={2}
              fill="none"
            />
          </>
        );
      case "tri":
        return (
          <>
            {renderBackgroundCircle()}
            <Path
              d={`M ${centerX},${centerY - stoneRadius * 0.5} L ${
                centerX + stoneRadius * 0.5
              },${centerY + stoneRadius * 0.5} L ${
                centerX - stoneRadius * 0.5
              },${centerY + stoneRadius * 0.5} Z`}
              stroke={markerColor}
              strokeWidth={1}
              fill="none"
            />
          </>
        );
      case "rec":
        return (
          <>
            {renderBackgroundCircle()}
            <Rect
              x={centerX - stoneRadius * 0.5}
              y={centerY - stoneRadius * 0.5}
              width={stoneRadius * 0.8}
              height={stoneRadius * 0.8}
              stroke={markerColor}
              strokeWidth={2}
              fill="none"
            />
          </>
        );
      case "clo":
        return (
          <>
            {renderBackgroundCircle()}
            <Line
              x1={centerX - stoneRadius * 0.5}
              y1={centerY - stoneRadius * 0.5}
              x2={centerX + stoneRadius * 0.5}
              y2={centerY + stoneRadius * 0.5}
              stroke={markerColor}
              strokeWidth={2}
            />
            <Line
              x1={centerX + stoneRadius * 0.5}
              y1={centerY - stoneRadius * 0.5}
              x2={centerX - stoneRadius * 0.5}
              y2={centerY + stoneRadius * 0.5}
              stroke={markerColor}
              strokeWidth={2}
            />
          </>
        );

      default:
        return null;
    }
  };
  return (
    <Svg
      height={SCREEN_WIDTH}
      width={gridSpacing * (boardSize + 1)}
      onPress={onPress}
    >
      <Rect x="0" y="0" width="100%" height="100%" fill="burlywood" />
      {[4, 10, 16].map((row) =>
        [4, 10, 16].map((col) => (
          <Circle
            key={`star-${row}-${col}`}
            cx={restWidth + (col - 1) * gridSpacing}
            cy={restWidth + (row - 1) * gridSpacing}
            r={stoneRadius * 0.4}
            fill="black"
          />
        ))
      )}
      {Array.from({ length: boardSize }, (_, i) => i + 1).map((row) => (
        <Line
          key={`row-${row}`}
          x1={restWidth}
          y1={restWidth + (row - 1) * gridSpacing}
          x2={restWidth + gridSpacing * (boardSize - 1)}
          y2={restWidth + (row - 1) * gridSpacing}
          stroke="black"
        />
      ))}
      {Array.from({ length: boardSize }, (_, i) => i + 1).map((col) => (
        <Line
          key={`col-${col}`}
          x1={restWidth + (col - 1) * gridSpacing}
          y1={restWidth}
          x2={restWidth + (col - 1) * gridSpacing}
          y2={restWidth + gridSpacing * (boardSize - 1)}
          stroke="black"
        />
      ))}
      {stones.map((rowStones, rowIndex) =>
        rowStones.map((stone, colIndex) => {
          const stoneColor =
            stone === 1 ? "black" : stone === -1 ? "white" : null;
          return (
            stoneColor && (
              <Circle
                key={`stone-${rowIndex}-${colIndex}`}
                cx={restWidth + colIndex * gridSpacing}
                cy={restWidth + rowIndex * gridSpacing}
                r={stoneRadius}
                fill={stoneColor}
              />
            )
          );
        })
      )}
      {markers.map((rowMarkers, rowIndex) =>
        rowMarkers.map((marker, colIndex) => {
          return renderMarker(marker, colIndex, rowIndex, selectedLetter);
        })
      )}
    </Svg>
  );
};

export default WeiqiBoard;
