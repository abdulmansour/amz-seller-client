import {
  faCube,
  faDolly,
  faMoneyCheckDollar,
} from '@fortawesome/free-solid-svg-icons';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SalesCard, { Currency } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/SalesCard',
  component: SalesCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    headerLabel: { defaultValue: 'Today' },
    salesCardItems: {
      defaultValue: [
        {
          label: 'Sales',
          targetCurrency: Currency.USD,
          value: 1000,
          icon: faMoneyCheckDollar,
        },
        {
          label: 'Orders',
          value: 10,
          icon: faDolly,
        },
        {
          label: 'Units',
          value: 11,
          icon: faCube,
        },
      ],
    },
  },
} as ComponentMeta<typeof SalesCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SalesCard> = (args) => (
  <SalesCard {...args} />
);

export const Primary = Template.bind({});
