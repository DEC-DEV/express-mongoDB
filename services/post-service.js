const paginator = require("../utils/paginator") // ../은 상위디렉토리,  ./은 현재 디렉토리
const { ObjectId } = require("mongodb");

// 패스워드는 노출 할 필요가 없으므로 결과값으로 가져오지 않음
const projectionOpion = {
  projection: {
    password: 0, // 프로젝션(투영) 결괏값에서 일부만 가져올 떄 사용
    "comments.password": 0,
  },
};


async function writePost(collection, post){ // 글쓰기 함수
  //생설일시와 조회수
  post.hits = 0;
  post.createDt = new Date().toISOString(); // 날짜는 ISO 포맷으로 저장
  return await collection.insertOne(post); // 몽고db에 post를 저장 후 결과 반환
}

async function getDetailPost(collection, id) {
  // 몽고DB Collection의 findOneAndUpdate() 함수를 사용, 게시글을 읽을 때마다 hits를 1 증가
  return await collection.findOneAndUpdate({_id: ObjectId(id)}, { $inc: { hits: 1 } }, projectionOpion );
}



async function list(collection, page, search){
  const perPage = 10; // 한 페이지에 노출할 글 개수
  const query = { title: new RegExp(search, "i")} // title이 search와 부분 일치하는지 확인
  const cursor = collection.find(query, {limit: perPage, skip: (page - 1) * perPage}).sort({ // find 함수는 find(query, option)으로 구성
    createDt: -1, // limit은 10개만 가져온다는 의미, skip은 설정된 개수만큼 건너뛴다, 생성일 역순으로 정렬
  });

  //검색 되는 게시물들의 총합
  const totalCount = await collection.count(query);
  const posts = await cursor.toArray(); // 커서로 받아온 데이터를 리스트로 변경

  // 페이지 네이터 생성
  const paginatorObj = paginator({ totalCount, page, perPage: perPage });
  return [posts, paginatorObj];
}

module.exports = { // require()로 파일을 임포트시 외부로 노출 하는 객체
  writePost,
  list,
  getDetailPost,
};

