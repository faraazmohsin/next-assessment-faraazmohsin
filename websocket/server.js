const WebSocket = require('ws');
const http = require('http');

// initialize http server
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('WebSocket sever is running');
});

const wss = new WebSocket.Server({ server });

// storing all connected clients
const clients = new Set();

// broadcasting messages to all connected clients excluding the sender
function broadcast(message, sender) {
    clients.forEach((client) => {
        if (client!== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// event listener for WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    // event listener for messages from clients
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        broadcast(message, ws);
    });

    // event listener for closing connection
    ws.on('close', (ws) => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    // error handling
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

// error handling for http server
server.on('error', (error) => {
    console.error('Server error:', error);
});

// start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});
