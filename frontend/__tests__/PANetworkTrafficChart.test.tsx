import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { NetworkTrafficChart } from '../components/partials/system/charts/PANetworkTrafficChart';
import { Metrics } from '../hooks/useSystemMetrics';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  system: {
    networkTraffic: 'Network Traffic',
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
    history: [
      {
        timestamp: Date.now(),
        received: 1000000,
        sent: 500000,
      },
    ],
  },
  diskIO: {
    history: [],
  },
};

describe('NetworkTrafficChart', () => {
  it('should render network traffic chart title', () => {
    render(<NetworkTrafficChart metrics={mockMetrics} translation={mockTranslation} />);
    expect(screen.getByText('Network Traffic')).toBeInTheDocument();
  });

  it('should render chart when data is available', () => {
    render(<NetworkTrafficChart metrics={mockMetrics} translation={mockTranslation} />);
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('should show collecting data message when no history data', () => {
    const emptyMetrics = { ...mockMetrics, networkTraffic: { history: [] } };
    render(<NetworkTrafficChart metrics={emptyMetrics} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });

  it('should show collecting data message when metrics is null', () => {
    render(<NetworkTrafficChart metrics={null} translation={mockTranslation} />);
    expect(screen.getByText('Collecting data...')).toBeInTheDocument();
  });
});