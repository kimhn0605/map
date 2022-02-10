function kakaoLink(){
    Kakao.init('08d5ff71604f8441fcec2abeec6e8058'); // 초기화
    Kakao.Link.createDefaultButton({
        container: '#create-kakao-link-btn',
        objectType: 'feed',
        content: {
            title: '중간지점찾기',
            description: '우리 중간에서 만나!\n #음식점 #카페 #지하철역 #관광지',
            imageUrl:
                'https://cdn.pixabay.com/photo/2019/07/19/09/54/map-4348394_960_720.png',
            link: {
                mobileWebUrl: 'http://127.0.0.1:8000/center/',
                webUrl: 'http://127.0.0.1:8000/center/',
            },
        },
        buttons: [
            {
                title: '자세히 보기',
                link: {
                mobileWebUrl: 'http://127.0.0.1:8000/center/',
                webUrl: 'http://127.0.0.1:8000/center/',
                },
            },
        ],
    })
}