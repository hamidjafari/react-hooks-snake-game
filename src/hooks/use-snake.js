// state.board.width
// state.board.height
// const {cols, rows, apple, board,snake, board} = props.state;

import { useState, useEffect, useRef, cloneElement } from "react";
import { INIT_STATE, EAST, NORTH, SOUTH, WEST } from "../initialState";

export default function useSnake() {
  const [state, setState] = useState(INIT_STATE);
  const currentTimer = useRef(0);
  const currentMove = useRef(INIT_STATE.moves[0]);
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      console.log(e.keyCode);
      const eventToChar = (e) => {
        var codes = {
          100: "d",
          115: "s",
          97: "a",
          119: "w",
          68: "d",
          83: "s",
          65: "a",
          87: "w",
        };
        return codes[e.charCode];
      };
      const char = eventToChar(e);
      currentMove.current =
        char === "d"
          ? EAST
          : char === "s"
          ? SOUTH
          : char === "a"
          ? WEST
          : char === "w"
          ? NORTH
          : currentMove.current;
    });

    currentTimer.current = setInterval(() => {
      let isHitFood = false;
      setState((s) => {
        const { cols, rows, snake, moves, apple } = s;
        const nextMoves = [currentMove.current, ...moves];

        const headNextX = snake[0].x + currentMove.current.x;
        const headNextY = snake[0].y + currentMove.current.y;
        if (headNextX === apple.x && headNextY === apple.y) {
          isHitFood = true;
        }
        if (
          !!snake.find((cell) => cell.x === headNextX && cell.y === headNextY)
        ) {
          return INIT_STATE;
        }
        const movedSnake = snake.map((snakeItem, i) => {
          const [currentX, currentY] = [snakeItem.x, snakeItem.y];
          const nextX = currentX + nextMoves[i].x;
          const nextY = currentY + nextMoves[i].y;

          return {
            x: nextX === cols ? 0 : nextX < 0 ? cols - 1 : nextX,
            y: nextY === rows ? 0 : nextY < 0 ? rows - 1 : nextY,
          };
        });
        if (isHitFood)
          movedSnake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y,
          });
        return {
          ...s,
          snake: movedSnake,
          moves: nextMoves,
          apple: isHitFood
            ? {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
              }
            : apple,
        };
      });
    }, 100);
  }, []);
  return state;
}
