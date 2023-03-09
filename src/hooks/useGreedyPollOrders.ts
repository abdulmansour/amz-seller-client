import { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { AuthContext } from 'src/contexts/AuthContext';
import { getOrdersByDateRange } from './useOrders';

export const useGreedyPollOrders = () => {
  const { user } = useContext(AuthContext);

  if (user && !isMobile) {
    const forceGreedyPoll = process.env.NEXT_PUBLIC_GREEDY_POLL_FORCE as string;
    const greedyPollCompleted = localStorage.getItem('greedyPollCompleted');

    if (
      forceGreedyPoll === 'true' ||
      !greedyPollCompleted ||
      greedyPollCompleted !== 'true'
    ) {
      setTimeout(() => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration?.active?.state === 'activated') {
            const poll = async () => {
              await getOrdersByDateRange(
                new Date(
                  process.env.NEXT_PUBLIC_GREEDY_POLL_START_DATE as string
                ),
                new Date(),
                user
              );
              localStorage.setItem('greedyPollCompleted', 'true');
            };
            poll();
          }
        });
      }, 3000);
    }
  }
};
