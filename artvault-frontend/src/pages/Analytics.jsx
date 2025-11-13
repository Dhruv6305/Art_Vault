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
    const [hoveredMetric, setHoveredMetric] = useState(null);
    const [hoveredChart, setHoveredChart] = useState(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        try {
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

    const InteractiveLineChart = ({ data, title }) => {
        const [hoveredPoint, setHoveredPoint] = useState(null);
        const maxValue = Math.max(...data.data);
        
        return (
            <div className="super-chart-card">
                <div className="chart-header">
                    <h3>{title}</h3>
                    <span className="chart-icon">📈</span>
                </div>
                <div className="chart-body">
                    <svg viewBox="0 0 400 200" className="interactive-chart">
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <line
                                key={i}
                                x1="40"
                                y1={20 + i * 40}
                                x2="380"
                                y2={20 + i * 40}
                                stroke="var(--border-color)"
                                strokeWidth="1"
                                opacity="0.3"
                            />
                        ))}
                        
                        {/* Area under line */}
                        <path
                            d={`M 40 180 ${data.data.map((value, index) => {
                                const x = (index * 60) + 40;
                                const y = 180 - ((value / maxValue) * 140);
                                return `L ${x} ${y}`;
                            }).join(' ')} L ${(data.data.length - 1) * 60 + 40} 180 Z`}
                            fill="url(#lineGradient)"
                        />
                        
                        {/* Line */}
                        <path
                            d={`M ${data.data.map((value, index) => {
                                const x = (index * 60) + 40;
                                const y = 180 - ((value / maxValue) * 140);
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}`}
                            stroke="var(--primary-color)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        
                        {/* Points */}
                        {data.data.map((value, index) => {
                            const x = (index * 60) + 40;
                            const y = 180 - ((value / maxValue) * 140);
                            const isHovered = hoveredPoint === index;
                            
                            return (
                                <g key={index}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={isHovered ? "8" : "5"}
                                        fill="var(--primary-color)"
                                        stroke="white"
                                        strokeWidth="2"
                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={() => setHoveredPoint(index)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    />
                                    {isHovered && (
                                        <>
                                            <rect
                                                x={x - 25}
                                                y={y - 35}
                                                width="50"
                                                height="25"
                                                fill="var(--surface-color)"
                                                stroke="var(--primary-color)"
                                                strokeWidth="2"
                                                rx="5"
                                            />
                                            <text
                                                x={x}
                                                y={y - 17}
                                                textAnchor="middle"
                                                fontSize="14"
                                                fontWeight="bold"
                                                fill="var(--text-primary)"
                                            >
                                                {value}
                                            </text>
                                        </>
                                    )}
                                    <text
                                        x={x}
                                        y="195"
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="var(--text-secondary)"
                                    >
                                        {data.labels[index]}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        );
    };

    const InteractiveBarChart = ({ data, title }) => {
        const [hoveredBar, setHoveredBar] = useState(null);
        const maxValue = Math.max(...data.data);
        
        return (
            <div className="super-chart-card">
                <div className="chart-header">
                    <h3>{title}</h3>
                    <span className="chart-icon">📊</span>
                </div>
                <div className="chart-body">
                    <div className="bar-chart-container">
                        {data.data.map((value, index) => {
                            const isHovered = hoveredBar === index;
                            const height = (value / maxValue) * 100;
                            
                            return (
                                <div
                                    key={index}
                                    className="bar-wrapper"
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    <div className="bar-container">
                                        <div
                                            className={`bar ${isHovered ? 'hovered' : ''}`}
                                            style={{ height: `${height}%` }}
                                        >
                                            {isHovered && (
                                                <div className="bar-tooltip">
                                                    <span className="tooltip-value">{value}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="bar-label">{data.labels[index]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const InteractiveDoughnutChart = ({ data, title }) => {
        const [hoveredSegment, setHoveredSegment] = useState(null);
        const total = data.data.reduce((sum, val) => sum + val, 0);
        let cumulativePercentage = 0;
        
        const colors = [
            'var(--primary-color)',
            'var(--secondary-color)',
            'var(--success-color)',
            'var(--warning-color)',
            'var(--info-color)',
            'var(--danger-color)'
        ];

        return (
            <div className="super-chart-card">
                <div className="chart-header">
                    <h3>{title}</h3>
                    <span className="chart-icon">🎯</span>
                </div>
                <div className="chart-body">
                    <div className="doughnut-container">
                        <svg viewBox="0 0 200 200" className="doughnut-svg">
                            {data.data.map((value, index) => {
                                const percentage = (value / total) * 100;
                                const startAngle = (cumulativePercentage / 100) * 360;
                                const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
                                const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                                const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                                const largeArcFlag = percentage > 50 ? 1 : 0;
                                
                                const outerRadius = hoveredSegment === index ? 75 : 70;
                                const innerRadius = 40;
                                
                                const x1Outer = 100 + outerRadius * Math.cos(startAngleRad);
                                const y1Outer = 100 + outerRadius * Math.sin(startAngleRad);
                                const x2Outer = 100 + outerRadius * Math.cos(endAngleRad);
                                const y2Outer = 100 + outerRadius * Math.sin(endAngleRad);
                                
                                const x1Inner = 100 + innerRadius * Math.cos(startAngleRad);
                                const y1Inner = 100 + innerRadius * Math.sin(startAngleRad);
                                const x2Inner = 100 + innerRadius * Math.cos(endAngleRad);
                                const y2Inner = 100 + innerRadius * Math.sin(endAngleRad);
                                
                                const pathData = [
                                    `M ${x1Outer} ${y1Outer}`,
                                    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
                                    `L ${x2Inner} ${y2Inner}`,
                                    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
                                    'Z'
                                ].join(' ');
                                
                                const color = colors[index % colors.length];
                                cumulativePercentage += percentage;
                                
                                return (
                                    <path
                                        key={index}
                                        d={pathData}
                                        fill={color}
                                        stroke="var(--background-color)"
                                        strokeWidth="2"
                                        style={{ 
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.5
                                        }}
                                        onMouseEnter={() => setHoveredSegment(index)}
                                        onMouseLeave={() => setHoveredSegment(null)}
                                    />
                                );
                            })}
                            <circle cx="100" cy="100" r="40" fill="var(--surface-color)" />
                            {hoveredSegment !== null && (
                                <text
                                    x="100"
                                    y="105"
                                    textAnchor="middle"
                                    fontSize="20"
                                    fontWeight="bold"
                                    fill="var(--text-primary)"
                                >
                                    {((data.data[hoveredSegment] / total) * 100).toFixed(1)}%
                                </text>
                            )}
                        </svg>
                        <div className="doughnut-legend">
                            {data.labels.map((label, index) => (
                                <div
                                    key={index}
                                    className={`legend-item ${hoveredSegment === index ? 'active' : ''}`}
                                    onMouseEnter={() => setHoveredSegment(index)}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                >
                                    <span
                                        className="legend-color"
                                        style={{ backgroundColor: colors[index % colors.length] }}
                                    ></span>
                                    <span className="legend-label">{label}</span>
                                    <span className="legend-value">{data.data[index]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="super-analytics-page">
                <div className="super-auth-required">
                    <div className="auth-icon">🔒</div>
                    <h2>Authentication Required</h2>
                    <p>Please log in to view analytics data.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="super-analytics-page">
                <div className="super-loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="super-analytics-page">
                <div className="super-error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Error Loading Analytics</h2>
                    <p>{error}</p>
                    <button onClick={fetchAnalyticsData} className="super-retry-button">
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!analyticsData.platformInsights) {
        return (
            <div className="super-analytics-page">
                <div className="super-loading-container">
                    <p>No analytics data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="super-analytics-page">
            <div className="super-analytics-header">
                <div className="header-content">
                    <h1>📊 Analytics Dashboard</h1>
                    <p>Comprehensive insights into platform performance and user engagement</p>
                </div>
                <button onClick={fetchAnalyticsData} className="refresh-button">
                    🔄 Refresh Data
                </button>
            </div>

            <div className="super-analytics-tabs">
                <button
                    className={`super-tab-button ${activeTab === 'platform' ? 'active' : ''}`}
                    onClick={() => setActiveTab('platform')}
                >
                    <span className="tab-icon">🌐</span>
                    <span className="tab-text">Platform Insights</span>
                </button>
                <button
                    className={`super-tab-button ${activeTab === 'artist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('artist')}
                >
                    <span className="tab-icon">🎨</span>
                    <span className="tab-text">Artist Insights</span>
                </button>
                <button
                    className={`super-tab-button ${activeTab === 'audience' ? 'active' : ''}`}
                    onClick={() => setActiveTab('audience')}
                >
                    <span className="tab-icon">👥</span>
                    <span className="tab-text">Audience Insights</span>
                </button>
            </div>

            <div className="super-analytics-content">
                {activeTab === 'platform' && analyticsData.platformInsights && (
                    <div className="platform-insights">
                        <div className="super-metrics-grid">
                            <div 
                                className={`super-metric-card ${hoveredMetric === 'users' ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredMetric('users')}
                                onMouseLeave={() => setHoveredMetric(null)}
                            >
                                <div className="metric-icon">👥</div>
                                <div className="metric-content">
                                    <h3>Total Users</h3>
                                    <div className="metric-value">{analyticsData.platformInsights.growth.totalUsers.toLocaleString()}</div>
                                    <div className={`metric-change ${analyticsData.platformInsights.growth.monthlyGrowth >= 0 ? 'positive' : 'negative'}`}>
                                        <span className="change-icon">{analyticsData.platformInsights.growth.monthlyGrowth >= 0 ? '📈' : '📉'}</span>
                                        <span>{analyticsData.platformInsights.growth.monthlyGrowth >= 0 ? '+' : ''}{analyticsData.platformInsights.growth.monthlyGrowth}%</span>
                                        <span className="change-label">this month</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div 
                                className={`super-metric-card ${hoveredMetric === 'artworks' ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredMetric('artworks')}
                                onMouseLeave={() => setHoveredMetric(null)}
                            >
                                <div className="metric-icon">🖼️</div>
                                <div className="metric-content">
                                    <h3>Total Artworks</h3>
                                    <div className="metric-value">{analyticsData.platformInsights.growth.totalArtworks.toLocaleString()}</div>
                                    <div className={`metric-change ${analyticsData.platformInsights.growth.artworkGrowth >= 0 ? 'positive' : 'negative'}`}>
                                        <span className="change-icon">{analyticsData.platformInsights.growth.artworkGrowth >= 0 ? '📈' : '📉'}</span>
                                        <span>{analyticsData.platformInsights.growth.artworkGrowth >= 0 ? '+' : ''}{analyticsData.platformInsights.growth.artworkGrowth}%</span>
                                        <span className="change-label">this month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="super-charts-grid">
                            <InteractiveLineChart data={analyticsData.platformInsights.uploads} title="Monthly Uploads" />
                            <InteractiveBarChart data={analyticsData.platformInsights.engagement} title="Platform Engagement" />
                        </div>
                    </div>
                )}

                {activeTab === 'artist' && analyticsData.artistInsights && (
                    <div className="artist-insights">
                        <div className="super-artists-section">
                            <div className="section-header">
                                <h3>🏆 Top Performing Artists</h3>
                                <span className="section-subtitle">Based on sales and ratings</span>
                            </div>
                            <div className="super-artists-table">
                                <div className="table-header">
                                    <span>Rank</span>
                                    <span>Artist</span>
                                    <span>Sales</span>
                                    <span>Rating</span>
                                    <span>Revenue</span>
                                </div>
                                {analyticsData.artistInsights.topArtists.length > 0 ? (
                                    analyticsData.artistInsights.topArtists.map((artist, index) => (
                                        <div key={index} className="table-row">
                                            <span className="artist-rank">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                            </span>
                                            <span className="artist-name">
                                                <span className="name-icon">👨‍🎨</span>
                                                {artist.name}
                                            </span>
                                            <span className="artist-sales">
                                                <span className="sales-badge">{artist.sales}</span>
                                            </span>
                                            <span className="artist-rating">
                                                <span className="rating-stars">{'⭐'.repeat(Math.floor(artist.rating))}</span>
                                                <span className="rating-value">{artist.rating}</span>
                                            </span>
                                            <span className="artist-revenue">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: artist.currency || 'USD',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(artist.revenue)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="table-empty">
                                        <span className="empty-icon">📭</span>
                                        <span>No sales data available yet</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="super-charts-grid">
                            <InteractiveLineChart data={analyticsData.artistInsights.salesTrend} title="Sales Trend" />
                            <InteractiveDoughnutChart data={analyticsData.artistInsights.ratingDistribution} title="Rating Distribution" />
                        </div>
                    </div>
                )}

                {activeTab === 'audience' && analyticsData.audienceInsights && (
                    <div className="audience-insights">
                        <div className="super-charts-grid three-columns">
                            <InteractiveDoughnutChart data={analyticsData.audienceInsights.geographic} title="Geographic Distribution" />
                            <InteractiveBarChart data={analyticsData.audienceInsights.categoryTrends} title="Category Trends" />
                            <InteractiveDoughnutChart data={analyticsData.audienceInsights.ageGroups} title="Age Groups" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
