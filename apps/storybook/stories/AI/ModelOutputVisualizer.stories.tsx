import type { Meta, StoryObj } from '@storybook/react';
import { ModelOutputVisualizer, ModelOutput } from '@abdalkader/ui';
import React from 'react';

const meta: Meta<typeof ModelOutputVisualizer> = {
  title: 'AI Components/ModelOutputVisualizer',
  component: ModelOutputVisualizer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A component for visualizing various types of AI model outputs including text, JSON, code, tables, markdown, and HTML.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showMetadata: {
      control: 'boolean',
      description: 'Show output metadata',
    },
    showRaw: {
      control: 'boolean',
      description: 'Show raw output toggle',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of output area',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const jsonOutput: ModelOutput = {
  type: 'json',
  content: {
    result: 'success',
    data: {
      predictions: [
        { label: 'cat', confidence: 0.95 },
        { label: 'dog', confidence: 0.03 },
      ],
      processingTime: 234,
    },
  },
  metadata: {
    model: 'GPT-4',
    timestamp: new Date(),
    tokens: 156,
    processingTime: 234,
  },
};

const codeOutput: ModelOutput = {
  type: 'code',
  content: `function predictImage(image) {
  const model = loadModel('resnet50');
  const predictions = model.predict(image);
  return predictions.map(p => ({
    label: p.label,
    confidence: p.confidence.toFixed(2)
  }));
}`,
  metadata: {
    model: 'Code Generator',
    timestamp: new Date(),
    tokens: 89,
  },
};

const tableOutput: ModelOutput = {
  type: 'table',
  content: [
    { name: 'Alice', age: 30, score: 95 },
    { name: 'Bob', age: 25, score: 87 },
    { name: 'Charlie', age: 35, score: 92 },
  ],
  metadata: {
    model: 'Data Processor',
    timestamp: new Date(),
  },
};

const markdownOutput: ModelOutput = {
  type: 'markdown',
  content: `# AI Analysis Report

## Summary
This document contains the results of the AI analysis.

### Key Findings
- **Finding 1**: Important discovery
- **Finding 2**: Another important point

## Conclusion
The analysis shows promising results.`,
  metadata: {
    model: 'Markdown Generator',
    timestamp: new Date(),
    tokens: 145,
  },
};

const htmlOutput: ModelOutput = {
  type: 'html',
  content: `<div class="result">
  <h1>Analysis Results</h1>
  <p>This is <strong>formatted</strong> HTML output.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>`,
  metadata: {
    model: 'HTML Generator',
    timestamp: new Date(),
  },
};

const textOutput: ModelOutput = {
  type: 'text',
  content:
    'This is a plain text output from an AI model. It can contain multiple paragraphs and various types of content. The component handles text wrapping and formatting automatically.',
  metadata: {
    model: 'Text Generator',
    timestamp: new Date(),
    tokens: 42,
    processingTime: 890,
  },
};

export const JSONOutput: Story = {
  args: {
    output: jsonOutput,
    showMetadata: true,
    showRaw: true,
  },
};

export const CodeOutput: Story = {
  args: {
    output: codeOutput,
    showMetadata: true,
    showRaw: true,
  },
};

export const TableOutput: Story = {
  args: {
    output: tableOutput,
    showMetadata: true,
  },
};

export const MarkdownOutput: Story = {
  args: {
    output: markdownOutput,
    showMetadata: true,
  },
};

export const HTMLOutput: Story = {
  args: {
    output: htmlOutput,
    showMetadata: true,
  },
};

export const TextOutput: Story = {
  args: {
    output: textOutput,
    showMetadata: true,
  },
};

export const WithoutMetadata: Story = {
  args: {
    output: jsonOutput,
    showMetadata: false,
    showRaw: true,
  },
};

export const WithoutRawToggle: Story = {
  args: {
    output: codeOutput,
    showMetadata: true,
    showRaw: false,
  },
};

export const LongOutput: Story = {
  args: {
    output: {
      type: 'text',
      content: Array(20)
        .fill('This is a very long output that demonstrates how the component handles lengthy content. ')
        .join(''),
      metadata: {
        model: 'Long Text Generator',
        timestamp: new Date(),
        tokens: 500,
      },
    },
    showMetadata: true,
    maxHeight: '300px',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <ModelOutputVisualizer output={jsonOutput} showMetadata={true} showRaw={true} />
      <ModelOutputVisualizer output={codeOutput} showMetadata={true} showRaw={true} />
      <ModelOutputVisualizer output={tableOutput} showMetadata={true} />
      <ModelOutputVisualizer output={markdownOutput} showMetadata={true} />
      <ModelOutputVisualizer output={textOutput} showMetadata={true} />
    </div>
  ),
};

