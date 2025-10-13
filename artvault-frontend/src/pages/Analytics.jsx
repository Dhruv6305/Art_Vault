import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Analytics.css';

// Mock data for demonstration - replace with actual API calls
const mockAnalyticsData = {
    platformInsights: {
        uploads: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [45, 52, 48, 61, 55, 67]
        },
        growth: {
            totalUsers: 1250,
            monthlyGrowth: 12.5,
            totalArtworks: 3420,
            artworkGrowth: 8.3
        },
        engagement: {
            labels: ['Views', 'Likes', 'Shares', 'Comments'],
            data: [2340, 1890, 456, 234]
        }
    },
    artistInsights: {
        topArtists: [
            { name: 'Sarah Chen', sales: 45, rating: 4.8, revenue: 12500 },
            { name: 'Marcus Rivera', sales: 38, rating: 4.7, revenue: 9800 },
            { name: 'Elena Volkov', sales: 32, rating: 4.9, revenue: 8900 },
            { name: 'David Kim', sales: 28, rating: 4.6, revenue: 7200 },
            { name: 'Isabella Torres', sales: 25, rating: 4.8, revenue: 6800 }
        ],
        salesTrend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [125, 142, 138, 165, 158, 189]
        },
        ratingDistribution: {
            labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
            data: [65, 25, 8, 1, 1]
        }
    },
    audienceInsights: {
        geographic: {
            labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
            data: [35, 28, 22, 8, 4, 3]
        },
        categoryTrends: {
            labels: ['Digital Art', 'Photography', 'Paintings', '3D Models', 'Sculptures', 'Mixed Media'],
            data: [32, 24, 18, 12, 8, 6]
        },
        ageGroups: {
            labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
            data: [22, 35, 25, 12, 6]
        }
    }
};

const Analytics = () => {
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('platform');
    const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAnalyticsData();
        }
    }, [isAuthenticated]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            // Replace with actual API call
            // const response = await fetch('/api/analytics');
            // const data = await response.json();
            // setAnalyticsData(data);

            // Simulate API delay
            setTimeout(() => {
                setAnalyticsData(mockAnalyticsData);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setLoading(false);
        }
    };

    const renderChart = (type, data, title) => {
        switch (type) {
            case 'line':
                return (
                    <div className="chart-container">
                        <h3>{title}</h3>
                        <div className="line-chart">
                            <svg viewBox="0 0 400 200" className="chart-svg">
                                {data.data.map((value, index) => {
                                    const x = (index * 60) + 40;
                                    const y = 180 - (value * 2);
                                    return (
                                        <g key={index}>
                                            <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                                            {index > 0 && (
                                                <line
                                                    x1={(index - 1) * 60 + 40}
                                                    y1={180 - (data.data[index - 1] * 2)}
                                                    x2={x}
                                                    y2={y}
                                                    stroke="#3b82f6"
                                                    strokeWidth="2"
                                                />
                                            )}
                                            <text x={x} y="195" textAnchor="middle" fontSize="12" fill="#666">
                                                {data.labels[index]}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                );

            case 'bar':
                return (
                    <div className="chart-container">
                        <h3>{title}</h3>
                        <div className="bar-chart">
                            {data.data.map((value, index) => (
                                <div key={index} className="bar-item">
                                    <div
                                        className="bar"
                                        style={{ height: `${(value / Math.max(...data.data)) * 100}%` }}
                                    >
                                        <span className="bar-value">{value}</span>
                                    </div>
                                    <span className="bar-label">{data.labels[index]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'doughnut':
                const total = data.data.reduce((sum, val) => sum + val, 0);
                let cumulativePercentage = 0;

                return (
                    <div className="chart-container">
                        <h3>{title}</h3>
                        <div className="doughnut-chart">
                            <svg viewBox="0 0 200 200" className="chart-svg">
                                {data.data.map((value, index) => {
                                    const percentage = (value / total) * 100;
                                    const startAngle = (cumulativePercentage / 100) * 360;
                                    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

                                    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                                    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

                                    const largeArcFlag = percentage > 50 ? 1 : 0;

                                    const x1 = 100 + 70 * Math.cos(startAngleRad);
                                    const y1 = 100 + 70 * Math.sin(startAngleRad);
                                    const x2 = 100 + 70 * Math.cos(endAngleRad);
                                    const y2 = 100 + 70 * Math.sin(endAngleRad);

                                    const pathData = [
                                        `M 100 100`,
                                        `L ${x1} ${y1}`,
                                        `A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                        'Z'
                                    ].join(' ');

                                    const color = `hsl(${index * 60}, 70%, 50%)`;
                                    cumulativePercentage += percentage;

                                    return (
                                        <path
                                            key={index}
                                            d={pathData}
                                            fill={color}
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                    );
                                })}
                                <circle cx="100" cy="100" r="30" fill="white" />
                            </svg>
                            <div className="doughnut-legend">
                                {data.labels.map((label, index) => (
                                    <div key={index} className="legend-item">
                                        <span
                                            className="legend-color"
                                            style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                                        ></span>
                                        <span className="legend-label">{label}: {data.data[index]}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="analytics-page">
                <div className="auth-required">
                    <h2>Authentication Required</h2>
                    <p>Please log in to view analytics data.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h1>Analytics Dashboard</h1>
                <p>Comprehensive insights into platform performance and user engagement</p>
            </div>

            <div className="analytics-tabs">
                <button
                    className={`tab-button ${activeTab === 'platform' ? 'active' : ''}`}
                    onClick={() => setActiveTab('platform')}
                >
                    Platform Insights
                </button>
                <button
                    className={`tab-button ${activeTab === 'artist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('artist')}
                >
                    Artist Insights
                </button>
                <button
                    className={`tab-button ${activeTab === 'audience' ? 'active' : ''}`}
                    onClick={() => setActiveTab('audience')}
                >
                    Audience Insights
                </button>
            </div>

            <div className="analytics-content">
                {activeTab === 'platform' && (
                    <div className="platform-insights">
                        <div className="insights-grid">
                            <div className="metric-card">
                                <h3>Total Users</h3>
                                <div className="metric-value">{analyticsData.platformInsights.growth.totalUsers.toLocaleString()}</div>
                                <div className="metric-change positive">+{analyticsData.platformInsights.growth.monthlyGrowth}%</div>
                            </div>
                            <div className="metric-card">
                                <h3>Total Artworks</h3>
                                <div className="metric-value">{analyticsData.platformInsights.growth.totalArtworks.toLocaleString()}</div>
                                <div className="metric-change positive">+{analyticsData.platformInsights.growth.artworkGrowth}%</div>
                            </div>
                        </div>

                        <div className="charts-grid">
                            {renderChart('line', analyticsData.platformInsights.uploads, 'Monthly Uploads')}
                            {renderChart('bar', analyticsData.platformInsights.engagement, 'Engagement Overview')}
                        </div>
                    </div>
                )}

                {activeTab === 'artist' && (
                    <div className="artist-insights">
                        <div className="top-artists-section">
                            <h3>Top Performing Artists</h3>
                            <div className="artists-table">
                                <div className="table-header">
                                    <span>Artist</span>
                                    <span>Sales</span>
                                    <span>Rating</span>
                                    <span>Revenue</span>
                                </div>
                                {analyticsData.artistInsights.topArtists.map((artist, index) => (
                                    <div key={index} className="table-row">
                                        <span className="artist-name">{artist.name}</span>
                                        <span className="artist-sales">{artist.sales}</span>
                                        <span className="artist-rating">⭐ {artist.rating}</span>
                                        <span className="artist-revenue">${artist.revenue.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="charts-grid">
                            {renderChart('line', analyticsData.artistInsights.salesTrend, 'Sales Trend')}
                            {renderChart('doughnut', analyticsData.artistInsights.ratingDistribution, 'Rating Distribution')}
                        </div>
                    </div>
                )}

                {activeTab === 'audience' && (
                    <div className="audience-insights">
                        <div className="charts-grid">
                            {renderChart('doughnut', analyticsData.audienceInsights.geographic, 'Geographic Distribution')}
                            {renderChart('bar', analyticsData.audienceInsights.categoryTrends, 'Category Trends')}
                            {renderChart('doughnut', analyticsData.audienceInsights.ageGroups, 'Age Groups')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;