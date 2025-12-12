// server.js

// 1. 필요한 라이브러리 불러오기
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 2. 서버 설정 및 변수 정의
const app = express();
const server = http.createServer(app);
const PORT = 3000; 
const TOTAL_SLIDES = 4; // 총 슬라이드 개수 정의

// Socket.IO 설정: 실시간 통신을 위한 WebSocket 연결을 처리합니다.
// CORS 설정: 다른 도메인(GitHub Pages)에서 접속할 수 있도록 허용합니다.
const io = socketIo(server, {
    cors: {
        origin: "*", // 모든 출처 허용 (개발 및 테스트 시 유용)
        methods: ["GET", "POST"]
    }
});

// ----------------------------------------------------
// 3. Socket.IO (실시간 통신) 로직: 연결/해제 이벤트만 처리
// ----------------------------------------------------
io.on('connection', (socket) => {
    console.log(`[연결] 새로운 슬라이드 쇼 기기가 연결되었습니다. ID: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`[연결 해제] 기기 연결이 끊어졌습니다. ID: ${socket.id}`);
    });
});


// ----------------------------------------------------
// 4. HTTP 명령 경로 설정 (화면 제어 리모컨 역할)
// 이 라우팅은 서버 시작 시 단 한 번만 등록됩니다.
// ----------------------------------------------------
// 예: http://192.168.10.11:3000/goto/3 에 접속하면 3번 슬라이드로 이동 명령 전송
app.get('/goto/:slideNumber', (req, res) => {
    const slideNumber = parseInt(req.params.slideNumber);

    // 슬라이드 번호 유효성 검증
    if (slideNumber >= 1 && slideNumber <= TOTAL_SLIDES) {
        
        // 연결된 모든 슬라이드 쇼 클라이언트에게 신호를 전송
        // 전송하는 데이터는 객체 형태 { action: 'goto', index: 숫자 } 입니다.
        io.emit('slide-command', { action: 'goto', index: slideNumber });
        
        console.log(`[COMMAND] 신호 수신: ${slideNumber}번 슬라이드 -> 모든 클라이언트에게 전송 완료`);
        
        // 명령을 보낸 기기에 성공 메시지 응답
        res.status(200).send(`✅ Command: Go to Slide ${slideNumber} sent successfully.`);

    } else {
         // 잘못된 명령일 경우 오류 메시지 응답
         res.status(400).send(`❌ Error: Invalid slide number. Please use a number between 1 and ${TOTAL_SLIDES}.`);
    }
});


// 5. 서버 시작
server.listen(PORT, () => {
    console.log(`\n✨ 중앙 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`\n-----------------------------------------------------`);
    console.log(`[슬라이드 쇼 화면 접속]: GitHub Pages URL`);
    console.log(`[명령어 기기 접속]: http://192.168.10.11:${PORT}/goto/1 (1, 2, 3, 4로 변경)`);
    console.log(`-----------------------------------------------------\n`);
});