import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { Loading } from './Loading';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState('');

  const handleViewImage = (url: string): void => {
    setSelectedImage(url);
    onOpen();
  };

  if (!cards) {
    return <Loading />;
  }

  return (
    <>
      <SimpleGrid spacing="40px" columns={3}>
        {cards.map(card => (
          <Card
            data={card}
            viewImage={() => handleViewImage(card.url)}
            key={card.id}
          />
        ))}
      </SimpleGrid>
      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={selectedImage}
      />
    </>
  );
}
