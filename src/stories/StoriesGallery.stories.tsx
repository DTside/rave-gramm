import type { Meta, StoryObj } from '@storybook/react';
import StoriesGallery, { Story } from '../components/StoriesGallery';

const meta: Meta<typeof StoriesGallery> = {
  title: 'UI/StoriesGallery',
  component: StoriesGallery,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type StoryType = StoryObj<typeof StoriesGallery>;

// Демонстрационные данные
const demoStories: Story[] = [
  {
    id: 1,
    username: 'anna_design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    username: 'travel_mike',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    username: 'food_lover',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
  },
];

export const InstagramStyle: StoryType = {
  args: {
    stories: demoStories,
  },
};