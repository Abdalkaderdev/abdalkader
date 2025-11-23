import type { Meta, StoryObj } from '@storybook/react';
import { PredictionDisplay, Prediction } from '@abdalkader/ui';
import React from 'react';

const meta: Meta<typeof PredictionDisplay> = {
  title: 'AI Components/PredictionDisplay',
  component: PredictionDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A component for displaying AI model predictions with confidence scores. Supports bar charts, pie charts, and list views.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['bar', 'pie', 'list'],
      description: 'Visualization variant',
    },
    showConfidence: {
      control: 'boolean',
      description: 'Show confidence scores',
    },
    showValues: {
      control: 'boolean',
      description: 'Show prediction values',
    },
    maxDisplayItems: {
      control: 'number',
      description: 'Maximum items to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const samplePredictions: Prediction[] = [
  { label: 'Cat', value: 0.95, confidence: 0.95, color: '#4caf50' },
  { label: 'Dog', value: 0.03, confidence: 0.03, color: '#ff9800' },
  { label: 'Bird', value: 0.015, confidence: 0.015, color: '#2196f3' },
  { label: 'Other', value: 0.005, confidence: 0.005, color: '#9e9e9e' },
];

const sentimentPredictions: Prediction[] = [
  { label: 'Positive', value: 0.78, confidence: 0.78, color: '#4caf50' },
  { label: 'Neutral', value: 0.15, confidence: 0.15, color: '#ff9800' },
  { label: 'Negative', value: 0.07, confidence: 0.07, color: '#f44336' },
];

const classificationPredictions: Prediction[] = [
  { label: 'Technology', value: 0.45, confidence: 0.45 },
  { label: 'Science', value: 0.28, confidence: 0.28 },
  { label: 'Health', value: 0.15, confidence: 0.15 },
  { label: 'Education', value: 0.08, confidence: 0.08 },
  { label: 'Other', value: 0.04, confidence: 0.04 },
];

export const BarChart: Story = {
  args: {
    predictions: samplePredictions,
    title: 'Image Classification',
    modelName: 'ResNet-50',
    variant: 'bar',
    showConfidence: true,
    showValues: true,
  },
};

export const PieChart: Story = {
  args: {
    predictions: sentimentPredictions,
    title: 'Sentiment Analysis',
    modelName: 'BERT',
    variant: 'pie',
    showConfidence: true,
    showValues: true,
  },
};

export const ListView: Story = {
  args: {
    predictions: classificationPredictions,
    title: 'Document Classification',
    modelName: 'GPT-4',
    variant: 'list',
    showConfidence: true,
    showValues: true,
  },
};

export const WithoutConfidence: Story = {
  args: {
    predictions: samplePredictions.map((p) => ({ ...p, confidence: undefined })),
    title: 'Predictions',
    variant: 'bar',
    showConfidence: false,
    showValues: true,
  },
};

export const WithoutValues: Story = {
  args: {
    predictions: samplePredictions,
    title: 'Predictions',
    variant: 'bar',
    showConfidence: true,
    showValues: false,
  },
};

export const ManyPredictions: Story = {
  args: {
    predictions: Array.from({ length: 15 }, (_, i) => ({
      label: `Category ${i + 1}`,
      value: Math.random() * 0.5,
      confidence: Math.random(),
    })),
    title: 'Multi-class Classification',
    modelName: 'Custom Model',
    variant: 'bar',
    maxDisplayItems: 10,
    showConfidence: true,
    showValues: true,
  },
};

export const CustomColors: Story = {
  args: {
    predictions: [
      { label: 'High Confidence', value: 0.9, confidence: 0.9, color: '#4caf50' },
      { label: 'Medium Confidence', value: 0.6, confidence: 0.6, color: '#ff9800' },
      { label: 'Low Confidence', value: 0.3, confidence: 0.3, color: '#f44336' },
    ],
    title: 'Confidence Levels',
    variant: 'bar',
    showConfidence: true,
    showValues: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <PredictionDisplay
        predictions={samplePredictions}
        title="Bar Chart"
        variant="bar"
        showConfidence={true}
        showValues={true}
      />
      <PredictionDisplay
        predictions={sentimentPredictions}
        title="Pie Chart"
        variant="pie"
        showConfidence={true}
        showValues={true}
      />
      <PredictionDisplay
        predictions={classificationPredictions}
        title="List View"
        variant="list"
        showConfidence={true}
        showValues={true}
      />
    </div>
  ),
};

