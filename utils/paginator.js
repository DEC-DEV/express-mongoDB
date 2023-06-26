const lodash = require("lodash"); // 자바스크립트 라이브러리 - 배열 조작 기능, 함수형 프로그래밍 지원, 성능최적화 등
const PAGE_LIST_SIZE = 10; // 최대 몇개 페이지 보여줄 지 설정


module.exports = ( {totalCount, page, perPage = 10 }) => {
  const PER_PAGE = perPage;
  const totalPage = Math.ceil(totalCount / PER_PAGE); // 총 페이지수 계산

  // 시작 페이지 : 몫 * PAGE_LIST+SIZE + 1
  let quotient = parseInt(page / PAGE_LIST_SIZE);
  if (page % PAGE_LIST_SIZE === 0 ) {
    quotient -= 1;
  }

  const startPage = quotient * PAGE_LIST_SIZE + 1; // 시작 페이지 구하기

  // 끝 페이지 : startPage + PAGE_LIST_SIZE - 1
  const endPage = startPage + PAGE_LIST_SIZE - 1 < totalPage ? startPage + PAGE_LIST_SIZE - 1 : totalPage; // 끝 페이지 구하기

  const isFirstPage = page === 1;
  const isLastPage = page === totalPage;
  const hasPrev = page > 1;
  const hasNext = page < totalPage;

  const paginator = {
    // 표시할 페이지 번호 리스트를 만들어줌(lodash)
    pageList: lodash.range(startPage, endPage + 1),
    page,
    prevPage: page - 1,
    nextPage: page + 1,
    startPage,
    lastPage: totalPage,
    hasPrev,
    hasNext,
    isFirstPage,
    isLastPage,
  };
  return paginator;


  
}
