// 로컬 스토리지 - 저장했던 중간 지점 위경도값 가져오기
var la = localStorage.getItem("La");
var ma = localStorage.getItem("Ma");

// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
	contentNode = document.createElement("div"), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
	markers = [], // 마커를 담을 배열입니다
	currCategory = ""; // 현재 선택된 카테고리를 가지고 있을 변수입니다

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
	mapOption = {
		center: new kakao.maps.LatLng(ma, la), // 지도의 중심좌표
		level: 4, // 지도의 확대 레벨
	};

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

//-------------------------------중간지점 마커 생성----------------------------------------
// 마커 이미지 정보를 가지고 있는 마커 이미지 생성 (중간 지점 마커 - 붉은색)
var imageSrc =
			'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites.png', // 마커 이미지 주소
		imageSize = new kakao.maps.Size(48, 85), // 마커 이미지 크기
		imageOption = {
			spriteSize : new kakao.maps.Size(50, 533), // 스프라이트 원본 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, 400), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
		};

var markerImage = new kakao.maps.MarkerImage(
	imageSrc,
	imageSize,
	imageOption
);

//마커의 위치 정보 생성
var markerPosition = new kakao.maps.LatLng(ma, la);

// 마커를 생성합니다
var centerMarker = new kakao.maps.Marker({
position: markerPosition,
image: markerImage, // 마커 이미지 새로 설정
});

// 마커가 지도 위에 표시되도록 설정합니다
centerMarker.setMap(map);

//----------------------------카테고리별 장소 마커 생성---------------------------------
// 이미지 주소 배열 선언
var ImgSrc = [
    'https://img.icons8.com/external-soft-fill-juicy-fish/344/external-restaurant-location-pins-soft-fill-soft-fill-juicy-fish.png', //음식점
    'https://img.icons8.com/external-soft-fill-juicy-fish/344/external-cafe-location-pins-soft-fill-soft-fill-juicy-fish.png', // 카페
    'https://img.icons8.com/external-soft-fill-juicy-fish/60/000000/external-caravan-location-pins-soft-fill-soft-fill-juicy-fish.png', // 지하철
    'https://img.icons8.com/external-soft-fill-juicy-fish/344/external-like-location-pins-soft-fill-soft-fill-juicy-fish.png', // 관광지
];

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(map);

// 지도에 idle 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", searchPlaces);

// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
contentNode.className = "placeinfo_wrap";

// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
addEventHandle(contentNode, "mousedown", kakao.maps.event.preventMap);
addEventHandle(contentNode, "touchstart", kakao.maps.event.preventMap);

// 커스텀 오버레이 컨텐츠를 설정합니다
placeOverlay.setContent(contentNode);

// 각 카테고리에 클릭 이벤트를 등록합니다
addCategoryClickEvent();

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
	if (target.addEventListener) {
		target.addEventListener(type, callback);
	} else {
		target.attachEvent("on" + type, callback);
	}
}

// 카테고리 검색을 요청하는 함수입니다
function searchPlaces() {
	if (!currCategory) {
		return;
	}

	// 커스텀 오버레이를 숨깁니다
	placeOverlay.setMap(null);

	// 지도에 표시되고 있는 마커를 제거합니다
	removeMarker();

	ps.categorySearch(currCategory, placesSearchCB, {
        location: new kakao.maps.LatLng(ma, la),//중심좌표 설정
        radius:1000,//중심좌표에서 1000m까지만 검색(map의 level을 조정하면 바뀜)
        size:10, //한 페이지에 보여질 개수. 기본값은 15, 1~15까지 가능
	});
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
	if (status === kakao.maps.services.Status.OK) {
		// 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
		displayPlaces(data);
	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		// 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
	} else if (status === kakao.maps.services.Status.ERROR) {
		// 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
	}
}

// 지도에 마커를 표출하는 함수입니다
function displayPlaces(places) {
	// 몇번째 카테고리가 선택되어 있는지 얻어옵니다
	// 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
	var order = document.getElementById(currCategory).getAttribute("data-order");

	for (var i = 0; i < places.length; i++) {
		// 마커를 생성하고 지도에 표시합니다
		var marker = addMarker(
			new kakao.maps.LatLng(places[i].y, places[i].x),
			order
		);

		// 마커와 검색결과 항목을 클릭 했을 때
		// 장소정보를 표출하도록 클릭 이벤트를 등록합니다
		(function (marker, place) {
			kakao.maps.event.addListener(marker, "click", function () {
				displayPlaceInfo(place);
			});
		})(marker, places[i]);
	}
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, order) {
	var imageSize = new kakao.maps.Size(50, 50),  // 마커 이미지의 크기
		markerImage = new kakao.maps.MarkerImage(ImgSrc[order], imageSize),
		marker = new kakao.maps.Marker({
				position: position, // 마커의 위치
				image: markerImage 
			});

	marker.setMap(map); // 지도 위에 마커를 표출합니다
	markers.push(marker); // 배열에 생성된 마커를 추가합니다

	return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo(place) {
	var content =
		'<div class="placeinfo">' +
		'   <a class="title" href="' +
		place.place_url +
		'" target="_blank" title="' +
		place.place_name +
		'">' +
		place.place_name +
		"</a>";

	if (place.road_address_name) {
		content +=
			'    <span title="' +
			place.road_address_name +
			'">' +
			place.road_address_name +
			"</span>" +
			'  <span class="jibun" title="' +
			place.address_name +
			'">(지번 : ' +
			place.address_name +
			")</span>";
	} else {
		content +=
			'    <span title="' +
			place.address_name +
			'">' +
			place.address_name +
			"</span>";
	}

	content +=
		'    <span class="tel">' +
		place.phone +
		"</span>" +
		"</div>" +
		'<div class="after"></div>';

	contentNode.innerHTML = content;
	placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
	placeOverlay.setMap(map);
}

// 각 카테고리에 클릭 이벤트를 등록합니다
function addCategoryClickEvent() {
	var category = document.getElementById("category"),
		children = category.children;

	for (var i = 0; i < children.length; i++) {
		children[i].onclick = onClickCategory;
	}
}

// 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickCategory() {
	var id = this.id,
		className = this.className;

	placeOverlay.setMap(null);

	if (className === "on") {
		currCategory = "";
		changeCategoryClass();
		removeMarker();
	} else {
		currCategory = id;
		changeCategoryClass(this);
		searchPlaces();
	}
}

// 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
function changeCategoryClass(el) {
	var category = document.getElementById("category"),
		children = category.children,
		i;

	for (i = 0; i < children.length; i++) {
		children[i].className = "";
	}

	if (el) {
		el.className = "on";
	}
}

// ------------------------다시하기 눌렀을 때 Home으로 돌아가는 함수 선언-------------------------
function gobackHome(){
	localStorage.clear(); // 다시 적용될 수 있도록 localstorage 값 모두 삭제
	location.replace('/');
}

//-----------------------------중심좌표 주소 출력-----------------------------------------
var geocoder = new kakao.maps.services.Geocoder();

searchDetailAddrFromCoords(new kakao.maps.LatLng(ma, la), function(result, status) {
	if (status === kakao.maps.services.Status.OK) {
		var detailAddr = !!result[0].road_address ? '<div><span class="doro_address">도로명주소</span> : ' + result[0].road_address.address_name + '</div>' : '';
		detailAddr += '<div><span class="jibun_address">지번 주소</span> : ' + result[0].address.address_name + '</div>';
		
		var content = '<div class="bAddr">' +
						'<div class="centerLatlng_title">중간 지점 법정동 주소정보</div>' + 
						'<div class="info">*중간 지점에 건물이 없는 경우 도로명주소가 없어서 지번주소만 표시됩니다.</div>' +
						detailAddr + '</div>';
		
		var resultDiv = document.getElementById('centerLatlng'); 
			resultDiv.innerHTML = content;
	}
});

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.La, coords.Ma, callback);
}