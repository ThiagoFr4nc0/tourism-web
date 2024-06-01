import { FC } from 'react';
import { Box, List, ListItem, Spinner, Text, Image, Flex } from '@chakra-ui/react';

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

interface PointsListProps {
  points: Point[];
  loading: boolean;
}

const PointsList: FC<PointsListProps> = ({ points, loading }) => {
  return (
    <Box mt={4} width="100%">
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
          <Text ml={2}>Carregando pontos turísticos...</Text>
        </Box>
      ) : (
        <List spacing={3}>
          {points.map((point, index) => (
            <ListItem key={index} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
              <Flex alignItems="center">
                <Box flex="1">
                  <Text fontWeight="bold">{point.name}</Text>
                  <Text>{point.address}</Text>
                  <Text>{point.phone}</Text>
                  <Text>Rating: {point.rating}</Text>
                </Box>
                {point.photos && point.photos.length > 0 && (
                  <Box ml={4}>
                    <Image src={point.photos[0]} alt={point.name} width={100} height={100} objectFit="cover" />
                  </Box>
                )}
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PointsList;
