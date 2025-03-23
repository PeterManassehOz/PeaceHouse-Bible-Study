import { 
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer 
  } from 'recharts';
  import { useState, useEffect } from 'react';
  import { useGetStatisticsDataQuery } from '../../redux/adminStudyAuthApi/adminStudyAuthApi';
  import Loader from '../Loader/Loader';
  import Error from '../Error/Error';
  import getCommenterImage from '../getCommenterImage/getCommenterImage';





  
  const Aggregator = () => {
    const { data, error, isLoading} = useGetStatisticsDataQuery();
    const [showError, setShowError] = useState(false);


    useEffect(() => {
      if (error) {
        setShowError(true);
      }
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
  
    console.log("Statistics Data:", data); // Debugging API response
  
    // Ensure safe access to API response values
    const commenters = (data?.allComments || []).filter(comment => comment.text);

    // Prepare data for the charts
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
      <div className="bg-white shadow-lg rounded-lg p-6 mx-4 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Aggregated Sermon Data</h2>
  
        {/* Charts Section */}
        <div className="flex flex-col items-center gap-6">
        {/* Pie Charts - Positioned Above */}
        <div className="flex flex-wrap justify-center gap-6">
            {chartData.map((item, index) => (
            <div key={item.name} className="flex flex-col items-center">
                <PieChart width={Math.max(pieSize.width, 80)} height={Math.max(pieSize.height, 80)}>
                <Pie
                    data={[{ value: item.percentage }, { value: 100 - item.percentage }]}
                    cx="50%" cy="50%"
                    innerRadius={pieSize.innerRadius}
                    outerRadius={pieSize.outerRadius}
                    startAngle={90} endAngle={-270}
                    dataKey="value"
                >
                    <Cell fill={colors[index]} />
                    <Cell fill="#E5E7EB" />
                </Pie>
                </PieChart>
                <span className="text-sm text-gray-700 font-medium mt-2">
                {item.name}: {item.value} ({item.percentage.toFixed(1)}%)
                </span>
            </div>
            ))}
        </div>

        {/* Bar Chart - Positioned Below */}
        <div className="w-full min-h-[350px] h-110 bg-gray-50 rounded-lg shadow-sm flex justify-center items-center">
            <ResponsiveContainer width={screenWidth <= 480 ? "90%" : "100%"} height={screenWidth <= 480 ? 300 : 400}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    stroke="#555" 
                    tick={{ fontSize: screenWidth <= 480 ? 10 : 12 }} 
                    angle={screenWidth <= 480 ? -45 : 0} 
                    textAnchor={screenWidth <= 480 ? "end" : "middle"} 
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0A0A4A" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

  
        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Comments</h3>
          <ul className="space-y-4">
          {commenters.map((comment, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <img 
                        src={getCommenterImage(comment.user[0])} 
                        alt="Commenter" 
                        className="w-10 h-10 rounded-full mr-4" 
                        />
                        <div>
                        <p className="text-gray-700 text-sm font-semibold">
                            {comment.user[0]?.username || 'Unknown User'}
                        </p>
                        <p className="text-gray-600 text-sm">{comment.text}</p>
                        </div>
                    </div>
                    </li>
                ))}
          </ul>
        </div>
  
        {/* Completed & Reading Users Section */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">

        </div>
      </div>
    );
  };
  
  export default Aggregator;
  