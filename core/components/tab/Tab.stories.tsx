import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tab, TabList, TabTrigger, TabContent } from './Tab';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab',
  component: Tab,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tab>;

const STYLE_TABS = [
  { value: 'all', label: 'All styles' },
  { value: 'minimal-luxury', label: 'Minimal Luxury' },
  { value: 'clean-minimal', label: 'Clean Minimal' },
  { value: 'organic-warm', label: 'Organic Warm' },
  { value: 'dark-moody', label: 'Dark Moody' },
  { value: 'vibrant-pop', label: 'Vibrant Pop' },
];

/** Matches the design — underline indicator, bold active tab */
export const Default: Story = {
  render: () => (
    <Tab defaultValue="all">
      <TabList>
        {STYLE_TABS.map((tab) => (
          <TabTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabTrigger>
        ))}
      </TabList>

      {STYLE_TABS.map((tab) => (
        <TabContent
          key={tab.value}
          value={tab.value}
          className="text-muted-foreground pt-4 text-sm"
        >
          Content for <span className="text-foreground font-medium">{tab.label}</span>
        </TabContent>
      ))}
    </Tab>
  ),
};

export const FewTabs: Story = {
  render: () => (
    <Tab defaultValue="overview">
      <TabList>
        <TabTrigger value="overview">Overview</TabTrigger>
        <TabTrigger value="analytics">Analytics</TabTrigger>
        <TabTrigger value="settings">Settings</TabTrigger>
      </TabList>
      <TabContent value="overview" className="text-muted-foreground pt-4 text-sm">
        Overview content
      </TabContent>
      <TabContent value="analytics" className="text-muted-foreground pt-4 text-sm">
        Analytics content
      </TabContent>
      <TabContent value="settings" className="text-muted-foreground pt-4 text-sm">
        Settings content
      </TabContent>
    </Tab>
  ),
};
