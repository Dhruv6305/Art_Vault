import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import '../styles/Analytics.css';

const Analytics = () => {
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('platform');
    const [analyticsData, setAnalyticsData] = useState({
        platformInsights: null,
        artistInsights: null,
        audienceInsights: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all analytics data
            const [platformResponse, artistResponse, audienceResponse] = await Promise.all([
                api.get('/analytics/platform'),
                api.get('/analytics/artists'),
                api.get('/analytics/audience')
            ]);

            setAnalyticsData({
                platformInsights: platformResponse.data.data,
                artistInsights: artistResponse.data.data,
                audienceInsights: audienceResponse.data.data
            });
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setError('Failed to load analytics data. Please try again.');
        } finally {
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

    if (error) {
        return (
            <div className="analytics-page">
                <div className="error-container">
                    <h2>Error Loading Analytics</h2>
                    <p>{error}</p>
                    <button onClick={fetchAnalyticsData} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!analyticsData.platformInsights) {
        return (
            <div className="analytics-page">
                <div className="loading-container">
                    <p>No analytics data available.</p>
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
                {activeTab === 'platform' && analyticsData.platformInsights && (
                    <div className="platform-insights">
                        <div className="insights-grid">
                            <div className="metric-card">
                                <h3>Total Users</h3>
                                <div className="metric-value">{analyticsData.platformInsights.growth.totalUsers.toLocaleString()}</div>
                                <div className={`metric-change ${analyticsData.platformInsights.growth.monthlyGrowth >= 0 ? 'positive' : 'negative'}`}>
                                    {analyticsData.platformInsights.growth.monthlyGrowth >= 0 ? '+' : ''}{analyticsData.platformInsights.growth.monthlyGrowth}%
                                </div>
                            </div>
                            <div className="metric-card">
                                <h3>Total Artworks</h3>
                                <div className="metric-value">{analyticsData.platformInsights.growth.totalArtworks.toLocaleString()}</div>
                                <div className={`metric-change ${analyticsData.platformInsights.growth.artworkGrowth >= 0 ? 'positive' : 'negative'}`}>
                                    {analyticsData.platformInsights.growth.artworkGrowth >= 0 ? '+' : ''}{analyticsData.platformInsights.growth.artworkGrowth}%
                                </div>
                            </div>
                        </div>

                        <div className="charts-grid">
                            {renderChart('line', analyticsData.platformInsights.uploads, 'Monthly Uploads')}
                            {renderChart('bar', analyticsData.platformInsights.engagement, 'Platform Engagement')}
                        </div>
                    </div>
                )}

                {activeTab === 'artist' && analyticsData.artistInsights && (
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
                                {analyticsData.artistInsights.topArtists.length > 0 ? (
                                    analyticsData.artistInsights.topArtists.map((artist, index) => (
                                        <div key={index} className="table-row">
                                            <span className="artist-name">{artist.name}</span>
                                            <span className="artist-sales">{artist.sales}</span>
                                            <span className="artist-rating">⭐ {artist.rating}</span>
                                            <span className="artist-revenue">${artist.revenue.toLocaleString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="table-row">
                                        <span style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No sales data available yet
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="charts-grid">
                            {renderChart('line', analyticsData.artistInsights.salesTrend, 'Sales Trend')}
                            {renderChart('doughnut', analyticsData.artistInsights.ratingDistribution, 'Rating Distribution')}
                        </div>
                    </div>
                )}

                {activeTab === 'audience' && analyticsData.audienceInsights && (
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