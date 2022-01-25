function count(type) {
	// 브라우저에 결과를 출력할 element 가져오기
	const resultElement = document.getElementById("result");

	// 현재 화면에 출력되어 있는 값 가져오기
	let number = resultElement.innerText;

	// 화면에 출력된 값은 문자열이므로 parseInt() 를 통해 숫자로 변환 후 연산 진행
	if (type === "plus") {
		if (number > 5) {
			alert("6명이 최대입니다");
		} else {
			number = parseInt(number) + 1;
		}
	} else if (type === "minus") {
		if (number < 3) {
			alert("2명 이상 선택해주세요");
		} else {
			number = parseInt(number) - 1;
		}
	}

	// 계산한 숫자를 브라우저에 출력
	resultElement.innerText = number;
}
