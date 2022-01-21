var container = document.getElementById('map');
		var options = {
			center: new kakao.maps.LatLng(37.49508227061587, 127.12241420996934), // 표시될 지도의 중심 좌표
			level: 3 //지도 zoom 정도 설정, 숫자가 작을 수록 좁은 영역이 크게 나옴
		};

		var map = new kakao.maps.Map(container, options);  //지도 생성 및 객체 리턴

// 지도를 클릭한 위치에 표출할 마커입니다
var marker = new kakao.maps.Marker({
    // 지도 중심좌표에 마커를 생성합니다 
    position: map.getCenter() 
}); 

// 지도에 마커를 표시합니다
marker.setMap(map);

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
    // 클릭한 위도, 경도 정보를 가져옵니다 
    var latlng = mouseEvent.latLng; 
    
    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(latlng);
    
    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    
    var resultDiv = document.getElementById('clickLatlng'); 
    resultDiv.innerHTML = message;
    
});

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤러 생성
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);//kakao.maps.ControlPosition: 위치 지정 