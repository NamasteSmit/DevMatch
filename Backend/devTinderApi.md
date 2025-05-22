
## User auth api
- POST /signup ✅
- POST /login  ✅
- POST /logout ✅

## User profile api
- GET /profile/view   ✅
- PATCH /profile/edit ✅
- PATCH /profile/password/edit ✅

## Sender side
- POST /request/send/intrested/:userId  ✅
- POST /request/send/ignored/:userId    ✅

## Reciever side
- POST /request/review/accepted/:requestId ✅
- POST /request/review/rejected/:requestId ✅

Status : Ignored | Intrested ----> [Accepted | Rejected]

## See all Connection api
- GET /view/user/connections ✅
- GET /view/user/request/recieved ✅

## see feed
- GET /view/user/feed  ✅ ---> [This will get you profiles of other people 
                     at a time it will fetch 20-30 profiles from db and show them in feed ..... when this gets over
                    it again makes an api call and get another 20-30 feed cards...
                        ]
