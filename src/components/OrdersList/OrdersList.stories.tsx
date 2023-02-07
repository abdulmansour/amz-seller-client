import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ordersSample } from '@utils/samples';
import OrdersList from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/OrdersList',
  component: OrdersList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    orders: { defaultValue: ordersSample },
  },
} as ComponentMeta<typeof OrdersList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OrdersList> = (args) => (
  <OrdersList {...args} />
);

export const Primary = Template.bind({});
