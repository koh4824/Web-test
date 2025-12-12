// server.js

// 1. 필요한 라이브러리 불러오기
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 2. 서버 설정
const app = express();
const server = http.createServer(app);
const PORT = 3000; 

// Socket.IO 설정: 모든 도메인에서의 접속을 허용합니다 (개발 편의상).
const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// 3. Socket.IO (실시간 통신) 로직
io.on('connection', (socket) => {
    console.log('새로운 슬라이드 쇼 기기가 연결되었습니다.');

    socket.on('disconnect', () => {
        console.log('기기 연결이 끊어졌습니다.');
    });

    // 4. 신호를 보낼 수 있는 HTTP 엔드포인트(URL) 설정
    // 이 URL로 접속하면 모든 연결된 클라이언트에게 신호를 보냅니다.
    app.get('/command/:direction', (req, res) => {
        const direction = req.params.direction;
        
        // 'next' 또는 'prev' 신호를 모든 클라이언트에게 전송
        io.emit('slide-command', direction); 
        
        console.log(`[COMMAND] 신호 수신: ${direction} -> 모든 클라이언트에게 전송`);
        res.send(`Command '${direction}' sent to all clients. Please refresh this page if it doesn't automatically.`);
    });
});

// 5. 서버 시작
server.listen(PORT, () => {
    console.log(`✨ 중앙 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`[다음] 신호 테스트 주소: http://localhost:${PORT}/command/next`);
    console.log(`[이전] 신호 테스트 주소: http://localhost:${PORT}/command/prev`);
});