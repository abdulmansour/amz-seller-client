import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ordersSample } from '@utils/samples';
import MapOrders from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/MapOrders',
  component: MapOrders,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    orders: { defaultValue: ordersSample },
    clusterize: { control: 'boolean' },
  },
} as ComponentMeta<typeof MapOrders>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MapOrders> = (args) => (
  <MapOrders {...args} />
);

export const Primary = Template.bind({});
