// -----------------------------------전역변수 선언--------------------------------------
var clickImage = new daum.maps.MarkerImage(
	"http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
	new daum.maps.Size(26, 37),
	new daum.maps.Point(13, 37)
);

// 마커를 담을 배열
var markers = [];

// 선택된 마커를 담을 배열
var selected_markers = [];

// 마커의 위/경도를 담을 객체
var latlng = {};

// 중간지점 변수
var centerLaMa;

// 선택된 장소 개수
var click = 0;

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
	mapOption = {
		center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
		level: 3, //지도 zoom 정도 설정, 숫자가 작을 수록 좁은 영역이 크게 나옴
	};

var map = new kakao.maps.Map(mapContainer, mapOption); //지도 생성 및 객체 리턴

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드로 장소를 검색합니다
searchPlaces();

// // ---------------------------키워드 검색 요청 함수 선언-------------------------------
function searchPlaces() {
	// 검색창에 입력된 글자 가져오기
	var keyword = document.getElementById("keyword").value;
	console.log(keyword);
	// .replace(/^\s+|\s+$/g,'') -> 앞뒤 공백 제거
	if (!keyword.replace(/^\s+|\s+$/g, "")) {
		alert("키워드를 입력해주세요!");
		return false;
	}

	// 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
	ps.keywordSearch(keyword, placesSearchCB);
}

// -----------------------장소검색이 완료됐을 때 호출되는 콜백함수 선언--------------------------
function placesSearchCB(data, status, pagination) {
	if (status === kakao.maps.services.Status.OK) {
		// 정상적으로 검색이 완료됐으면
		// 검색 목록과 마커를 표출합니다
		displayPlaces(data);

		// 페이지 번호를 표출합니다
		displayPagination(pagination);
	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		alert("검색 결과가 존재하지 않습니다.");
		return;
	} else if (status === kakao.maps.services.Status.ERROR) {
		alert("검색 결과 중 오류가 발생했습니다.");
		return;
	}
}

// -----------------------------검색 결과 목록 및 마커 표출 함수 선언---------------------------
function displayPlaces(places) {
	var listEl = document.getElementById("placesList"),
		menuEl = document.getElementById("menu_wrap"),
		fragment = document.createDocumentFragment(),
		bounds = new kakao.maps.LatLngBounds(),
		listStr = "";

	// 검색 결과 목록에 추가된 항목들을 제거합니다
	removeAllChildNods(listEl);

	// 지도에 표시되고 있는 마커를 제거합니다
	removeMarker();

	for (var i = 0; i < places.length; i++) {
		// 마커를 생성하고 지도에 표시합니다
		var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
			marker = addMarker(placePosition, i),
			itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

		// 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
		// LatLngBounds 객체에 좌표를 추가합니다
		bounds.extend(placePosition);

		// 마커와 검색결과 항목에 mouseover 했을때
		// 해당 장소에 인포윈도우에 장소명을 표시합니다
		// mouseout 했을 때는 인포윈도우를 닫습니다
		(function (marker, title) {
			kakao.maps.event.addListener(marker, "mouseover", function () {
				displayInfowindow(marker, title);
			});

			kakao.maps.event.addListener(marker, "mouseout", function () {
				infowindow.close();
			});

			itemEl.onmouseover = function () {
				displayInfowindow(marker, title);
			};

			itemEl.onmouseout = function () {
				infowindow.close();
			};
		})(marker, places[i].place_name);

		// ---------------------------------------- 기존 코드에서 수정한 곳
		(function (marker, title) {
			user1Element = document.getElementById("user1");
			user2Element = document.getElementById("user2");
			user3Element = document.getElementById("user3");
			user4Element = document.getElementById("user4");
			user5Element = document.getElementById("user5");
			user6Element = document.getElementById("user6");

			// 마커 클릭했을 때
			kakao.maps.event.addListener(marker, "click", function () {
				if (click >= people) {
					alert("이미 모든 장소를 선택했습니다.");
				} else if (click < people) {
					if (confirm("이 장소로 선택하시겠습니까?") == true) {
						click += 1;
						var index = markers.indexOf(marker); // 선택된 마커 기존 배열에서 삭제
						if (index > -1) { // 선택된 마커 기존 배열에서 삭제
							markers.splice(index, 1);
						}
						selected_markers.push(marker); // 선택된 마커를 새로운 배열에 추가
						latlng[title] = marker.getPosition();
						marker.setImage(clickImage);

						// 클릭한 마커 위치 각 유저별 화면에 출력
						if (user1Element.innerText === "") {
							user1Element.innerHTML = Object.keys(latlng)[0];
						} else if (user2Element.innerText === "") {
							user2Element.innerHTML = Object.keys(latlng)[1];
						} else if (user3Element.innerText === "") {
							user3Element.innerHTML = Object.keys(latlng)[2];
						} else if (user4Element.innerText === "") {
							user4Element.innerHTML = Object.keys(latlng)[3];
						} else if (user5Element.innerText === "") {
							user5Element.innerHTML = Object.keys(latlng)[4];
						} else if (user6Element.innerText === "") {
							user6Element.innerHTML = Object.keys(latlng)[5];
						}
					}
				}
				console.log("총 개수", Object.keys(latlng).length);
				var sumLa = 0,
					sumMa = 0;
				for (var key in latlng) {
					sumLa += latlng[key]["La"];
					sumMa += latlng[key]["Ma"];
				}
				centerLaMa = {
					La: sumLa / Object.keys(latlng).length,
					Ma: sumMa / Object.keys(latlng).length,
				};
				console.log("중간지점(평균)", centerLaMa);
				localStorage.setItem("La", centerLaMa.La);
				localStorage.setItem("Ma", centerLaMa.Ma);
			});

			// 목록 선택했을 때
			itemEl.onclick = function () {
				if (click >= people) {
					alert("이미 모든 장소를 선택했습니다.");
				} else if (click < people) {
					if (confirm("이 장소로 선택하시겠습니까?") == true) {
						click += 1;
						var index = markers.indexOf(marker); // 선택된 마커 기존 배열에서 삭제
						if (index > -1) { // 선택된 마커 기존 배열에서 삭제
							markers.splice(index, 1);
						}
						selected_markers.push(marker); // 선택된 마커를 새로운 배열에 추가
						latlng[title] = marker.getPosition();
						marker.setImage(clickImage);

						// 클릭한 마커 위치 각 유저별 화면에 출력
						if (user1Element.innerText === "") {
							user1Element.innerHTML = Object.keys(latlng)[0];
						} else if (user2Element.innerText === "") {
							user2Element.innerHTML = Object.keys(latlng)[1];
						} else if (user3Element.innerText === "") {
							user3Element.innerHTML = Object.keys(latlng)[2];
						} else if (user4Element.innerText === "") {
							user4Element.innerHTML = Object.keys(latlng)[3];
						} else if (user5Element.innerText === "") {
							user5Element.innerHTML = Object.keys(latlng)[4];
						} else if (user6Element.innerText === "") {
							user6Element.innerHTML = Object.keys(latlng)[5];
						}
					}
				}
				console.log("총 개수", Object.keys(latlng).length);
				var sumLa = 0,
					sumMa = 0;
				for (var key in latlng) {
					sumLa += latlng[key]["La"];
					sumMa += latlng[key]["Ma"];
				}
				centerLaMa = {
					La: sumLa / Object.keys(latlng).length,
					Ma: sumMa / Object.keys(latlng).length,
				};
				console.log("중간지점(평균)", centerLaMa);
			};
		})(marker, places[i].place_name);
		// ---------------------------------------------------------

		fragment.appendChild(itemEl);
	}

	// 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
	listEl.appendChild(fragment);
	menuEl.scrollTop = 0;

	// 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
	map.setBounds(bounds);
}

// -----------------------검색결과 항목을 Element로 반환하는 함수 선언--------------------
function getListItem(index, places) {
	var el = document.createElement("li"),
		itemStr =
			'<span class="markerbg marker_' +
			(index + 1) +
			'"></span>' +
			'<div class="info">' +
			"   <h5>" +
			places.place_name +
			"</h5>";

	if (places.road_address_name) {
		itemStr +=
			"    <span>" +
			places.road_address_name +
			"</span>" +
			'   <span class="jibun gray">' +
			places.address_name +
			"</span>";
	} else {
		itemStr += "    <span>" + places.address_name + "</span>";
	}

	itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

	el.innerHTML = itemStr;
	el.className = "item";

	return el;
}

// ------------------------마커를 생성 및 지도 위에 표시하는 함수 선언-------------------
function addMarker(position, idx) {
	var imageSrc =
			"https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
		imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
		imgOptions = {
			spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
			spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
			offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
		},
		markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
		marker = new kakao.maps.Marker({
			position: position, // 마커의 위치
			image: markerImage,
		});

	marker.setMap(map); // 지도 위에 마커를 표출합니다
	markers.push(marker); // 배열에 생성된 마커를 추가합니다
	

	return marker;
}

// ------------------------지도 위에 표시된 마커 모두 제거---------------------------
function removeMarker() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// -----------------------검색결과 목록 하단 페이지번호 표시 함수-----------------------
function displayPagination(pagination) {
	var paginationEl = document.getElementById("pagination"),
		fragment = document.createDocumentFragment(),
		i;

	// 기존에 추가된 페이지번호를 삭제합니다
	while (paginationEl.hasChildNodes()) {
		paginationEl.removeChild(paginationEl.lastChild);
	}

	for (i = 1; i <= pagination.last; i++) {
		var el = document.createElement("a");
		el.href = "#";
		el.innerHTML = i;

		if (i === pagination.current) {
			el.className = "on";
		} else {
			el.onclick = (function (i) {
				return function () {
					pagination.gotoPage(i);
				};
			})(i);
		}

		fragment.appendChild(el);
	}
	paginationEl.appendChild(fragment);
}

// -----------------------검색결과 목록 또는 마커 위에 포인터가 있을 때 호출되는 함수-----------------------
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
	var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

	infowindow.setContent(content);
	infowindow.open(map, marker);
}

// -----------------------검색결과 목록의 자식 Element를 제거하는 함수-----------------------
function removeAllChildNods(el) {
	while (el.hasChildNodes()) {
		el.removeChild(el.lastChild);
	}
}

// 지도 확대 축소를 제어할 수 있는 줌 컨트롤러 생성
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT); //kakao.maps.ControlPosition: 위치 지정

// -----------------------최종 인원수 저장 함수---------------------------
function finalCount() {
	// 클릭 버튼 누르면 최종 인원수 저장

	// .value 는 div 에 적용 x (input 태그에 적용 o)
	// HTML 태그 값 가져오려면 .innerHTML 로 가져오는 게 편함
	var people = document.getElementById("result").innerHTML;

	// 로컬 스토리지에 최종 인원수 저장 (키-값)
	localStorage.setItem("people", people);
}

// 최종 인원수 가져오기 (home -> map)
people = localStorage.getItem("people");
document.getElementById("display").innerHTML = people;

// 브라우저에 결과를 출력할 곳의 element 가져오기
const displayElement = document.getElementById("display");
console.log(displayElement.innerHTML);

// ---------------------------------------
// 인원수만큼 장소 선택창 띄우기
var user3 = document.getElementById("user3");
var user4 = document.getElementById("user4");
var user5 = document.getElementById("user5");
var user6 = document.getElementById("user6");

var text3 = document.getElementById("text3");
var text4 = document.getElementById("text4");
var text5 = document.getElementById("text5");
var text6 = document.getElementById("text6");

switch (people) {
	case "2":
		user3.style.display = "none";
		user4.style.display = "none";
		user5.style.display = "none";
		user6.style.display = "none";

		text3.style.display = "none";
		text4.style.display = "none";
		text5.style.display = "none";
		text6.style.display = "none";
		break;
	case "3":
		user4.style.display = "none";
		user5.style.display = "none";
		user6.style.display = "none";

		text4.style.display = "none";
		text5.style.display = "none";
		text6.style.display = "none";
		break;
	case "4":
		user5.style.display = "none";
		user6.style.display = "none";

		text5.style.display = "none";
		text6.style.display = "none";
		break;
	case "5":
		user6.style.display = "none";
		text6.style.display = "none";
		break;
}

//-----------------------중점에 마커 찍기-----------------------
function centerMarker() {
	// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
	removeMarker();

	// 마커가 표시될 위치입니다
	var markerPosition = new kakao.maps.LatLng(
		centerLaMa["Ma"],
		centerLaMa["La"]
	);

	// 마커 이미지 정보를 가지고 있는 마커 이미지 생성 (중간 지점 마커 - 붉은색)
	var imageSrc =
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS494-ZX-JNy3fRkdGYo8RZyn7SPSKG5qdywA&usqp=CAU", // 마커 이미지 주소
		imageSize = new kakao.maps.Size(30, 45), // 마커 이미지 크기
		imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커 이미지 옵션 (마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정)

	var markerImage = new kakao.maps.MarkerImage(
		imageSrc,
		imageSize,
		imageOption
	);

	// 마커를 생성합니다
	var centerMarker = new kakao.maps.Marker({
		position: markerPosition,
		image: markerImage, // 마커 이미지 새로 설정
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	centerMarker.setMap(map);

	// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
	map.setCenter(markerPosition);
}

//--------------------------중점 주변 장소 띄우기--------------------------
/*
function categoryplace(){


	// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
	var placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}), 
		contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 
		markers2 = [], // 마커를 담을 배열입니다
		currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

	// 장소 검색 객체를 생성합니다
	var places = new kakao.maps.services.Places(map); 

	// 지도에 idle 이벤트를 등록합니다
	kakao.maps.event.addListener(map, 'idle', searchPlaces);

	// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다 
	contentNode.className = 'placeinfo_wrap';

	// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
	// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다 
	addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
	addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

	// 커스텀 오버레이 컨텐츠를 설정합니다
	placeOverlay.setContent(contentNode);  

	// 각 카테고리에 클릭 이벤트를 등록합니다
	addCategoryClickEvent();

	// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
	function addEventHandle(target, type, callback) {
		if (target.addEventListener) {
			target.addEventListener(type, callback);
		} else {
			target.attachEvent('on' + type, callback);
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
		removeMarker2();
		
		places.categorySearch(currCategory, placesSearchCB, 
			{
				location: new kakao.maps.LatLng(centerLaMa['Ma'], centerLaMa['La']),//중심좌표 설정
				radius:1000,//중심좌표에서 1000m까지만 검색(map의 level을 조정하면 바뀜)
				size:10, //한 페이지에 보여질 개수. 기본값은 15, 1~15까지 가능
			}
		); 
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
		var order = document.getElementById(currCategory).getAttribute('data-order');

		

		for ( var i=0; i<places.length; i++ ) {

				// 마커를 생성하고 지도에 표시합니다
				var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

				// 마커와 검색결과 항목을 클릭 했을 때
				// 장소정보를 표출하도록 클릭 이벤트를 등록합니다
				(function(marker, place) {
					kakao.maps.event.addListener(marker, 'click', function() {
						displayPlaceInfo(place);
					});
				})(marker, places[i]);
		}
	}

	// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
	function addMarker(position, order) {
		var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
		imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
		imgOptions =  {
			spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
			spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
			offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
		},
		markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
			marker = new kakao.maps.Marker({
			position: position, // 마커의 위치
			image: markerImage 
		});

		marker.setMap(map); // 지도 위에 마커를 표출합니다
		markers2.push(marker);  // 배열에 생성된 마커를 추가합니다

		return marker;
	}

	// 지도 위에 표시되고 있는 마커를 모두 제거합니다
	function removeMarker2() {
		for ( var i = 0; i < markers2.length; i++ ) {
			markers2[i].setMap(null);
		}   
		markers2 = [];
	}

	// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
	function displayPlaceInfo (place) {
		var content = '<div class="placeinfo">' +
						'   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';   

		if (place.road_address_name) {
			content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
						'  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
		}  else {
			content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
		}                
	
		content += '    <span class="tel">' + place.phone + '</span>' + 
					'</div>' + 
					'<div class="after"></div>';

		contentNode.innerHTML = content;
		placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
		placeOverlay.setMap(map);  
	}


	// 각 카테고리에 클릭 이벤트를 등록합니다
	function addCategoryClickEvent() {
		var category = document.getElementById('category'),
			children = category.children;

		for (var i=0; i<children.length; i++) {
			children[i].onclick = onClickCategory;
		}
	}

	// 카테고리를 클릭했을 때 호출되는 함수입니다
	function onClickCategory() {
		var id = this.id, //ex) CE7: 카페
			className = this.className;

		placeOverlay.setMap(null);

		if (className === 'on') {
			currCategory = '';
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
		var category = document.getElementById('category'),
			children = category.children,
			i;

		for ( i=0; i<children.length; i++ ) {
			children[i].className = '';
		}

		if (el) {
			el.className = 'on';
		} 
	} 
}*/

//---------------------export---------------------------
//export const centerLaMa;
//export default { centerLaMa };
/*
export function getCenterLa() {
	return centerLaMa['La'];
}

export function getCenterMa() {
	return centerLaMa['Ma'];
}*/
