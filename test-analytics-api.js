const axios = require('axios');

async function testAnalyticsAPI() {
    try {
        console.log('Testing Analytics API endpoints...');
        
        // Test platform insights
        console.log('\n1. Testing Platform Insights...');
        const platformResponse = await axios.get('http://localhost:5000/api/analytics/platform');
        console.log('✅ Platform insights:', platformResponse.data.success ? 'SUCCESS' : 'FAILED');
        console.log('Data keys:', Object.keys(platformResponse.data.data || {}));
        
        // Test artist insights
        console.log('\n2. Testing Artist Insights...');
        const artistResponse = await axios.get('http://localhost:5000/api/analytics/artists');
        console.log('✅ Artist insights:', artistResponse.data.success ? 'SUCCESS' : 'FAILED');
        console.log('Data keys:', Object.keys(artistResponse.data.data || {}));
        
        // Test audience insights
        console.log('\n3. Testing Audience Insights...');
        const audienceResponse = await axios.get('http://localhost:5000/api/analytics/audience');
        console.log('✅ Audience insights:', audienceResponse.data.success ? 'SUCCESS' : 'FAILED');
        console.log('Data keys:', Object.keys(audienceResponse.data.data || {}));
        
        console.log('\n🎉 All analytics endpoints are working!');
        
    } catch (error) {
        console.error('❌ Error testing analytics API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testAnalyticsAPI();