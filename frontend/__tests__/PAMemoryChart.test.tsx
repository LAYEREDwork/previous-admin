import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { MemoryChart } from '../components/partials/system/charts/PAMemoryChart';
import { Metrics } from '../hooks/useSystemMetrics';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  system: {
    memory: 'Memory',
    collectingData: 'Collecting data...',
  },
} as Translations;

const mockMetrics: Metrics = {
  cpuLoad: {
    current: {
      oneMin: 1.5,
      fiveMin: 1.2,
      fifteenMin: 1.8,
    },
    history: [],
  },
  memory: {
    current: 65,
    used: 1000000000,
    total: 2000000000,
    history: [
      {
        timestamp: Date.now(),
        value: 65,
      },
    ],
  },
  networkTraffic: {
    history: [],
  },
  diskIO: {
    history: [],
  },
};

describe('MemoryChart', () => {
  it('should render memory chart title', () => {
    render(<MemoryChart metrics={mockMetrics} translation={mockTranslation} />);
    expect(screen.getByText('Memory')).toBeInTheDocument();
  });

  it('should display current memory usage percentage', () => {
    render(<MemoryChart metrics={mockMetrics} translation={mockTranslation} />);
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should display memory usage in bytes', () => {
    render(<MemoryChart metrics={mockMetrics} translation={mockTranslation} />);
    expect(screen.getByText('953.67 MB / 1.86 GB')).toBeInTheDocument();
  });

  it('should render chart when data is available', () => {
    render(<MemoryChart metrics={mockMetrics} translation={mockTranslation} />);
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('should show collecting data message when no history data', () => {
    const emptyMetrics = { ...mockMetrics, memory: { ...mockMetrics.memory, history: [] } };
    render(<MemoryChart metrics={emptyMetrics} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });

  it('should show collecting data message when metrics is null', () => {
    render(<MemoryChart metrics={null} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });
});