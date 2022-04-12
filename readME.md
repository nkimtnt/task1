2022.04.08~22 homework1 oauth

1일차 //
가장 익숙한 프레임워크, DB를 사용하여 과제 마무리를 우선하기로 결정.
NodeJs, Express, MongoDB 당첨.
user/create => 서버 만들고 db 연결하고 대충 완성
user/token => 하는 중에 db update 이슈

2일차 //
oauth/token => update 과정에서 upsert option 이 모델링 할 때 기존 필드가 없다면 추가가 안되는 사실을 발견.. 완성..
oauth/validate => params 를 안써봄.. 캬캬캬 고난 끝에 validate 완성
oauth/revoke => 리프레시 토큰을 받아서 유효하다면 엑세스, 리프레시 토큰 둘 다 재발급!

개념 //
Oauth 개념은 프로젝트를 하며 수도없이 봤는데 과제를 보다보니 뭔가 이상하다는 것을 느낌.
내가 client 를 구성하는 것이 아닌 resource server 를 대변한다고 보는 것이 맞다.

조금 더 확실하게 생각을 해보자면
Oauth 의 핵심은 대신 인증! 이라고 생각 한다. 대신 인증!을 하기 위해서는 redirection 이 필수인데
실제 서비스에는 redirection 을 통해 일련의 인증 code, token 이 오가기 때문이다.
하지만 이번 과제에서는 redirection 이라는 과정은 생략되고 기존 code grant type 에서 code 를 JWT 이 대체하고
token 을 uuid 라이브러리를 이용하여 직접 발급하는 방식이다. 

token //
그렇다면 refreshToken validate 을 어떻게 구현하면 되는가?
token api 를 통하여 accessToken, refreshToken 을 생성하면서 생성 시간, 만료 시간을 함께 DB 에 저장.
validate api 에서는 DB 에서 userId, userPassword 확인하여, 일치하는 유저가 존재한다면 expiry time 체크하는 방식

validate //
보통은 accessToken 을 확인하는 방식일텐데 희한?하게도 refreshToken 을 확인한다.
params 로 refreshToken 을 accessToken 이라고 명명하여 보낸다. (완료)
보내진 정보는 accessToken 뿐이네? 그렇다면 DB 에서 검색 한다음 해당하는 유저의 refreshTokenExpiryTime 가져오자.
그 다음 validate 해서 유효하다면~ 아니라면~
refreshToken 을 기존에 설정한 14day 가 지났다면 404에러, 그렇지 않다면 통과 시킨다.
물론 accessToken 자체가 넘어오지 않았다면 400에러
완료!

문제점 //
2022.04.11 => 자신있던 mongoDB 에서 findOneAndUpdate 에서 $set upsert 옵션을 줘서 기존 /user/create api 에서 등록하는
user 의 data 에 accessToken, refreshToken, expiryTime 을 추가하려고 했으나 왜인지 실패. doc 으로 save 를 해야하나.
2022.04.12 => expiryTime 을 통하여 어떻게 무효화 시킬 것인지 생각은 안해봄. 방법이 있겠지. 찾아보자. 와!! 힘들었다!!
일단 mongoDB에 date 가 입력되는 방식이 다양하다. date() 를 사용하여 입력시 Tue Apr 26 2022 17:19:58 GMT+0900 (Japan Standard Time)
으로 입력이 되고 moment 를 사용하여 입력하니 밀리세컨으로 변환되어 입력이 된다. 밀리세컨으로 입력이 되면 moment isBefore 로 참조는 되는데 에러가 발생.
형식이 iso 타입이 아니라고 경고를 하는데 불린 값으로 결과가 나오긴 했다. 하지만 이 에러를 도저히 볼 수 없어서 방법을 찾기 시작했다. 3시간이 흘렀다.
일단 moment 라이브러리는 js 에서 이제는 사양된 라이브러리라고 한다. dayjs 사용하여 isBefore 실행하니 제대로 먹혔다.
말은 이렇게 쉬운데 이 전까지의 과정이 너무 길었다.
mongoDB 에 입력되는 방법을 바꾸려고 찾아봤고, 밀리세컨기반 시간을 다시 문자로 바꾸려고 시도했고, 갖은 방법을 사용하여 date format 을 맞추려 노력했다.
아무튼 해결... 결과값 잘 비교해서 출력되고 valid 검사를 refreshToken 14일 기준으로 설정했다.

