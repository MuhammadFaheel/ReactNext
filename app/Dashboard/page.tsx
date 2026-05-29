'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend?: string;
}

interface RecentNFA {
  id: string;
  subject: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  date: string;
}

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const router = useRouter();

  // Mock data
  const stats: StatCard[] = [
    { title: 'Total NFAs', value: 48, icon: '📋', color: '#667eea', trend: '+5 this week' },
    { title: 'Pending', value: 12, icon: '⏳', color: '#f59e0b', trend: '-2 since yesterday' },
    { title: 'Approved', value: 32, icon: '✅', color: '#10b981', trend: '+8 this week' },
    { title: 'Rejected', value: 4, icon: '❌', color: '#ef4444', trend: 'No change' },
  ];

  const recentNFAs: RecentNFA[] = [
    {
      id: 'NFA-001',
      subject: 'Budget Allocation Request',
      requestedBy: 'John Doe',
      status: 'pending',
      priority: 'high',
      date: '2 hours ago',
    },
    {
      id: 'NFA-002',
      subject: 'Department Policy Update',
      requestedBy: 'Jane Smith',
      status: 'approved',
      priority: 'medium',
      date: '5 hours ago',
    },
    {
      id: 'NFA-003',
      subject: 'Software License Renewal',
      requestedBy: 'Mike Johnson',
      status: 'pending',
      priority: 'urgent',
      date: '1 day ago',
    },
    {
      id: 'NFA-004',
      subject: 'Travel Request Approval',
      requestedBy: 'Sarah Williams',
      status: 'approved',
      priority: 'low',
      date: '2 days ago',
    },
    {
      id: 'NFA-005',
      subject: 'Equipment Purchase',
      requestedBy: 'Tom Brown',
      status: 'rejected',
      priority: 'medium',
      date: '3 days ago',
    },
  ];

  const filteredNFAs = recentNFAs.filter(nfa =>
    selectedFilter === 'all' ? true : nfa.status === selectedFilter
  );

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return styles.priorityUrgent;
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      default:
        return '';
    }
  };

  const newForm = () => {
    router.push("/Form");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's an overview of your NFAs</p>
        </div>
        <button onClick={newForm} className={styles.newNFAButton}>+ New NFA</button>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <h3 className={styles.statTitle}>{stat.title}</h3>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTrend}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Recent NFAs Section */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent NFAs</h2>
          <a href="/Form" className={styles.viewAllLink}>View All →</a>
        </div>

        <div className={styles.filterTabs}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map(filter => (
            <button
              key={filter}
              className={`${styles.filterTab} ${selectedFilter === filter ? styles.active : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.nfaTable}>
          <div className={styles.tableHeader}>
            <div className={styles.colId}>ID</div>
            <div className={styles.colSubject}>Subject</div>
            <div className={styles.colRequester}>Requested By</div>
            <div className={styles.colPriority}>Priority</div>
            <div className={styles.colStatus}>Status</div>
            <div className={styles.colDate}>Date</div>
          </div>
          <div className={styles.tableBody}>
            {filteredNFAs.map(nfa => (
              <div key={nfa.id} className={styles.tableRow}>
                <div className={styles.colId}>
                  <span className={styles.nfaId}>{nfa.id}</span>
                </div>
                <div className={styles.colSubject}>{nfa.subject}</div>
                <div className={styles.colRequester}>{nfa.requestedBy}</div>
                <div className={styles.colPriority}>
                  <span className={`${styles.priorityBadge} ${getPriorityClass(nfa.priority)}`}>
                    {nfa.priority.charAt(0).toUpperCase() + nfa.priority.slice(1)}
                  </span>
                </div>
                <div className={styles.colStatus}>
                  <span className={`${styles.statusBadge} ${getStatusClass(nfa.status)}`}>
                    ● {nfa.status.charAt(0).toUpperCase() + nfa.status.slice(1)}
                  </span>
                </div>
                <div className={styles.colDate}>{nfa.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.quickStatItem}>
          <h3>Approval Rate</h3>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '85%' }}></div>
          </div>
          <p className={styles.progressLabel}>85% of NFAs approved</p>
        </div>

        <div className={styles.quickStatItem}>
          <h3>Avg Response Time</h3>
          <div className={styles.bigNumber}>2.3 days</div>
          <p className={styles.progressLabel}>Average time to review</p>
        </div>

        <div className={styles.quickStatItem}>
          <h3>Active Reviewers</h3>
          <div className={styles.bigNumber}>8</div>
          <p className={styles.progressLabel}>People reviewing NFAs</p>
        </div>
      </div>
    </div>
  );
}