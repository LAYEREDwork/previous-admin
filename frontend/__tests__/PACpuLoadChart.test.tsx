import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CpuLoadChart } from '../components/partials/system/charts/PACpuLoadChart';
import { Metrics } from '../hooks/useSystemMetrics';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  system: {
    cpuLoadAverage: 'CPU Load Average',
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
    history: [
      {
        oneMin: 1.5,
        fiveMin: 1.2,
        fifteenMin: 1.8,
      },
    ],
  },
  memory: {
    current: 65,
    used: 1000000000,
    total: 2000000000,
    history: [],
  },
  networkTraffic: {
    history: [],
  },
  diskIO: {
    history: [],
  },
};

describe('CpuLoadChart', () => {
  it('should render CPU load chart title', () => {
    render(<CpuLoadChart metrics={mockMetrics} translation={mockTranslation} />);
    expect(screen.getByText('CPU Load Average')).toBeInTheDocument();
  });

  it('should display current CPU load values', () => {
    render(<CpuLoadChart metrics={mockMetrics} translation={mockTranslation} />);
    expect(screen.getByText('1.80')).toBeInTheDocument(); // fifteenMin
    expect(screen.getByText('1.20')).toBeInTheDocument(); // fiveMin
    expect(screen.getByText('1.50')).toBeInTheDocument(); // oneMin
  });

  it('should render chart when data is available', () => {
    render(<CpuLoadChart metrics={mockMetrics} translation={mockTranslation} />);
    // The chart should be rendered (we can check for the presence of SVG elements)
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('should show collecting data message when no history data', () => {
    const emptyMetrics = { ...mockMetrics, cpuLoad: { ...mockMetrics.cpuLoad, history: [] } };
    render(<CpuLoadChart metrics={emptyMetrics} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });

  it('should show collecting data message when metrics is null', () => {
    render(<CpuLoadChart metrics={null} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });
});