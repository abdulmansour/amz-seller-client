import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ordersSample } from '@utils/samples';
import SalesCard from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/SalesCard',
  component: SalesCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    orders: { defaultValue: ordersSample },
  },
} as ComponentMeta<typeof SalesCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SalesCard> = (args) => (
  <SalesCard {...args} />
);

export const Primary = Template.bind({});
