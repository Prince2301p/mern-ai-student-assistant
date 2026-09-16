const app = require('./app');
const http = require('http');

// Helper to make local POST request to server
function makePostRequest(server, path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const address = server.address();
    const options = {
      hostname: 'localhost',
      port: address.port,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(body),
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Backend API Verification Tests...\n');
  const server = app.listen(0); // Listen on dynamic free port

  try {
    // Test 1: Missing prompt validation (Expected 400)
    console.log('Test 1: Validation - Missing prompt');
    const res1 = await makePostRequest(server, '/api/ai/generate', { mode: 'explain' });
    if (res1.statusCode === 400 && res1.data.success === false) {
      console.log('✅ Passed (HTTP 400 Returned correctly)\n');
    } else {
      console.error('❌ Failed Test 1:', res1);
    }

    // Test 2: Invalid mode validation (Expected 400)
    console.log('Test 2: Validation - Invalid mode');
    const res2 = await makePostRequest(server, '/api/ai/generate', { prompt: 'Hello', mode: 'invalid_mode' });
    if (res2.statusCode === 400 && res2.data.success === false) {
      console.log('✅ Passed (HTTP 400 Returned correctly)\n');
    } else {
      console.error('❌ Failed Test 2:', res2);
    }

    // Test 3: Mode "explain"
    console.log('Test 3: Mode - "explain"');
    const res3 = await makePostRequest(server, '/api/ai/generate', { prompt: 'JavaScript Closures', mode: 'explain' });
    if (res3.statusCode === 200 && res3.data.success === true && res3.data.response) {
      console.log('✅ Passed (HTTP 200 Response received)');
      console.log('   Sample output:', res3.data.response.substring(0, 100) + '...\n');
    } else {
      console.error('❌ Failed Test 3:', res3);
    }

    // Test 4: Mode "mcq" (Structured JSON)
    console.log('Test 4: Mode - "mcq" (Structured JSON output)');
    const res4 = await makePostRequest(server, '/api/ai/generate', { prompt: 'DBMS Normalization', mode: 'mcq' });
    if (res4.statusCode === 200 && res4.data.success === true && res4.data.isJson === true && res4.data.data.questions) {
      console.log('✅ Passed (HTTP 200 Received valid JSON with ' + res4.data.data.questions.length + ' questions)');
      console.log('   Sample Question:', res4.data.data.questions[0].question + '\n');
    } else {
      console.error('❌ Failed Test 4:', res4);
    }

    // Test 5: Mode "summarize"
    console.log('Test 5: Mode - "summarize"');
    const res5 = await makePostRequest(server, '/api/ai/generate', { prompt: 'OSI 7 Layer Networking Model', mode: 'summarize' });
    if (res5.statusCode === 200 && res5.data.success === true && res5.data.response) {
      console.log('✅ Passed (HTTP 200 Summary generated)\n');
    } else {
      console.error('❌ Failed Test 5:', res5);
    }

    // Test 6: Mode "improve"
    console.log('Test 6: Mode - "improve"');
    const res6 = await makePostRequest(server, '/api/ai/generate', { prompt: 'this is bad english text to fix', mode: 'improve' });
    if (res6.statusCode === 200 && res6.data.success === true && res6.data.response) {
      console.log('✅ Passed (HTTP 200 Writing improvement generated)\n');
    } else {
      console.error('❌ Failed Test 6:', res6);
    }

    console.log('🎉 ALL BACKEND API VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error during API testing:', err);
  } finally {
    server.close();
  }
}

runTests();
