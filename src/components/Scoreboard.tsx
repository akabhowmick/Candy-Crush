export const ScoreBoard = ({ score }: { score: number }) => {
  return (
    <div className="score-board">
      <h2>{score}</h2>
    </div>
  );
};
