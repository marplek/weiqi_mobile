import React, { useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import Weiqi from '../../utils/JGO/Weiqi';
import Record from '../../utils/JGO/Record';
import SGFConverter from '../../utils/JGO/SGF';
import { Icon } from 'react-native-elements';

const BOARD_SIZE = 19;

const GoBoardPreview = ({ stones, width, height }) => {
  const GRID_SPACING = Math.floor(width / (BOARD_SIZE + 1));
  const STONE_RADIUS = Math.floor(GRID_SPACING * 0.48);
  return (
    <Svg height={height} width={width}>
      <Rect x="0" y="0" width="100%" height="100%" fill="burlywood" />
      {[3, 9, 15].map((row) =>
        [3, 9, 15].map((col) => (
          <Circle
            key={`star-${row}-${col}`}
            cx={(col + 1) * GRID_SPACING}
            cy={(row + 1) * GRID_SPACING}
            r={STONE_RADIUS * 0.4}
            fill="black"
          />
        ))
      )}
      {Array.from({ length: BOARD_SIZE }, (_, i) => i + 1).map((row) => (
        <Line
          key={`row-${row}`}
          x1={GRID_SPACING}
          y1={row * GRID_SPACING}
          x2={GRID_SPACING * BOARD_SIZE}
          y2={row * GRID_SPACING}
          stroke="black"
          strokeWidth={0.5} // Add this line
        />
      ))}
      {Array.from({ length: BOARD_SIZE }, (_, i) => i + 1).map((col) => (
        <Line
          key={`col-${col}`}
          x1={col * GRID_SPACING}
          y1={GRID_SPACING}
          x2={col * GRID_SPACING}
          y2={GRID_SPACING * BOARD_SIZE}
          stroke="black"
          strokeWidth={0.5} // Add this line
        />
      ))}
      {stones.map((rowStones, rowIndex) =>
        rowStones.map((stone, colIndex) => {
          const stoneColor =
            stone === 1 ? 'black' : stone === -1 ? 'white' : null;
          return (
            stoneColor && (
              <Circle
                key={`stone-${rowIndex}-${colIndex}`}
                cx={(colIndex + 1) * GRID_SPACING}
                cy={(rowIndex + 1) * GRID_SPACING}
                r={STONE_RADIUS}
                fill={stoneColor}
              />
            )
          );
        })
      )}
    </Svg>
  );
};

export default GoBoardPreview;
