import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Random int generator
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const COLORS = ["#10b981", "#ef4444"];

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
    <h4 className="text-gray-500 dark:text-gray-400">{title}</h4>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">
      {typeof value === "number" ? value.toLocaleString() : value}
    </p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const activities = [
    {
      id: 1,
      student: "Atul",
      action: "Completed Module 1",
      date: "2025-05-07",
    },
    { id: 2, student: "Sandeep", action: "Submitted Quiz", date: "2025-05-06" },
    { id: 3, student: "Prabhav", action: "Joined Course", date: "2025-05-05" },
    {
      id: 3,
      student: "Mritunjay",
      action: "Joined Course",
      date: "2025-05-05",
    },
  ];

  // Generate random data on mount
  useEffect(() => {
    const totalStudents = randInt(10, 100);
    const activeCourses = randInt(7, 7);
    const assignmentsSubmitted = randInt(20, 100);
    const instructors = randInt(3, 25);

    const months = ["Jan", "Feb", "Mar", "Apr", "May"];
    const newLineData = months.map((month) => ({
      month,
      students: randInt(20, 100),
    }));

    const passed = randInt(10, 60);
    const failed = 100 - passed;

    setStats({
      totalStudents,
      activeCourses,
      assignmentsSubmitted,
      instructors,
    });

    setLineData(newLineData);
    setPieData([
      { name: "Users", value: passed },
      { name: "Assignment", value: failed },
    ]);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <h2 className="text-3xl font-semibold mb-4">📚 LMS Dashboard</h2>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Active Courses" value={stats.activeCourses} />
        <StatCard
          title="Assignments Submitted"
          value={stats.assignmentsSubmitted}
        />
        <StatCard title="Instructors" value={stats.instructors} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          <h3 className="mb-2 font-semibold">Monthly Enrollment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          <h3 className="mb-2 font-semibold">Analyses: </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        <h3 className="mb-4 font-semibold">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-sm text-gray-500 dark:text-gray-400">
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Activity</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr
                  key={act.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl text-sm"
                >
                  <td className="px-4 py-2">{act.student}</td>
                  <td className="px-4 py-2">{act.action}</td>
                  <td className="px-4 py-2">{act.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
