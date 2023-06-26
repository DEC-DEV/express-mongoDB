const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const postService = require("./services/post-service"); // 서비스 파일 로딩

//req.body와 POST 요청을 해석하기 위한 설정
app.use(express.json());  // express가 json 형식의 요청 본문을 파싱할 수 있도록
app.use(express.urlencoded({ extended: true })); // express가 URL-encoded 형식의 요청 본문을 파싱할 수 있도록. html form의 데이터 형식을 java-script 객체로 변환해줌.

// 몽고디비 연결 함수
const mongodbConnection = require("./configs/mongodb-connection");




app.engine(
  "handlebars",
  handlebars.create({
    helpers: require("./configs/handlebars-helpers"),
  }).engine
); // 1.템플릿 엔진으로 핸들바 등록, 핸들바 생성 및 엔진 반환



app.set("view engine", "handlebars"); // 2.웹페이지 로드시 사용할 템플릿 엔진 설정
app.set("views", __dirname + "/views"); // 3. 뷰 디렉터리를 views로 설정, __dirname은 node를 싱행하는 디렉터리 경로

// 4.라우터 설정
// 리스트 페이지
app.get("/", async(req,res) => {

  const page = parseInt(req.query.page) || 1; //현재 페이지 데이터, ||는 이 전값이 빈값이거나 null일 경우 뒤의 갚을 기본값으로 사용함.
  const search = req.query.search || ""; // 검색어 데이터
  try {
    const [posts, paginator] = await postService.list(collection, page, search);  //postService.list에서 글 목록과 페이지네이터 가져옴.
    res.render("home", { title: "테스트 게시판", search, paginator, posts}); // 리스트 페이지 렌더링
  } catch (error) {
    console.error(error);
    res.render("home", { title: "테스트 게시판"});
  }
});

//쓰기 페이지 이동
app.get("/write", (req,res) => { 
  res.render("write", {title: "테스트 게시판"});
});


// 글쓰기
app.post("/write", async (req, res) => {
  const post = req.body; 
  const result = await postService.writePost(collection, post); // 글쓰기 후 결과 반환
  res.redirect(`/detail/${result.insertedId}`); // 생성 된 도큐먼트의 _id를 사용해 상세페이지로 이동
});


// 상세페이지로 이동
app.get("/detail/:id", async(req,res) => {
  const result = await postService.getDetailPost(collection, req.params.id);
  res.render("detail", {
    title: "테스트 게시판", 
    post: result.value,
  });
});



let collection;
app.listen(3000, async () => { //express 서버를 3000번 포트에서 실행하고, 서버가 실행되면 async 비동기 함수를 실행
  console.log("Server started");
  const mongoClient = await mongodbConnection(); // mongodbConnection()의 결과는 mongoClient
  collection = mongoClient.db().collection("post"); // mongoClient.db()로 디비선택 collection()으로 컬렉션 선택 후 collection에 할당
  console.log("MongoDB connected");
});