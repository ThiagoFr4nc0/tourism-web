"use client"
import { FC, useState } from 'react';
import { ChakraProvider, Box, Heading, Flex, Text, Spinner } from '@chakra-ui/react';
import Map from './components/Map';
import PointsList from './components/PointsList';
import useCurrentLocation from './hooks/useCurrentLocation';

interface Point {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  phone?: string;
  photos?: string[];
  rating?: number;
}

const Home: FC = () => {
  const { location, error } = useCurrentLocation();
  const [points, setPoints] = useState<Point[]>([]);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);

  const handlePointsUpdate = (points: Point[]) => {
    setPoints(points);
    setLoadingPoints(false);
  };

  if (error) {
    return (
      <ChakraProvider>
        <Box p={4} textAlign="center" color="red.500">Erro: {error}</Box>
      </ChakraProvider>
    );
  }

  if (!location) {
    return (
      <ChakraProvider>
        <Box p={4} textAlign="center">
          <Spinner size="xl" />
          <Text mt={2}>Obtendo localização...</Text>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading as="h1" size="xl" mb={4} textAlign="center" color="teal.500">
          Mapa de Pontos Turísticos
        </Heading>
        <Flex direction="column" alignItems="center">
          <Map center={location} onPointsUpdate={handlePointsUpdate} />
          <PointsList points={points} loading={loadingPoints} />
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default Home;
