//----------------------------직접 마커 찍기-------------------------------

function Personalmarker(){
    // 지도를 클릭한 위치에 표출할 마커입니다
    var marker = new kakao.maps.Marker({ 
        // 지도 중심좌표에 마커를 생성합니다 
        position: map.getCenter() 
    }); 
    // 지도에 마커를 표시합니다
    marker.setMap(map);
    // 지도에 클릭 이벤트를 등록합니
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {       
        // 클릭한 위도, 경도 정보를 가져옵니다 
        var latlngPo = mouseEvent.latLng; 
    
        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlngPo);
        
        var message = '클릭한 위치의 위도는 ' + latlngPo.getLat() + ' 이고, ';
        message += '경도는 ' + latlngPo.getLng() + ' 입니다';
        
        var resultDiv = document.getElementById('clickLatlng'); 
        resultDiv.innerHTML = message;
        
    });

    var clickImage = new daum.maps.MarkerImage(
        'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
        new daum.maps.Size(26, 37), new daum.maps.Point(13, 37));
    
    kakao.maps.event.addListener(marker, "click", function () {
        if (confirm("이 장소로 선택하시겠습니까?") == true) {
            console.log(latlngPo.LatLng());
            latlng = marker.n;
            marker.setImage(clickImage);
        }
        console.log("총 개수", Object.keys(latlng).length);
        console.log("latlng", latlng);

        var sumLa = 0, sumMa = 0;
        for(var key in latlng){
            sumLa += latlng[key]['La'];
            sumMa += latlng[key]['Ma'];
        }
        var center = {'La': sumLa/Object.keys(latlng).length, 'Ma': sumMa/Object.keys(latlng).length};
        console.log("중간지점(평균)", center);
    });
}



/*
//좌표계 변환 --> 어디다가 넣어야 할까
var geocoder = new kakao.maps.services.Geocoder(), // 좌표계 변환 객체를 생성합니다
    wtmX = latlngPo.La, // 변환할 WTM X 좌표 입니다
    wtmY = latlngPo.Ma; // 변환할 WTM Y 좌표 입니다

// WTM 좌표를 WGS84 좌표계의 좌표로 변환합니다
geocoder.transCoord(wtmX, wtmY, transCoordCB, {
    input_coord: kakao.maps.services.Coords.WTM, // 변환을 위해 입력한 좌표계 입니다
    output_coord: kakao.maps.services.Coords.WGS84 // 변환 결과로 받을 좌표계 입니다 
});

// 좌표 변환 결과를 받아서 처리할 콜백함수 입니다.
function transCoordCB(result, status) {

    // 정상적으로 검색이 완료됐으면 
    if (status === kakao.maps.services.Status.OK) {

        // 마커를 변환된 위치에 표시합니다
        marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(result[0].y, result[0].x), // 마커를 표시할 위치입니다
            map: map // 마커를 표시할 지도객체입니다
        })
    }
}
*/
