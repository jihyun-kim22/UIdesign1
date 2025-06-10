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

// 팝업 닫기 시
popup.addEventListener("click", () => {
  popup.classList.remove("show");
  popupContent.classList.remove("show");

  // ✅ 팝업 위치 정보로 유기적인 점선 실루엣 생성
  const rect = popupContent.getBoundingClientRect();

  const outline = document.createElement("div");
  outline.className = "popup-outline organic-outline";
  outline.style.left = `${rect.left}px`;
  outline.style.top = `${rect.top}px`;
  outline.style.width = `${rect.width}px`;
  outline.style.height = `${rect.height}px`;

  document.body.appendChild(outline);

  // 텍스트 추가
  const text = document.createElement("div");
  text.className = "book-text";
  text.textContent = texts[outlineCount];  // 순차적으로 텍스트 설정
  text.style.position = "absolute";
  text.style.top = "50%";
  text.style.left = "50%";
  text.style.transform = "translate(-50%, -50%)";  // 중앙 정렬
  text.style.fontSize = "16px";
  text.style.color = "#333";
  text.style.cursor = "pointer";

  // 텍스트 클릭 시 로컬 파일로 이동
text.addEventListener("click", () => {
  const links = [
    "file:///C:/users/annam/%EC%9B%90%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/%EB%AC%B8%EC%84%9C/Github/UIdesign1/my-tea-site/book.html",   // 첫 번째 실루엣 클릭 시 이동
    "file:///C:/path/to/your/face-file.html",   // 두 번째 실루엣 클릭 시 이동
    "file:///C:/path/to/your/about-file.html"   // 세 번째 실루엣 클릭 시 이동
  ];
  window.location.href = links[outlineCount];  // 로컬 파일로 이동
});

  outline.appendChild(text);  // 실루엣에 텍스트 추가
  document.body.appendChild(outline);  // 화면에 실루엣 추가

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