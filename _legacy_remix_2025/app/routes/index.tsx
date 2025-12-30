import { useState } from 'react';

const results = [
  { result: '大吉', weight: 1 },
  { result: '中吉', weight: 3 },
  { result: '小吉', weight: 5 },
  { result: '凶', weight: 1 },
];

function getRandomOmikuji() {
  const totalWeight = results.reduce((sum, { weight }) => sum + weight, 0);
  let randomNumber = Math.floor(Math.random() * totalWeight);

  for (const { result, weight } of results) {
    if (randomNumber < weight) {
      return result;
    }
    randomNumber -= weight;
  }
}

export default function Index() {
  const [omikuji, setOmikuji] = useState('');

  const handleClick = () => {
    setOmikuji(getRandomOmikuji());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">おみくじ</h1>
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        おみくじを引く
      </button>
      {omikuji && <p className="text-2xl mt-8">{omikuji}</p>}
    </div>
  );
}
