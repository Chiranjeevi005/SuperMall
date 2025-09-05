import http from 'http';

// Make a request to the API
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/vendors',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('API Response:');
      console.log('Total items in response:', Array.isArray(jsonData) ? jsonData.length : (jsonData.vendors ? jsonData.vendors.length : 'Unknown'));
      if (jsonData.vendors) {
        console.log('Vendors:');
        jsonData.vendors.forEach((vendor, index) => {
          console.log(`${index + 1}. ${vendor.shopName}`);
        });
      } else if (Array.isArray(jsonData)) {
        console.log('Vendors:');
        jsonData.forEach((vendor, index) => {
          console.log(`${index + 1}. ${vendor.shopName}`);
        });
      } else {
        console.log('Response structure:', Object.keys(jsonData));
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end();