import React, { useEffect, useState } from 'react';
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../lib/mockApi';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, getStatusColor } from '../lib/utils';
import type { Leave } from '../types';
import toast from 'react-hot-toast';

const Leaves: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'sick' as Leave['leaveType'],
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const records = user?.role === 'admin'
        ? await mockApi.getLeaves()
        : await mockApi.getLeaves(user?.employeeId);
      
      setLeaves(records);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
      toast.error('Failed to load leave records');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDays = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.employeeId) return;

    try {
      const days = calculateDays(formData.startDate, formData.endDate);
      
      await mockApi.applyLeave({
        employeeId: user.employeeId,
        employeeName: user.name,
        ...formData,
        days,
      });

      toast.success('Leave application submitted successfully!');
      setShowApplyModal(false);
      setFormData({
        leaveType: 'sick',
        startDate: '',
        endDate: '',
        reason: '',
      });
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to apply for leave');
    }
  };

  const handleApprove = async (leaveId: string) => {
    try {
      await mockApi.updateLeaveStatus(leaveId, 'approved', user?.name);
      toast.success('Leave approved successfully!');
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to approve leave');
    }
  };

  const handleReject = async (leaveId: string) => {
    try {
      await mockApi.updateLeaveStatus(leaveId, 'rejected', user?.name);
      toast.success('Leave rejected');
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to reject leave');
    }
  };

  const leaveStats = {
    total: 24,
    used: leaves.filter(l => l.status === 'approved' && l.employeeId === user?.employeeId).length,
    pending: leaves.filter(l => l.status === 'pending' && l.employeeId === user?.employeeId).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Leave Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hrms-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leave Days</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{leaveStats.total}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hrms-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Used</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{leaveStats.used}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hrms-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {leaveStats.total - leaveStats.used}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leave Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="hrms-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === 'admin' ? 'All Leave Requests' : 'My Leave Applications'}
            </h2>
            <button
              onClick={() => setShowApplyModal(true)}
              className="hrms-button-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Apply Leave
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {user?.role === 'admin' && (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Employee</th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">End Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Days</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  {user?.role === 'admin' && (
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, index) => (
                  <motion.tr
                    key={leave.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {user?.role === 'admin' && (
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {leave.employeeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{leave.employeeName}</span>
                        </div>
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <span className="capitalize text-sm font-medium text-gray-900">{leave.leaveType}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{formatDate(leave.startDate)}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{formatDate(leave.endDate)}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{leave.days}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="py-4 px-4">
                        {leave.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply for Leave</h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Leave Type
                    </label>
                    <select
                      value={formData.leaveType}
                      onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as Leave['leaveType'] })}
                      className="hrms-input"
                      required
                    >
                      <option value="sick">Sick Leave</option>
                      <option value="casual">Casual Leave</option>
                      <option value="annual">Annual Leave</option>
                      <option value="unpaid">Unpaid Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="hrms-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="hrms-input"
                      required
                      min={formData.startDate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="hrms-input resize-none"
                      rows={3}
                      required
                      placeholder="Please provide a reason for your leave..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 hrms-button-primary"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaves;
