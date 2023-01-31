import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LoadingSpinner } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: { loading: { control: 'boolean' } },
} as ComponentMeta<typeof LoadingSpinner>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoadingSpinner> = (args) => (
  <LoadingSpinner {...args} />
);

export const Primary = Template.bind({});
