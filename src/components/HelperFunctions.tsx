import { CandyColor } from "../types/interfaces";

export const candyColors = ["blue", "orange", "purple", "red", "yellow", "green"];

export const candies: CandyColor[] = candyColors.map((color) => {
  return { color: color, imageSrc: color };
});

export const emptyCandy: CandyColor = { color: "", imageSrc: "./assets/blank-candy.png" };

export const generateNewCandy = (color: string) => {
  const newCandy: CandyColor = { color: color, imageSrc: `src/assets/${color}-candy.png` };
  return newCandy;
};