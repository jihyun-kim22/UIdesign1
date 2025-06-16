const colorPool = [
  "#ff6f61", "#ffb347", "#ffd700", "#90ee90", "#87cefa",
  "#dda0dd", "#ff69b4", "#f08080", "#f4a460", "#c0c0f0",
  "#add8e6", "#98fb98", "#b0e0e6", "#e6a8d7", "#f9c5d1"
];

const keywords = [
  "꽃", "선풍기", "고양이", "거북이", "아이", "축제", "장마", "낮잠", "바캉스", "산책",
  "침대", "자기 전", "이불", "눈", "우리", "연기", "주전자", "동그래지다", "소파", "녹다",
  "요정", "욕조", "기다림", "발자국", "수박", "시원하다", "에너지", "간질간질", "몽글몽글", "연인"
];

const container = document.getElementById("keyword-container");
const showDrawingBtn = document.getElementById("showDrawing");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");

const fixedKeywords = new Set();

const seasonMap = {
  '봄': ["꽃", "고양이", "거북이", "아이", "축제", "산책", "몽글몽글", "연인"],
  '여름': ["선풍기", "장마", "낮잠", "바캉스", "수박", "시원하다", "에너지"],
  '가을': ["침대", "자기 전", "연기", "주전자", "요정", "간질간질"],
  '겨울': ["이불", "눈", "우리", "동그래지다", "소파", "녹다", "욕조", "기다림", "발자국"]
};

const seasonPages = {
  '봄': [[1], [2,3], [4,5], [6,7], [8,9], [10,11], [12,13], [14,15], [16,17]],
  '여름': [[18,19], [20,21], [22,23], [24,25], [26,27], [28,29], [30,31], [32,33]],
  '가을': [[34,35], [36,37], [38,39], [40,41], [42,43], [44,45], [46,47]],
  '겨울': [[48,49], [50,51], [52,53], [54,55], [56,57], [58,59], [60,61], [62,63], [64,65], [66,67]]
};

function getRandomColor() {
  return colorPool[Math.floor(Math.random() * colorPool.length)];
}

function createFloatingKeyword(word) {
  const el = document.createElement("div");
  el.className = "keyword";
  el.textContent = word;

  const duration = 25 + Math.random() * 20;
  const delay = Math.random() * 10;
  const left = Math.random() * 90;
  const hoverColor = getRandomColor();

  el.style.left = `${left}vw`;
  el.style.top = `100vh`;
  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay = `${delay}s`;
  el.style.setProperty('--hover-color', hoverColor);

  let fixed = false;

  el.addEventListener("click", () => {
    if (fixed) return;
    fixed = true;

    const rect = el.getBoundingClientRect();
    el.classList.add("fixed");
    el.style.position = "fixed";
    el.style.top = `${rect.top}px`;
    el.style.left = `${rect.left}px`;
    el.style.setProperty('--hover-color', hoverColor);
    fixedKeywords.add(el.textContent);

    if (fixedKeywords.size >= 3) {
      showDrawingBtn.style.display = "block";
    }
  });

  el.addEventListener("animationend", () => {
    if (!fixed) {
      el.remove();
      createFloatingKeyword(word);
    }
  });

  container.appendChild(el);
}

keywords.forEach((word, i) => {
  setTimeout(() => createFloatingKeyword(word), i * 300);
});

showDrawingBtn.addEventListener("click", () => {
  const count = { '봄': 0, '여름': 0, '가을': 0, '겨울': 0 };

  fixedKeywords.forEach(word => {
    for (let season in seasonMap) {
      if (seasonMap[season].includes(word)) count[season]++;
    }
  });

  const maxSeason = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
  const pageSet = seasonPages[maxSeason];
  const randomSet = pageSet[Math.floor(Math.random() * pageSet.length)];

  popupContent.innerHTML = "";

  randomSet.forEach(pageNum => {
    const padded = String(pageNum).padStart(2, "0");
    const img = document.createElement("img");
    img.src = `book-images/page${padded}.png`;
    popupContent.appendChild(img);
  });

  const fixedEls = document.querySelectorAll(".keyword.fixed");
  let totalX = 0, totalY = 0;

  fixedEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    totalX += rect.left + rect.width / 2;
    totalY += rect.top + rect.height / 2;
  });

  const avgX = totalX / fixedEls.length;
  const avgY = totalY / fixedEls.length;

  const maxX = window.innerWidth - popupContent.offsetWidth - 40;
  const maxY = window.innerHeight - popupContent.offsetHeight - 40;
  const safeX = Math.min(Math.max(20, avgX - popupContent.offsetWidth / 2), maxX);
  const safeY = Math.min(Math.max(20, avgY - popupContent.offsetHeight / 2), maxY);

  popup.classList.add("show");
  popupContent.classList.add("show");
  popupContent.style.left = `${safeX}px`;
  popupContent.style.top = `${safeY}px`;
});

let outlineCount = 0;  // 실루엣과 텍스트 생성 횟수를 추적하는 변수
const texts = ["book", "face", "about"];  // 실루엣에 나타날 텍스트 배열

// 팝업 닫기 시 첫 번째 실루엣과 'book' 텍스트 추가
popup.addEventListener("click", () => {
  popup.classList.remove("show");
  popupContent.classList.remove("show");

  // ✅ 팝업 위치 정보로 유기적인 점선 실루엣 생성
  const rect = popupContent.getBoundingClientRect();

  const outline = document.createElement("div");
  outline.className = "popup-outline organic-outline";
  outline.style.display = "flex";
  outline.style.alignItems = "center";
  outline.style.justifyContent = "center";
  outline.style.left = `${rect.left}px`;
  outline.style.top = `${rect.top}px`;
  outline.style.width = `${rect.width}px`;
  outline.style.height = `${rect.height}px`;

  // 텍스트 추가
  const text = document.createElement("a");
  text.className = "book-text";
  text.textContent = texts[outlineCount];  // 순차적으로 텍스트 설정
  text.style.fontSize = "16px";
  text.style.color = "#333";  // 기본 텍스트 색상
  text.style.cursor = "pointer";  // 클릭 가능 표시
  text.href = "book.html";  // 링크 설정
  text.style.pointerEvents = "auto";  // 링크 설정

  // 텍스트 클릭 시 각 동작을 다르게 처리
text.addEventListener("click", (event) => {
  if (text.textContent === "book") {
    // 'book' 텍스트를 클릭했을 때 새 윈도우에서 book.html 열기
    event.preventDefault();  // 기존 링크 이동 방지
    window.open("book.html", "_blank", "width=800,height=600");  // 새 창 열기
  } else if (text.textContent === "face") {
    // 'face' 텍스트를 클릭했을 때 드로잉 이미지 띄우기
    event.preventDefault();  // 기본 동작 방지 (링크 이동 방지)
    createFaceDrawings();  // face 드로잉 생성 함수 호출
  } else if (text.textContent === "about") {
    // 'about' 텍스트를 클릭했을 때 타자기처럼 글자가 나오도록 하기
    event.preventDefault();  // 기본 동작 방지 (링크 이동 방지)
    
    // 실루엣 생성 (이미 만들어놓은 실루엣을 사용하는 것과 동일)
    const rect = popupContent.getBoundingClientRect();
    const outline = document.createElement("div");
    outline.className = "popup-outline organic-outline";
    outline.style.left = `${rect.left}px`;
    outline.style.top = `${rect.top}px`;
    outline.style.width = `${rect.width}px`;
    outline.style.height = `${rect.height}px`;
    outline.style.position = "absolute";
    
    document.body.appendChild(outline);  // 화면에 실루엣 추가
    
    // 타자기 효과로 글자 나오게 하기
    const infoText = document.createElement("div");
    infoText.className = "about-text";
    infoText.innerHTML = "Jihyun Kim <br> Illustration + UI design programming <br>2025.";

    outline.appendChild(infoText);  // 실루엣에 텍스트 추가

    // 타자기 효과를 위한 스타일 추가
    let index = 0;
    const textContent = infoText.innerText;
    infoText.innerText = ""; // 시작 시 빈 텍스트로 설정

    const typingEffect = () => {
      if (index < textContent.length) {
        infoText.innerText += textContent[index];
        index++;
        setTimeout(typingEffect, 100); // 글자 간 간격
      }
    };

    typingEffect();
  }
});

  document.body.appendChild(outline);  // 화면에 실루엣 추가
  outline.appendChild(text);  // 실루엣에 텍스트 추가

  outlineCount++;  // 다음 실루엣으로

  // ✅ 기존 키워드 초기화
  const fixedEls = document.querySelectorAll(".keyword.fixed");
  fixedEls.forEach(el => {
    const word = el.textContent;
    el.remove();
    setTimeout(() => createFloatingKeyword(word), 100);
  });

  fixedKeywords.clear();
  showDrawingBtn.style.display = "none";
});

// "face" 텍스트 클릭 시 드로잉 이미지들이 화면에 랜덤하게 나타나게 하는 함수
function createFaceDrawings() {
  // 드로잉 관련 이미지 배열 (faces 폴더 내의 이미지 경로)
  const faceDrawings = [];
  for (let i = 1; i <= 31; i++) {
    faceDrawings.push(`faces/face${i}.png`);
  }

  // 드로잉 이미지를 랜덤하게 생성하는 함수
  function createRandomDrawing() {
    const drawing = document.createElement("img");
    drawing.className = "face-drawing";  // 클래스를 지정하여 CSS에서 스타일을 추가할 수 있습니다
    drawing.src = faceDrawings[Math.floor(Math.random() * faceDrawings.length)];
    drawing.style.position = "absolute";
    drawing.style.left = `${Math.random() * 100}vw`;  // 화면의 랜덤 위치
    drawing.style.top = `${Math.random() * 100}vh`;  // 화면의 랜덤 위치
    drawing.style.opacity = "0";
    drawing.style.transition = "opacity 1s ease-out, transform 1s ease-out"; // 애니메이션 효과

    document.body.appendChild(drawing);

    // 애니메이션: 1초 후 드로잉을 부드럽게 나타나게
    setTimeout(() => {
      drawing.style.opacity = "1";
      drawing.style.transform = "scale(1)";  // 크기 조정 (선택적)
    }, 50);

    // 드로잉이 일정 시간 후 사라지게
    setTimeout(() => {
      drawing.style.opacity = "0";  // 부드럽게 사라지게
      setTimeout(() => drawing.remove(), 1000);  // 1초 후에 요소를 제거
    }, 3000);  // 3초 후에 사라지도록 설정
  }

  // 드로잉 생성 반복 (예: 5번 생성)
  let count = 5;  // 드로잉을 몇 개 띄울지 설정 (예: 5개)
  const interval = setInterval(() => {
    if (count > 0) {
      createRandomDrawing();  // 드로잉 하나 생성
      count--;
    } else {
      clearInterval(interval);  // 5개 드로잉이 다 나타나면 interval 종료
    }
  }, 500);  // 0.5초 간격으로 드로잉을 화면에 추가
}


const siteTitle = document.getElementById("site-title");
const subtitle = document.getElementById("site-subtitle");
const typingText = "ㄴ  이것은 차에 관한 기억, 그림, 페이지, 지나가는 얼굴들, 김지현의 생각";

let typingStarted = false;

siteTitle.addEventListener("click", () => {
  if (typingStarted) return;  // 이미 시작되었으면 다시 실행 X
  typingStarted = true;

  let index = 0;
  subtitle.textContent = "";

  const typeNext = () => {
    if (index < typingText.length) {
      subtitle.textContent += typingText[index];
      index++;
      setTimeout(typeNext, 100); // 글자당 100ms
    }
  };

  typeNext();
});