import { ComponentMeta, ComponentStory } from '@storybook/react';
import { filterOptionsSample } from '@utils/samples';
import FilterGroup from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/FilterGroup',
  component: FilterGroup,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    filterLabel: { defaultValue: 'Filter Label' },
    filterOptions: {
      defaultValue: filterOptionsSample,
    },
    handleFilterChange: { defaultValue: () => null },
  },
} as ComponentMeta<typeof FilterGroup>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FilterGroup> = (args) => (
  <FilterGroup {...args} />
);

export const Primary = Template.bind({});
