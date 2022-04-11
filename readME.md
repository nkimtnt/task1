2022.04.11 homework1 oauth

1일차 //
가장 익숙한 프레임워크, DB를 사용하여 과제 마무리를 우선하기로 결정.
NodeJs, Express, MongoDB 당첨.

개념 //
Oauth 개념은 프로젝트를 하며 수도없이 봤는데 과제를 보다보니 뭔가 이상하다는 것을 느낌.
내가 client 를 구성하는 것이 아닌 resource server 를 대변한다고 보는 것이 맞다.



token //
그렇다면 refreshToken validate 을 어떻게 구현하면 되는가?
token api 를 통하여 accessToken, refreshToken 을 생성하면서 생성 시간, 만료 시간을 함께 DB 에 저장.
validate api 에서는 DB 에서 userId, userPassword 확인하여, 일치하는 유저가 존재한다면 
