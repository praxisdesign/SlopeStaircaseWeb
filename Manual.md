# SlopeStaircaseWeb 매뉴얼

## 개요

SlopeStaircaseWeb은 콘크리트 3D 프린팅으로 제작되는 경사 계단을 설계하기 위한 웹 기반 3D configurator입니다. 사용자는 계단 치수를 조정하고, 3D 미리보기를 확인하며, toe style과 기본 export 요청 정보를 설정할 수 있습니다.

## 로컬 실행

```powershell
npm install
npm run dev
```

Vite가 출력하는 로컬 주소를 브라우저에서 엽니다. 일반적으로 다음 주소를 사용합니다.

```text
http://127.0.0.1:5173/
```

해당 포트가 이미 사용 중이면 Vite가 자동으로 다른 포트를 사용합니다.

## 주요 인터페이스

### 3D 뷰포트

- 마우스 좌클릭 드래그: 카메라 회전
- 마우스 우클릭 드래그: 카메라 pan 이동
- 마우스 휠: 확대/축소
- 좌측하단 기즈모: 현재 Z-up 좌표계를 표시

### Design 탭

- Stair Width: 계단 폭 조정
- Run Length: 계단 전체 진행 길이 조정
- Rise Height: 계단 전체 높이 조정
- Step Height: 각 단 높이 조정
- Platform Preview: 중간 플랫폼 개수 미리보기
- Toe style: 계단 시작부 연장 형상 선택

### Toe Style 옵션

- No toe extension: 시작부 연장 없음
- Vertical extension: 시작부에 아래 방향 수직 연장부 추가
- Horizontal extension: 시작부에 하단 slope와 정렬된 수평 연장부 추가

### Export 탭

Export 탭에는 현재 다음 placeholder 항목이 있습니다.

- Your name
- Company
- Email
- PDF placeholder
- Quote placeholder

현재 이 항목들은 입력 또는 버튼 형태만 제공하며, 실제 PDF 생성이나 견적 요청 전송 기능은 아직 연결되어 있지 않습니다.

## 3D 프린팅 계단 형상 기준

계단 모델은 콘크리트 3D 프린팅 형상을 표현하도록 구성되어 있습니다.

- Bead 두께: 60 mm
- Bead 라인 간격: 20 mm
- 인쇄된 부재의 모서리 라운드 처리
- Z-up 좌표계 사용
- 하단 slope와 step 부재가 계단 프로파일에 맞게 정렬
- 상부 디딤판, 라이저 면, 측면에 적층 패턴 표현

## 검증 메시지

현재 치수 조합이 실사용에 부적절할 수 있는 경우 경고 메시지가 표시됩니다.

- 디딤판 깊이가 너무 짧은 경우
- 계단 단 수가 너무 많은 경우
- 높은 계단인데 플랫폼이 없는 경우

## GitHub Pages 빌드

GitHub Pages용으로 배포할 때는 상대 경로로 빌드해야 합니다.

```powershell
npm run build -- --base ./
```

생성된 `dist` 폴더의 내용을 `gh-pages` 브랜치에 배포합니다.

## 홈페이지 삽입

배포 후 다른 홈페이지에 configurator를 삽입하려면 iframe을 사용할 수 있습니다.

```html
<iframe
  src="https://praxisdesign.github.io/SlopeStaircaseWeb/"
  style="width: 100%; height: 800px; border: 0;"
  title="SlopeStaircaseWeb Configurator"
></iframe>
```

## 현재 제한 사항

- PDF export는 placeholder 상태입니다.
- Quote request는 placeholder 상태입니다.
- 고객 정보 입력값은 저장되거나 전송되지 않습니다.
- Toe style은 현재 계단 시작부 연장 형상에만 반영됩니다.
