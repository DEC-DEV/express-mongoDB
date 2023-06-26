const { MongoClient} = require("mongodb"); // 1. 몽고디비 연결 주소
const uri = "mongodb+srv://donghanpark:<password>>@cluster0.pjj2y3s.mongodb.net/?retryWrites=true&w=majority";

module.exports = function (callback) { // 2. 몽고디비 커넥션 연결 함수 반환
  return MongoClient.connect(uri, callback);
}