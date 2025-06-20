document.addEventListener("DOMContentLoaded", function () {
  const book = document.getElementById('book');
  const bookContainer = document.getElementById('bookContainer');
  const pageIndicator = document.getElementById('pageIndicator');
  const totalPages = 70;
  let currentSpread = 0;
  const spreads = [];

  // 첫 장 단면
  if (totalPages >= 1) spreads.push([1]);

  // 중간 양면
  for (let i = 2; i < totalPages; i += 2) {
    const pair = [];
    if (i <= totalPages - 1) pair.push(i);
    if (i + 1 <= totalPages - 1) pair.push(i + 1);
    spreads.push(pair);
  }

  // 마지막 장 단면
  if (totalPages > 1) spreads.push([totalPages]);

  // 페이지 삽입
  spreads.forEach(group => {
    const spreadDiv = document.createElement('div');
    spreadDiv.className = 'spread';
    if (group.length === 2) {
      spreadDiv.classList.add('two-pages');
      spreadDiv.style.width = '3496px';
    } else {
      spreadDiv.style.width = '1748px';
    }
    spreadDiv.style.height = '2480px';

    group.forEach(i => {
      const pageNum = String(i).padStart(2, '0');
      const page = document.createElement('div');
      page.className = 'page';
      const img = document.createElement('img');
      img.src = `book-images/page${pageNum}.png`;
      img.alt = `Page ${i}`;
      page.appendChild(img);
      spreadDiv.appendChild(page);
    });

    book.appendChild(spreadDiv);
  });

  // 페이지 업데이트 함수
  function updateView() {
    const spreadsDom = document.querySelectorAll('.spread');
    spreadsDom.forEach((el) => el.classList.remove('visible'));
    spreadsDom[currentSpread].classList.add('visible');

    bookContainer.style.width = (spreads[currentSpread].length === 2) ? '3496px' : '1748px';
    bookContainer.style.height = '2480px';

    const visiblePages = spreads[currentSpread];
    const pageText = visiblePages.length === 1
      ? ` ${visiblePages[0]} / ${totalPages}`
      : ` ${visiblePages[0]}-${visiblePages[1]} / ${totalPages}`;
    pageIndicator.textContent = pageText;

    // 배경 계절 클래스 적용
    const body = document.body;
    body.classList.remove('spring', 'summer', 'autumn', 'winter');
    const seasonClass = getSeasonFromPage(visiblePages[0]);
    if (seasonClass) {
      body.classList.add(seasonClass);
    }
  }

  // 계절 판별
  function getSeasonFromPage(pageNum) {
    if (pageNum >= 1 && pageNum <= 17) return 'spring';
    if (pageNum >= 18 && pageNum <= 33) return 'summer';
    if (pageNum >= 34 && pageNum <= 47) return 'autumn';
    if (pageNum >= 48 && pageNum <= 70) return 'winter';
    return '';
  }

  // 목차 클릭
  document.querySelectorAll(".toc button").forEach(button => {
    button.addEventListener("click", () => {
      const targetPage = parseInt(button.dataset.page);
      const targetIndex = spreads.findIndex(group => group.includes(targetPage));
      if (targetIndex !== -1) {
        currentSpread = targetIndex;
        updateView();
      }
    });
  });

  // 좌우 네비게이션 버튼
  document.getElementById('next').addEventListener('click', () => {
    if (currentSpread < spreads.length - 1) {
      currentSpread++;
      updateView();
    }
  });

  document.getElementById('prev').addEventListener('click', () => {
    if (currentSpread > 0) {
      currentSpread--;
      updateView();
    }
  });

  // 키보드 방향키 지원
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      document.getElementById("next").click();
    } else if (event.key === "ArrowLeft") {
      document.getElementById("prev").click();
    }
  });

  updateView(); // 시작 시 초기 표시
});

