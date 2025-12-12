// script.js

// ----------------------------------------
// 1. WebSocket (Socket.IO) 연결 설정
// ----------------------------------------
// **주의: 서버가 실행되는 주소로 변경해야 합니다.**
// 예시: 192.168.10.11:3000 (본인의 내부 IP와 포트로 설정)
const SERVER_URL = 'http://192.168.10.11:3000'; 
const socket = io(SERVER_URL); 

// ----------------------------------------
// 2. DOM 요소 및 변수 설정
// ----------------------------------------
const slides = document.querySelectorAll('.slide');
let currentSlideIndex = 1; 
const totalSlides = slides.length;

// ----------------------------------------
// 3. 슬라이드 전환 로직 함수
// ----------------------------------------

function showSlide(index) {
    // 인덱스 유효성 검사 (1~4 사이의 값만 허용)
    if (index < 1 || index > totalSlides) {
        console.error(`잘못된 슬라이드 인덱스 요청: ${index}`);
        return; // 유효하지 않은 요청은 무시
    }

    // 1. 모든 슬라이드에서 'current' 클래스 제거
    slides.forEach(slide => {
        slide.classList.remove('current');
    });

    // 2. 지정된 슬라이드에 'current' 클래스 추가 (보이게 함)
    // 인덱스는 1부터 시작하므로 배열 접근 시 index - 1 사용
    slides[index - 1].classList.add('current');
    
    // 3. 현재 인덱스 업데이트
    currentSlideIndex = index;
    console.log(`[화면 전환 성공] 현재 슬라이드: ${currentSlideIndex}`);
}

// ----------------------------------------
// 4. 서버 신호 수신 이벤트 리스너 (핵심 로직)
// ----------------------------------------

socket.on('connect', () => {
    console.log('✅ 서버에 성공적으로 연결되었습니다.');
});

// 서버에서 'slide-command' 신호를 받았을 때
socket.on('slide-command', (command) => {
    // command는 { action: 'goto', index: 숫자 } 형태의 객체여야 합니다.
    
    // 신호가 객체인지, action과 index 속성이 있는지 확인
    if (command && command.action === 'goto' && typeof command.index === 'number') {
        
        // 받은 index 값으로 바로 화면 전환 함수를 실행
        console.log(`[신호 수신] ${command.index}번 화면으로 전환 요청`);
        showSlide(command.index); 
        
    } else {
        console.warn("알 수 없는 명령 수신 또는 형식 오류:", command);
    }
});

// ----------------------------------------
// 5. 초기 설정
// ----------------------------------------
// 페이지 로드 시 첫 번째 슬라이드 표시
showSlide(currentSlideIndex);

// (선택 사항) 디버깅 및 테스트를 위해 남겨둘 수 있습니다.
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') showSlide(currentSlideIndex + 1);
    if (e.key === 'ArrowLeft') showSlide(currentSlideIndex - 1);
});