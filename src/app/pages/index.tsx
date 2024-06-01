import { useState } from 'react';
import Map from '../components/Map';
import PointsList from '../components/PointsList';

interface Point {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

const pointsOfInterest: Point[] = [
  { name: 'Point 1', location: { lat: -3.745, lng: -38.523 } },
  { name: 'Point 2', location: { lat: -3.747, lng: -38.525 } },
  // Adicione mais pontos turísticos aqui
];

const Home: React.FC = () => {
  const [points, setPoints] = useState<Point[]>(pointsOfInterest);

  return (
    <div>
      <h1>Lista de Pontos Turísticos</h1>
      <PointsList points={points} />
      <Map points={points} />
    </div>
  );
}

export default Home;
