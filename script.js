// script.js

// ----------------------------------------
// 1. WebSocket (Socket.IO) 연결 설정
// ----------------------------------------
// **주의: 서버가 실행되는 주소로 변경해야 합니다.**
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
// 4. 서버 신호 수신 이벤트 리스너
// ----------------------------------------

socket.on('connect', () => {
    console.log('✅ 서버에 성공적으로 연결되었습니다.');
});

// 서버에서 'slide-command' 신호를 받았을 때
socket.on('slide-command', (direction) => {
    if (direction === 'next') {
        nextSlide(); 
    } else if (direction === 'prev') {
        prevSlide();
    }
});

// 페이지 로드 시 첫 번째 슬라이드 표시
showSlide(currentSlideIndex);

// (선택 사항) 개발/테스트를 위해 키보드 입력 기능 추가
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});