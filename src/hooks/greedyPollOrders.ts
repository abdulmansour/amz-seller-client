import { getOrdersByDateRange } from './orders';

export const greedyPollOrders = () => {
  const greedyPollCompleted = localStorage.getItem('greedyPollCompleted');
  if (!greedyPollCompleted || greedyPollCompleted !== 'true') {
    setTimeout(() => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.active?.state === 'activated') {
          const poll = async () => {
            await getOrdersByDateRange(
              new Date(
                process.env.NEXT_PUBLIC_GREEDY_POLL_START_DATE as string
              ),
              new Date()
            );
            localStorage.setItem('greedyPollCompleted', 'true');
          };
          poll();
        }
      });
    }, 3000);
  }
};
