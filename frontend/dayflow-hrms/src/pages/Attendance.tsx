import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockApi } from '../lib/mockApi';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatTime, getStatusColor } from '../lib/utils';
import type { Attendance } from '../types';
import toast from 'react-hot-toast';

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const records = user?.role === 'admin'
        ? await mockApi.getAttendance()
        : await mockApi.getAttendance(user?.employeeId);
      
      setAttendanceRecords(records);
      
      // Check if already checked in today
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = records.find(
        (r) => r.date === today && r.employeeId === user?.employeeId
      );
      setTodayAttendance(todayRecord || null);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.employeeId) return;
    
    setIsCheckingIn(true);
    try {
      const record = await mockApi.checkIn(user.employeeId);
      setTodayAttendance(record);
      toast.success('Checked in successfully!');
      fetchAttendance();
    } catch (error) {
      toast.error('Failed to check in');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance?.id) return;
    
    setIsCheckingIn(true);
    try {
      await mockApi.checkOut(todayAttendance.id);
      toast.success('Checked out successfully!');
      fetchAttendance();
    } catch (error) {
      toast.error('Failed to check out');
    } finally {
      setIsCheckingIn(false);
    }
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
      {/* Check In/Out Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hrms-card bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Today's Attendance</h2>
            <p className="text-blue-100">
              {formatDate(new Date().toISOString())} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Clock className="w-16 h-16 text-blue-200" />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100 mb-1">Check In</p>
            <p className="text-2xl font-bold">
              {todayAttendance?.checkIn ? formatTime(todayAttendance.checkIn) : '--:--'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100 mb-1">Check Out</p>
            <p className="text-2xl font-bold">
              {todayAttendance?.checkOut ? formatTime(todayAttendance.checkOut) : '--:--'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100 mb-1">Hours Worked</p>
            <p className="text-2xl font-bold">
              {todayAttendance?.hoursWorked || '0'} hrs
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          {!todayAttendance ? (
            <button
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="flex-1 bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {isCheckingIn ? 'Checking In...' : 'Check In'}
            </button>
          ) : !todayAttendance.checkOut ? (
            <button
              onClick={handleCheckOut}
              disabled={isCheckingIn}
              className="flex-1 bg-white text-red-600 hover:bg-red-50 px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              {isCheckingIn ? 'Checking Out...' : 'Check Out'}
            </button>
          ) : (
            <div className="flex-1 bg-green-500/20 border-2 border-green-300 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Completed for Today
            </div>
          )}
        </div>
      </motion.div>

      {/* Attendance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="hrms-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === 'admin' ? 'All Attendance Records' : 'My Attendance History'}
            </h2>
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {user?.role === 'admin' && (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Employee</th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Check In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Check Out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Hours</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
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
                              {record.employeeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{record.employeeName}</span>
                        </div>
                      </td>
                    )}
                    <td className="py-4 px-4 text-sm text-gray-600">{formatDate(record.date)}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {formatTime(record.checkIn)}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {record.checkOut ? formatTime(record.checkOut) : '--:--'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {record.hoursWorked ? `${record.hoursWorked} hrs` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
