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
    spreadDiv.style.width = (group.length === 2) ? '3496px' : '1748px';
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

  function updateView() {
  const spreadsDom = document.querySelectorAll('.spread');
  spreadsDom.forEach((el, i) => {
    el.classList.remove('visible');
  });
  spreadsDom[currentSpread].classList.add('visible');

  bookContainer.style.width = (spreads[currentSpread].length === 2) ? '3496px' : '1748px';
  bookContainer.style.height = '2480px';

  // 페이지 번호 업데이트
  const visiblePages = spreads[currentSpread];
  const pageText = visiblePages.length === 1
    ? ` ${visiblePages[0]} / ${totalPages}`
    : ` ${visiblePages[0]}-${visiblePages[1]} / ${totalPages}`;
  if (pageIndicator) {
    pageIndicator.textContent = pageText;
    // 목차 버튼 클릭 → 해당 페이지로 이동
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
  }
}

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

  updateView();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    document.getElementById("next").click();
  } else if (event.key === "ArrowLeft") {
    document.getElementById("prev").click();
  }
});

