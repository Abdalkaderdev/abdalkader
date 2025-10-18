import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  setup() {
    // Your global setup goes here
  },
  async preVisit(page) {
    // Executed before visiting each story
  },
  async postVisit(page, context) {
    // Executed after visiting each story
  },
  tags: {
    include: ['test'],
    exclude: ['skip-test'],
  },
};

export default config;