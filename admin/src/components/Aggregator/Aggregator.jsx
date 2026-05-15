import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';
import { useGetStatisticsDataQuery } from '../../redux/adminStudyAuthApi/adminStudyAuthApi';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';
import getCommenterImage from '../getCommenterImage/getCommenterImage';

const Aggregator = () => {
  const { data, error, isLoading } = useGetStatisticsDataQuery();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPieSize = () => {
    if (screenWidth <= 480) return { innerRadius: 20, outerRadius: 30, width: 70, height: 70 };
    if (screenWidth <= 768) return { innerRadius: 25, outerRadius: 35, width: 80, height: 80 };
    return { innerRadius: 30, outerRadius: 40, width: 90, height: 90 };
  };

  const pieSize = getPieSize();

  if (isLoading) return <Loader />;
  if (showError) return <Error onClose={() => setShowError(false)} />;

  const commenters = (data?.allComments || [])
    .flat()
    .filter((comment) => comment?.text)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const maxValue = 1000;

  const dataPoints = [
    { name: 'Reading By', value: data?.totalOngoing || 0 },
    { name: 'Completed', value: data?.totalCompleted || 0 },
    { name: 'Reactions', value: data?.totalReactions || 0 },
    { name: 'Downloads', value: data?.totalDownloads || 0 },
    { name: 'Studies', value: data?.totalStudies || 0 },
    { name: 'Comments', value: data?.totalComments || 0 },
  ];

  const chartData = dataPoints.map(item => ({
    ...item,
    percentage: Math.min((item.value / maxValue) * 100, 100),
  }));

  const colors = ['#4F46E5', '#22C55E', '#FACC15', '#EF4444', '#06B6D4'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">

      {/* HEADER */}
    <div className="bg-gradient-to-r from-white via-white to-gray-50 border border-gray-100 rounded-2xl shadow-sm p-6 flex items-center justify-between">

      {/* LEFT TEXT BLOCK */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Aggregated Sermon Analytics
        </h2>

        <p className="text-sm md:text-base text-gray-500 mt-1 leading-relaxed">
          Real-time overview of studies, engagement, reactions, and user activity across the platform
        </p>
      </div>
    </div>
      

      {/* TOP STATS + CHARTS */}
      <div className="bg-white rounded-2xl shadow-sm p-6">

        {/* PIE CHARTS */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {chartData.map((item, index) => (
            <div
              key={item.name}
              className="flex flex-col items-center bg-gray-50 rounded-xl p-4 w-[140px] shadow-sm hover:shadow-md transition"
            >
              <PieChart width={90} height={90}>
                <Pie
                  data={[{ value: item.percentage }, { value: 100 - item.percentage }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={pieSize.innerRadius}
                  outerRadius={pieSize.outerRadius}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill={colors[index]} />
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>

              <p className="text-xs text-gray-600 mt-2 text-center font-medium">
                {item.name}
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {item.value}
              </p>
              <p className="text-xs text-gray-400">
                {item.percentage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>

        {/* BAR CHART */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0A0A4A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Recent Comments
          </h3>
          <span className="text-sm text-gray-500">
            {commenters.length} total
          </span>
        </div>

        <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {commenters.map((comment, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              <img
                src={getCommenterImage(comment.user?.[0])}
                alt="Commenter"
                className="w-10 h-10 rounded-full object-cover border"
              />

              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {comment.user?.username || "Unknown User"}
                </p>
                <p className="text-sm text-gray-600 mt-1 leading-snug">
                  {comment.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default Aggregator;