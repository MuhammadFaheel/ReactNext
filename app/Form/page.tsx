'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface NFAFormData {
  subject: string;
  description: string;
  requestedBy: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  approver: string;
  notes: string;
  comment: string;
  attachments: File[];
  reviewers: string[];
  approvals: Array<{ name: string; status: 'pending' | 'approved' | 'rejected' }>;
}

interface HistoryEntry {
  timestamp: string;
  action: string;
  user: string;
}

export default function Form() {
  const [formData, setFormData] = useState<NFAFormData>({
    subject: '',
    description: '',
    requestedBy: '',
    department: '',
    priority: 'medium',
    approver: '',
    notes: '',
    comment: '',
    attachments: [],
    reviewers: [],
    approvals: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newReviewer, setNewReviewer] = useState('');
  const [newApproval, setNewApproval] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Initialize history only on client to avoid hydration mismatch
    setHistory([
      { timestamp: new Date().toLocaleString(), action: 'Form Created', user: 'System' },
    ]);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const addReviewer = () => {
    if (newReviewer.trim()) {
      const reviewerName = newReviewer.trim();
      setFormData(prev => ({
        ...prev,
        reviewers: [...prev.reviewers, reviewerName],
        approvals: [...prev.approvals, { name: reviewerName, status: 'pending' }],
      }));
      setNewReviewer('');
    }
  };

  const removeReviewer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reviewers: prev.reviewers.filter((_, i) => i !== index),
      approvals: prev.approvals.filter((_, i) => i !== index),
    }));
  };

  const updateApprovalStatus = (index: number, status: 'pending' | 'approved' | 'rejected') => {
    setFormData(prev => ({
      ...prev,
      approvals: prev.approvals.map((a, i) => i === index ? { ...a, status } : a),
    }));
  };

  const addApprovalDirect = () => {
    if (newApproval.trim()) {
      if (!formData.approvals.find(a => a.name === newApproval.trim())) {
        setFormData(prev => ({
          ...prev,
          approvals: [...prev.approvals, { name: newApproval.trim(), status: 'pending' }],
        }));
        setNewApproval('');
      }
    }
  };

  const removeApprovalDirect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      approvals: prev.approvals.filter((_, i) => i !== index),
    }));
  };

  const addHistoryEntry = (action: string, user: string) => {
    setHistory(prev => [...prev, { timestamp: new Date().toLocaleString(), action, user }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.subject.trim() || !formData.description.trim() || !formData.requestedBy.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      addHistoryEntry('Form Submitted', formData.requestedBy);
      setSubmitted(true);
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      description: '',
      requestedBy: '',
      department: '',
      priority: 'medium',
      approver: '',
      notes: '',
      comment: '',
      attachments: [],
      reviewers: [],
      approvals: [],
    });
    setSubmitted(false);
    setHistory([
      { timestamp: new Date().toLocaleString(), action: 'Form Reset', user: 'System' },
    ]);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.successMessage}>
            <div className={styles.checkmark}>✓</div>
            <h2>NFA Submitted Successfully!</h2>
            <p>Your Note for Approval has been submitted and is pending review.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerCard}>
        <h1>Note For Approval</h1>
        <p className={styles.subtitle}>Submit your request for approval</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Basic Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>
              Subject <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief subject of your request"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of your request"
              className={styles.textarea}
              rows={4}
              disabled={loading}
            />
          </div>
        </div>

        {/* Request Details Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Request Details</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="requestedBy" className={styles.label}>
                Requested By <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="requestedBy"
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleChange}
                placeholder="Your name"
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="department" className={styles.label}>
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Your department"
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="priority" className={styles.label}>
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={styles.select}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="approver" className={styles.label}>
                Approver
              </label>
              <input
                type="text"
                id="approver"
                name="approver"
                value={formData.approver}
                onChange={handleChange}
                placeholder="Manager name"
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.label}>
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional comments or notes"
              className={styles.textarea}
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        {/* Attachments & Comments Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Attachments & Comments</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Add comments about this request..."
              className={styles.textarea}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Attachments</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
              disabled={loading}
            />
          </div>

          {formData.attachments.length > 0 && (
            <div className={styles.attachmentList}>
              {formData.attachments.map((file, index) => (
                <div key={index} className={styles.attachmentItem}>
                  <span>📎 {file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className={styles.removeButton}
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviewers & Approvals Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Reviewers & Approvals</h2>
          
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Reviewers (Multiple)</h3>
            <div className={styles.addItemGroup}>
              <input
                type="text"
                value={newReviewer}
                onChange={(e) => setNewReviewer(e.target.value)}
                placeholder="Enter reviewer name"
                className={styles.input}
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addReviewer())}
              />
              <button
                type="button"
                onClick={addReviewer}
                className={styles.addButton}
                disabled={loading}
              >
                Add Reviewer
              </button>
            </div>
            {formData.reviewers.length > 0 && (
              <div className={styles.itemList}>
                {formData.reviewers.map((reviewer, index) => (
                  <div key={index} className={styles.item}>
                    <span>👤 {reviewer}</span>
                    <button
                      type="button"
                      onClick={() => removeReviewer(index)}
                      className={styles.removeButton}
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Approvals (Multiple)</h3>
            <div className={styles.addItemGroup}>
              <input
                type="text"
                value={newApproval}
                onChange={(e) => setNewApproval(e.target.value)}
                placeholder="Enter approver name"
                className={styles.input}
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addApprovalDirect())}
              />
              <button
                type="button"
                onClick={addApprovalDirect}
                className={styles.addButton}
                disabled={loading}
              >
                Add Approver
              </button>
            </div>
            <div className={styles.approvalList}>
              {formData.approvals.length === 0 ? (
                <p className={styles.emptyText}>No approvals yet. Add reviewers or approvers above.</p>
              ) : (
                formData.approvals.map((approval, index) => (
                  <div key={index} className={styles.approvalItem}>
                    <div className={styles.approvalInfo}>
                      <span className={styles.approvalName}>{approval.name}</span>
                      <select
                        value={approval.status}
                        onChange={(e) => updateApprovalStatus(index, e.target.value as any)}
                        className={`${styles.statusSelect} ${styles[`status-${approval.status}`]}`}
                        disabled={loading}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeApprovalDirect(index)}
                      className={styles.removeButton}
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Activity History</h2>
          <div className={styles.historyList}>
            {history.length === 0 ? (
              <p className={styles.emptyText}>No history available</p>
            ) : (
              history.map((entry, index) => (
                <div key={index} className={styles.historyItem}>
                  <span className={styles.historyTime}>{entry.timestamp}</span>
                  <span className={styles.historyAction}>{entry.action}</span>
                  <span className={styles.historyUser}>by {entry.user}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={resetForm}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}