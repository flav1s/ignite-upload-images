/* eslint-disable no-nested-ternary */
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type infiniteQueryResponseData = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type infiniteQueryResponse = {
  data: infiniteQueryResponseData;
  after: number | null;
};

export default function Home(): JSX.Element {
  const getImages = async ({
    pageParam = null,
  }): Promise<infiniteQueryResponse> => {
    const { data } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<infiniteQueryResponse>('images', getImages, {
    getNextPageParam: (lastPage, pages) => lastPage.after,
  });

  const formattedData = useMemo(() => {
    const cardsData = data?.pages.map(page => page.data).flat();
    return cardsData;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Carregando...'
            : hasNextPage
            ? 'Carregar mais'
            : 'Fim'}
        </Button>
      </Box>
    </>
  );
}
