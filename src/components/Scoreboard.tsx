import "../App.css";
export const ScoreBoard = ({ score }: { score: number }) => {
  return (
    <div className="score-board">
      <h2>Your Current Score: {score}</h2>
    </div>
  );
};
