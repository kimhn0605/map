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
var user1 = document.getElementById("user1");
var user2 = document.getElementById("user2");
var user3 = document.getElementById("user3");
var user4 = document.getElementById("user4");
var user5 = document.getElementById("user5");
var user6 = document.getElementById("user6");

var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var text3 = document.getElementById("text3");
var text4 = document.getElementById("text4");
var text5 = document.getElementById("text5");
var text6 = document.getElementById("text6");

switch (people) {
	case "2":
		user1.style.display = "block";
		user2.style.display = "block";

		text1.style.display = "block";
		text2.style.display = "block";
		break;
	case "3":
		user1.style.display = "block";
		user2.style.display = "block";
		user3.style.display = "block";

		text1.style.display = "block";
		text2.style.display = "block";
		text3.style.display = "block";
		break;
	case "4":
		user1.style.display = "block";
		user2.style.display = "block";
		user3.style.display = "block";
		user4.style.display = "block";

		text1.style.display = "block";
		text2.style.display = "block";
		text3.style.display = "block";
		text4.style.display = "block";
		break;
	case "5":
		user1.style.display = "block";
		user2.style.display = "block";
		user3.style.display = "block";
		user4.style.display = "block";
		user5.style.display = "block";

		text1.style.display = "block";
		text2.style.display = "block";
		text3.style.display = "block";
		text4.style.display = "block";
		text5.style.display = "block";
		break;
	case "6":
		user1.style.display = "block";
		user2.style.display = "block";
		user3.style.display = "block";
		user4.style.display = "block";
		user5.style.display = "block";
		user6.style.display = "block";

		text1.style.display = "block";
		text2.style.display = "block";
		text3.style.display = "block";
		text4.style.display = "block";
		text5.style.display = "block";
		text6.style.display = "block";
		break;
}

//---------------------------키워드 검색 요청 함수 선언-------------------------------
function searchPlaces() {
	// 검색창에 입력된 글자 가져오기
	var keyword = document.getElementById("keyword").value;
	console.log(keyword);
	// .replace(/^\s+|\s+$/g,'') -> 앞뒤 공백 제거
	if (!keyword.replace(/^\s+|\s+$/g, "")) {
		alert("장소를 검색해주세요!");
		return false;
	}

	// 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
	ps.keywordSearch(keyword, placesSearchCB, {
        size:10, //한 페이지에 보여질 개수. 기본값은 15, 1~15까지 가능
	});
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
					if (confirm(title + "(으)로 선택하시겠습니까?") == true) {
						if(Object.keys(latlng).includes(title)){ //이미 선택된 장소가 또 눌렸을 때
							alert("이미 선택된 장소입니다.")
						}
						else{
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
					if (confirm(title + "(으)로 선택하시겠습니까?") == true) {
						if(Object.keys(latlng).includes(title)){ //이미 선택된 장소가 또 눌렸을 때
							alert("이미 선택된 장소입니다.")
						}
						else{
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
			"   <h4>" +
			places.place_name +
			"</h4>";

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



//-----------------------중점에 마커 찍기-----------------------
function centerMarker() {
	if(click < people){
		alert("모든 장소를 입력해주세요.");
	}
	else if (click >= people) {
		// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
		removeMarker();

		// 마커가 표시될 위치입니다
		var markerPosition = new kakao.maps.LatLng(
			centerLaMa["Ma"],
			centerLaMa["La"]
		);

		// 마커 이미지 정보를 가지고 있는 마커 이미지 생성 (중간 지점 마커 - 붉은색)
		var imageSrc =
				"http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites.png", // 마커 이미지 주소
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

		// 마커를 생성합니다
		var centerMarker = new kakao.maps.Marker({
			position: markerPosition,
			image: markerImage, // 마커 이미지 새로 설정
		});

		// 마커가 지도 위에 표시되도록 설정합니다
		centerMarker.setMap(map);

		// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
		map.setCenter(markerPosition);

		//-----------------------------중심좌표 주소 출력-----------------------------------------
		var geocoder = new kakao.maps.services.Geocoder();

		searchDetailAddrFromCoords(markerPosition, function(result, status) {
			if (status === kakao.maps.services.Status.OK) {
				var detailAddr = !!result[0].road_address ? '<div><span class="doro_address">도로명주소</span> : ' + result[0].road_address.address_name + '</div>' : '';
				detailAddr += '<div><span class="jibun_address">지번 주소</span> : ' + result[0].address.address_name + '</div>';

				var content = detailAddr;

				var resultDiv = document.getElementById('centerLatlng'); 
					resultDiv.innerHTML = content;
			}
		});

		function searchDetailAddrFromCoords(coords, callback) {
		    // 좌표로 법정동 상세 주소 정보를 요청합니다
			geocoder.coord2Address(coords.La, coords.Ma, callback);
		}

	}
	
}

//----------------------------주변찾기 버튼 모든 장소 입력됐을 때만 활성화--------------------------------
function categoryBtn(){
	var target = document.getElementById('categoryBtn');
	if (click >= people) {
		location.replace('http://127.0.0.1:8000/center/');
	}
	else{
		alert("모든 장소를 입력해주세요.");
	}
}

// -----------------------인원재설정 버튼 함수 선언-------------------------
function resetPeople(){
	localStorage.clear(); // 다시 적용될 수 있도록 localstorage 값 모두 삭제
	location.replace('/');
}