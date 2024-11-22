// Node.js 환경에서 Express 프레임워크를 사용하여 Http 서버 코드

//http 모듈 불러오기  http 서버와 클라이언트 기능을 제공
const http = require('http');
//fs 모듈 불러오기 파이 시스템과 상호작용하는 기능 제공
const fs = require('fs');

// express 모듈 불러오기. Express는 Http 서버를 쉽게 만들고 라우팅, 미들웨어 등을 처리하는 프레임워크
const express = require('express');
// path 모듈 불러오기 파일 및 디렉터리 경로를 다루는 기능 제공
const path = require('path');

// express 를 호출하여 app 객체 생성. 해당 객체는 express 애플리케이션을 구성
const app = express();
const PORT = 3000;

// 정적 파일 제공 express.static 미들웨어를 사용하여 __dirname(현재 파일이 위치한 디렉터리) 경로의 모든 파일을 정적 파일로 제공(ex : html, css, js)
app.use(express.static(path.join(__dirname)));

// 기본 라우트 클라이언트에서 / 경로를 요청할때 index.html 파일을 응답으로 보내도록 설정 sendFile을 사용하여 파일 경로를 지정해 html 파일전달
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 지정된 서버에서 서버를 시작
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
