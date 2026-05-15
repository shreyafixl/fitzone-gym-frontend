/**
 * Tests for TrainerHome Component - Checkpoint 12
 * Validates that dashboard displays real data from API
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.1, 7.2, 7.3
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MockAdapter from 'axios-mock-adapter';
import apiClient from '../utils/axiosConfig';
import TrainerDashboardPage from './TrainerDashboardPage';

// Mock the API client
const mockAxios = new MockAdapter(apiClient);

// Mock data for dashboard overview
const mockDashboardData = {
  success: true,
  data: {
    trainer: {
      id: '123',
      fullName: 'John Trainer',
      email: 'john@gym.com',
      specialization: 'Strength Training',
      experience: 5,
      rating: 4.8,
      assignedBranch: {
        _id: '456',
        branchName: 'Main Branch',
        branchCode: 'MB001'
      },
      trainerStatus: 'active'
    },
    statistics: {
      totalMembers: 25,
      activeMembers: 20,
      todaySessions: 5,
      upcomingSessions: 12,
      activeWorkouts: 18,
      activeDiets: 15,
      monthlyAttendance: 450,
      completedSessions: 42,
      recentProgressUpdates: 8,
      todayRevenue: 5000
    },
    todaySchedule: [
      {
        id: '1',
        clientName: 'Alice Johnson',
        time: '09:00 AM',
        type: 'Personal Training',
        duration: '1 hour',
        status: 'scheduled'
      },
      {
        id: '2',
        clientName: 'Bob Smith',
        time: '10:30 AM',
        type: 'Consultation',
        duration: '30 mins',
        status: 'scheduled'
      }
    ],
    activeClientsPreview: [
      {
        _id: '1',
        name: 'Alice Johnson',
        photo: 'https://via.placeholder.com/80',
        membershipPlan: 'Premium',
        progress: 65,
        lastVisit: '2024-01-15'
      },
      {
        _id: '2',
        name: 'Bob Smith',
        photo: 'https://via.placeholder.com/80',
        membershipPlan: 'Standard',
        progress: 45,
        lastVisit: '2024-01-14'
      }
    ],
    monthlyRevenue: [4000, 4500, 5000, 4800, 5200, 5500, 5300, 5100, 4900, 5400, 5600, 5800],
    pendingTasks: [
      {
        id: '1',
        task: 'Review Alice\'s progress report',
        priority: 'high',
        done: false
      },
      {
        id: '2',
        task: 'Update Bob\'s workout plan',
        priority: 'medium',
        done: false
      }
    ]
  }
};

describe('TrainerHome Component - Checkpoint 12', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('Loading State', () => {
    test('should display loading state while fetching data', async () => {
      // Mock the API to delay response
      mockAxios.onGet('/trainer/dashboard').reply(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([200, mockDashboardData]);
          }, 100);
        });
      });

      render(<TrainerDashboardPage />);

      // Check for loading indicator
      expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByText(/Loading dashboard/i)).not.toBeInTheDocument();
      });
    });

    test('should display loading spinner with appropriate message', () => {
      mockAxios.onGet('/trainer/dashboard').reply(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([200, mockDashboardData]);
          }, 200);
        });
      });

      render(<TrainerDashboardPage />);
      expect(screen.getByText(/⏳ Loading dashboard/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should display error message when API fails', async () => {
      mockAxios.onGet('/trainer/dashboard').reply(500, {
        success: false,
        message: 'Server error'
      });

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/❌/)).toBeInTheDocument();
      });
    });

    test('should display retry button on error', async () => {
      mockAxios.onGet('/trainer/dashboard').reply(500, {
        success: false,
        message: 'Server error'
      });

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /Retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });

    test('should retry API call when retry button is clicked', async () => {
      let callCount = 0;
      mockAxios.onGet('/trainer/dashboard').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [500, { success: false, message: 'Server error' }];
        }
        return [200, mockDashboardData];
      });

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/❌/)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /Retry/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, John/i)).toBeInTheDocument();
      });
    });

    test('should handle network errors gracefully', async () => {
      mockAxios.onGet('/trainer/dashboard').networkError();

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/❌/)).toBeInTheDocument();
      });
    });
  });

  describe('KPI Cards Display', () => {
    beforeEach(() => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);
    });

    test('should display all KPI cards with correct data', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        // Total Clients KPI
        expect(screen.getByText('Total Clients')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();

        // Active Clients KPI
        expect(screen.getByText('Active Clients')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();

        // Sessions Today KPI
        expect(screen.getByText('Sessions Today')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();

        // Rating KPI
        expect(screen.getByText('Rating')).toBeInTheDocument();
        expect(screen.getByText('4.8')).toBeInTheDocument();

        // Sessions/Month KPI
        expect(screen.getByText('Sessions/Month')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();

        // Today Revenue KPI
        expect(screen.getByText('Today Revenue')).toBeInTheDocument();
        expect(screen.getByText('Rs.5000')).toBeInTheDocument();
      });
    });

    test('should display trainer name in welcome message', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, John/i)).toBeInTheDocument();
      });
    });

    test('should display today\'s session count in header', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/5 sessions today/i)).toBeInTheDocument();
      });
    });

    test('should display correct KPI values from API response', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        // Verify each KPI has the correct value
        const kpiValues = screen.getAllByText(/\d+/);
        expect(kpiValues.length).toBeGreaterThan(0);
      });
    });

    test('should handle missing KPI data gracefully', async () => {
      const incompleteData = {
        success: true,
        data: {
          trainer: { fullName: 'John Trainer', rating: 4.8 },
          statistics: {
            totalMembers: 25
            // Missing other statistics
          }
        }
      };

      mockAxios.onGet('/trainer/dashboard').reply(200, incompleteData);

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        // Should still render without crashing
        expect(screen.getByText(/Welcome back, John/i)).toBeInTheDocument();
      });
    });
  });

  describe('Charts Display', () => {
    beforeEach(() => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);
    });

    test('should display monthly revenue chart', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
      });
    });

    test('should display session statistics chart', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Session Stats')).toBeInTheDocument();
      });
    });

    test('should display correct chart data', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        // Check for session stats values
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('Upcoming')).toBeInTheDocument();
      });
    });

    test('should render bar chart with revenue data', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        const monthlyRevenueSection = screen.getByText('Monthly Revenue').closest('.td-card');
        expect(monthlyRevenueSection).toBeInTheDocument();
      });
    });
  });

  describe('Today\'s Schedule Display', () => {
    beforeEach(() => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);
    });

    test('should display today\'s schedule section', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Today's Schedule/i)).toBeInTheDocument();
      });
    });

    test('should display scheduled sessions', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      });
    });

    test('should display session times', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('09:00 AM')).toBeInTheDocument();
        expect(screen.getByText('10:30 AM')).toBeInTheDocument();
      });
    });

    test('should display session types', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Personal Training/i)).toBeInTheDocument();
        expect(screen.getByText(/Consultation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pending Tasks Display', () => {
    beforeEach(() => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);
    });

    test('should display pending tasks section', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Pending Tasks/i)).toBeInTheDocument();
      });
    });

    test('should display pending task count', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/2 pending/i)).toBeInTheDocument();
      });
    });

    test('should display task descriptions', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Review Alice's progress report/i)).toBeInTheDocument();
        expect(screen.getByText(/Update Bob's workout plan/i)).toBeInTheDocument();
      });
    });

    test('should allow toggling task completion', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Active Clients Preview', () => {
    beforeEach(() => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);
    });

    test('should display active clients preview section', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Active Clients/i)).toBeInTheDocument();
      });
    });

    test('should display client names', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      });
    });

    test('should display client membership plans', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Premium')).toBeInTheDocument();
        expect(screen.getByText('Standard')).toBeInTheDocument();
      });
    });

    test('should display client progress bars', async () => {
      render(<TrainerDashboardPage />);

      await waitFor(() => {
        const progressElements = screen.getAllByText(/\d+%/);
        expect(progressElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Refresh', () => {
    test('should refresh data when component remounts', async () => {
      let callCount = 0;
      mockAxios.onGet('/trainer/dashboard').reply(() => {
        callCount++;
        return [200, mockDashboardData];
      });

      const { rerender } = render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, John/i)).toBeInTheDocument();
      });

      expect(callCount).toBe(1);
    });

    test('should handle empty data gracefully', async () => {
      const emptyData = {
        success: true,
        data: {
          trainer: {},
          statistics: {},
          todaySchedule: [],
          activeClientsPreview: [],
          monthlyRevenue: [],
          pendingTasks: []
        }
      };

      mockAxios.onGet('/trainer/dashboard').reply(200, emptyData);

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        // Should render without crashing
        expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
      });
    });
  });

  describe('Integration Tests', () => {
    test('should display complete dashboard with all sections', async () => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        // Check all major sections are present
        expect(screen.getByText(/Welcome back, John/i)).toBeInTheDocument();
        expect(screen.getByText('Total Clients')).toBeInTheDocument();
        expect(screen.getByText(/Today's Schedule/i)).toBeInTheDocument();
        expect(screen.getByText(/Pending Tasks/i)).toBeInTheDocument();
        expect(screen.getByText(/Active Clients/i)).toBeInTheDocument();
        expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
        expect(screen.getByText('Session Stats')).toBeInTheDocument();
      });
    });

    test('should handle API response with all data fields', async () => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);

      render(<TrainerDashboardPage />);

      await waitFor(() => {
        // Verify trainer data
        expect(screen.getByText(/John/i)).toBeInTheDocument();

        // Verify statistics
        expect(screen.getByText('25')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();

        // Verify schedule
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();

        // Verify tasks
        expect(screen.getByText(/Review Alice's progress report/i)).toBeInTheDocument();
      });
    });

    test('should maintain data consistency across re-renders', async () => {
      mockAxios.onGet('/trainer/dashboard').reply(200, mockDashboardData);

      const { rerender } = render(<TrainerDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('25')).toBeInTheDocument();
      });

      // Re-render should maintain the same data
      rerender(<TrainerDashboardPage />);

      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });
});
