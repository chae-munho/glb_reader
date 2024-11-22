//Three.js 라이브러리 임포트 
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Three.js의 OrbitControls 모듈을 임포트, 사용자가 마우스를 사용하여 카메라를 회전, 확대/축소, 이동할 수 있는 기능을 제공
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// GLTFLoader 임포트, 이 로더는 .gltf, .glb 형식의 3D 모델 파일을 Three.js 장면으로 가져오고 로드
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 3D 장면 생성. 3D 객체와 조명, 카메라를 포함
const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(  // 원근 카메라 설정
  75,  // 시야각 FOV을 75도로 설정 FOV는 카메라나 인간의 눈이 한번에 볼 수 있는 공간의 각도를 의미 즉 얼마나 넓은 영역을 보여줄지를 결정
  window.innerWidth / window.innerHeight,   // 카메라의 종횡비를 화면 크기에 맞춤
  0.1,   // 카메라가 렌더링할 수 있는 가장 가까운 거리를 설정
  1000  // 가장 먼 거리를 설정
);

// 카메라의 위치 설정. x : 0, y : 1, z : 5로 배치하여 약간 위쪽이나 뒤쪽으로 이동시킴
camera.position.set(0, 1, 5);  

// WebGL 렌더러를 생성. Three.js 가 브라우저의 WebGL API를 사용하여 3D 장면을 렌더링 할 수 있도록  alpha :true는 렌더러에 투명 배경을 활성화 false는 검은 배경 형성
const renderer = new THREE.WebGLRenderer({ alpha: false });
// 렌더러 크기를 브라우저 창 크기와 동일하게 설정
renderer.setSize(window.innerWidth, window.innerHeight);

//렌더러의 DOM 요소를 HTML 문서의 <body>에 추가하여 화면에 표시되도록 함.
document.body.appendChild(renderer.domElement);

// 주변광을 생성하고 장면에 추가. 0xffffff, 1 흰색의 강도를 1로 설정. 모든 객체를 고르게 밝게 만듬
const light = new THREE.AmbientLight(0xffffff, 1); 
scene.add(light);

//방향광 설정 : 5, 10, 7.5 위치에서 비춰지도록 설정. 해당 조명은 특정 방향에서 평행하게 빛을 비춤
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// OrbitControls를 설정하여 사용자가 마우스 드래그로 카메라를 회전하거나 확대/축소, 이동할 수 있도록 함
const controls = new OrbitControls(camera, renderer.domElement);

// GLTFLoader의 인스턴스 생성, glb 파일 업로드 준비
const loader = new GLTFLoader();
loader.load(
  './data/nii1.gz.glb',  // 지정된 경로의 파일 로드
  function (gltf) {
    // 파일이 성공적으로 로드되면 gltf.scene을 가져와 장면에 추가
    const model = gltf.scene;
    scene.add(model);

    // 모델의 위치와 크기 설정. 위치(0, 0, 0), 크기(1, 1, 1) 기본값 유지, 콘솔에 성공 출력
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    console.log('Model loaded successfully');
  },
  // 로딩 진행 상황을 콘솔에 출력
  function (xhr) {
  
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  // 로딩중 오류가 발생하면 콘솔에 오류 메시지를 출력
  function (error) {

    console.error('An error occurred:', error);
  }
);


// 브라우저 창 크기가 변경되면 카메라와 렌더러 크기를 새 창 크기에 맞게 업데이트
window.addEventListener('resize', () => {
  // 카메라의 종횡비 업데이트. 종횡비는 화면의 가로 길이와 세로 길이의 비율이며, 화면 크기 변화에 따라 이를 업데이트해야 왜곡 없이 장면을 렌더링할 수 있음
  camera.aspect = window.innerWidth / window.innerHeight;  // window.innerWidth :  현재 브라우저의 창의 너비. window.height : 현재 브라우저 창의 높이
  // 카메라의 투영행렬을 재계산. 시야, 종횡비, 근/원 클리핑 평면 값에 따라 렌더링 방식을 결정 즉 새로 설정된 종횡비로 장면이 정확이 렌더링
  camera.updateProjectionMatrix();

  //렌더러의 크기를 현재 창 크기에 맞게 조정 즉 브라우저 창이 크거나 작아질 때 렌더링 되는 장면이 화면 전체를 적절히 채움
  renderer.setSize(window.innerWidth, window.innerHeight); 
});
// 렌더러는 Three.js에서 3D 장면과 카메라를 조합하여 실제로 화면에 표시되는 2D 이미지를 생성하는 핵심 엔진. 쉽게 말해 3D 데이터를 시각적으로 표현

function animate() {

  // 애니메이션 루프를 생성. 매 프레임마다 animate 함수 호출
  requestAnimationFrame(animate);

  // OrbitControls를 업데이트하여 카메라의 움직임을 반영
  controls.update();

  //장면과 카메라를 사용하여 화면에 3D 장면을 렌더링
  renderer.render(scene, camera);
}

//애니메이션 루프 시작
animate();
