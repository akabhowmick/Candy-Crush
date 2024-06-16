import { CandyColor } from "../types/interfaces";

export const candyColors = ["blue", "orange", "purple", "red", "yellow", "green"];

export const emptyCandy: CandyColor = { color: "", imageSrc: "" };

export const generateNewCandy = (color: string) => {
  const newCandy: CandyColor = { color: color, imageSrc: color };
  return newCandy;
};
