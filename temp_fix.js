const fs = require('fs');
let content = fs.readFileSync('src/services/mockApi.ts', 'utf8');
content = content.replace(/sessionId: .*mock_session_.*,/, 'sessionId: mock_session_,');
fs.writeFileSync('src/services/mockApi.ts', content);
