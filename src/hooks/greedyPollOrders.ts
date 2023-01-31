import { getOrdersByDateRange } from './orders';

export const greedyPollOrders = () => {
  const greedyPollCompleted = localStorage.getItem('greedyPollCompleted');
  if (!greedyPollCompleted || greedyPollCompleted !== 'true') {
    setTimeout(() => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.active?.state === 'activated') {
          const poll = async () => {
            await getOrdersByDateRange(new Date('2020-01-01'), new Date());
            localStorage.setItem('greedyPollCompleted', 'true');
          };
          poll();
        }
      });
    }, 3000);
  }
};
