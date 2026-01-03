import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DiskIOChart } from '../components/partials/system/charts/PADiskIOChart';
import { Metrics } from '../hooks/useSystemMetrics';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  system: {
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
    history: [],
  },
  networkTraffic: {
    history: [],
  },
  diskIO: {
    history: [
      {
        timestamp: Date.now(),
        read: 1000000,
        write: 500000,
      },
    ],
  },
};

describe('DiskIOChart', () => {
  it('should render disk I/O chart title', () => {
    render(<DiskIOChart metrics={mockMetrics} translation={mockTranslation} />);
    expect(screen.getByText('Disk I/O')).toBeInTheDocument();
  });

  it('should render chart when data is available', () => {
    render(<DiskIOChart metrics={mockMetrics} translation={mockTranslation} />);
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('should show collecting data message when no history data', () => {
    const emptyMetrics = { ...mockMetrics, diskIO: { history: [] } };
    render(<DiskIOChart metrics={emptyMetrics} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });

  it('should show collecting data message when metrics is null', () => {
    render(<DiskIOChart metrics={null} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });
});