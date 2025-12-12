// script.js

// ----------------------------------------
// 1. WebSocket (Socket.IO) 연결 설정
// ----------------------------------------
// **주의: 서버가 실행되는 주소로 변경해야 합니다.**
const SERVER_URL = 'http://localhost:3000'; 
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
    // 인덱스 유효성 검사 및 무한 순환 로직
    if (index > totalSlides) {
        index = 1;
    } else if (index < 1) {
        index = totalSlides;
    }

    // 모든 슬라이드에서 'current' 클래스 제거
    slides.forEach(slide => {
        slide.classList.remove('current');
    });

    // 지정된 슬라이드에 'current' 클래스 추가 (보이게 함)
    slides[index - 1].classList.add('current');
    currentSlideIndex = index;
    console.log(`화면 전환: ${currentSlideIndex}`);
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

// ----------------------------------------
// 4. 서버 신호 수신 이벤트 리스너 (수정)
// ----------------------------------------

// 서버에서 'slide-command' 신호를 받았을 때
socket.on('slide-command', (command) => {
    // command는 이제 { action: 'goto', index: 3 } 형태의 객체입니다.
    
    if (command && command.action === 'goto' && typeof command.index === 'number') {
        // 받은 index 값으로 바로 화면 전환 함수를 실행
        showSlide(command.index); 
        console.log(`서버 신호에 의해 ${command.index}번 화면으로 즉시 전환됨`);
    } else {
        // 기존의 next/prev 명령을 받고 싶다면 여기에 로직을 추가합니다.
        console.log("알 수 없는 명령 수신:", command);
    }
});

// 페이지 로드 시 첫 번째 슬라이드 표시
showSlide(currentSlideIndex);
