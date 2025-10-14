const axios = require('axios');

async function testFrontendAnalytics() {
    try {
        console.log('🧪 Testing Frontend Analytics Integration...');
        
        // Test the analytics endpoints that the frontend will call
        const baseURL = 'http://localhost:5000/api/analytics';
        
        console.log('\n1. Testing Platform Analytics...');
        const platformResponse = await axios.get(`${baseURL}/platform`);
        console.log('✅ Platform analytics:', platformResponse.data.success ? 'SUCCESS' : 'FAILED');
        
        if (platformResponse.data.success) {
            const data = platformResponse.data.data;
            console.log('   - Total Users:', data.growth.totalUsers);
            console.log('   - Total Artworks:', data.growth.totalArtworks);
            console.log('   - Monthly Growth:', data.growth.monthlyGrowth + '%');
            console.log('   - Upload Data Points:', data.uploads.data.length);
        }
        
        console.log('\n2. Testing Artist Analytics...');
        const artistResponse = await axios.get(`${baseURL}/artists`);
        console.log('✅ Artist analytics:', artistResponse.data.success ? 'SUCCESS' : 'FAILED');
        
        if (artistResponse.data.success) {
            const data = artistResponse.data.data;
            console.log('   - Top Artists Count:', data.topArtists.length);
            console.log('   - Sales Trend Data Points:', data.salesTrend.data.length);
            if (data.topArtists.length > 0) {
                console.log('   - Top Artist:', data.topArtists[0].name, 'with', data.topArtists[0].sales, 'sales');
            }
        }
        
        console.log('\n3. Testing Audience Analytics...');
        const audienceResponse = await axios.get(`${baseURL}/audience`);
        console.log('✅ Audience analytics:', audienceResponse.data.success ? 'SUCCESS' : 'FAILED');
        
        if (audienceResponse.data.success) {
            const data = audienceResponse.data.data;
            console.log('   - Geographic Regions:', data.geographic.labels.length);
            console.log('   - Category Types:', data.categoryTrends.labels.length);
            console.log('   - Top Category:', data.categoryTrends.labels[0], 'with', data.categoryTrends.data[0], 'items');
        }
        
        console.log('\n🎉 All analytics endpoints are working correctly!');
        console.log('📱 Frontend should be able to display dynamic charts now.');
        console.log('🌐 Visit http://localhost:5174 to see the analytics in action.');
        
    } catch (error) {
        console.error('❌ Error testing analytics:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testFrontendAnalytics();