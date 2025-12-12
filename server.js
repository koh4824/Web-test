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

// 4. Socket.IO (실시간 통신) 로직
io.on('connection', (socket) => {
    console.log('새로운 슬라이드 쇼 기기가 연결되었습니다.');

    socket.on('disconnect', () => {
        console.log('기기 연결이 끊어졌습니다.');
    });

    // **새로운 명령 경로 설정: /goto/:slideNumber**
    // 예: http://192.168.10.11:3000/goto/3 에 접속하면 3번 슬라이드로 이동 명령
    app.get('/goto/:slideNumber', (req, res) => {
        const slideNumber = parseInt(req.params.slideNumber); // 문자열을 숫자로 변환

        // 숫자가 유효한 범위(1~4)인지 확인하는 간단한 검증
        if (slideNumber >= 1 && slideNumber <= 4) {
            // 연결된 모든 슬라이드 쇼 클라이언트에게 신호를 전송
            io.emit('slide-command', { action: 'goto', index: slideNumber });
            
            console.log(`[COMMAND] 신호 수신: ${slideNumber}번 슬라이드 -> 모든 클라이언트에게 전송`);
            res.send(`Command 'Goto Slide ${slideNumber}' sent to all clients.`);
        } else {
             res.status(400).send("Invalid slide number. Use 1, 2, 3, or 4.");
        }
    });
});

// 5. 서버 시작 (콘솔 메시지 업데이트)
server.listen(PORT, () => {
    console.log(`✨ 중앙 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`[페이지 이동] 테스트 주소: http://localhost:${PORT}/goto/1 (1, 2, 3, 4로 변경 가능)`);
});
