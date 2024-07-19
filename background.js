const API_KEY = "AIzaSyApTL-pVlc8Uw5hWhFhwH2m7awNh8neaos"
let user_signed_in = false;

let recipient = document.querySelector("#recipient");
let subject = document.querySelector("#subject");
let body_message = document.querySelector("#message");



chrome.identity.onSignInChanged.addListener(function (account_id, signedIn) {
    if (signedIn) {
        user_signed_in = true;
    } else {
        user_signed_in = false;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_auth_token') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log(token);
        });
    } else if (request.message === 'get_profile') {
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (user_info) {
            console.log(user_info);
        });
    // } else if (request.message === 'get_contacts') {
    //     chrome.identity.getAuthToken({ interactive: true }, function (token) {
    //         let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`;
    //         let fetch_options = {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         }

    //         fetch(fetch_url, fetch_options)
    //             .then(res => res.json())
    //             .then(res => {
    //                 if (res.memberCount) {
    //                     const members = res.memberResourceNames;
    //                     fetch_url = `https://people.googleapis.com/v1/people:batchGet?personFields=names&key=${API_KEY}`;

    //                     members.forEach(member => {
    //                         fetch_url += `&resourceNames=${encodeURIComponent(member)}`;
    //                     });

    //                     fetch(fetch_url, fetch_options)
    //                         .then(res => res.json())
    //                         .then(res => console.log(res));
    //                 }
    //             });
    //     });
    // } else if (request.message === 'create_contact') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://people.googleapis.com/v1/people:createContact?key=${API_KEY}`;

            let fetch_options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'names': [
                        {
                            "givenName": "Johnny",
                            "familyName": "Silver"
                        }
                    ]
                })
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => console.log(res));
        });
    } else if (request.message === 'delete_contact') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`;
            let fetch_options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => {
                    if (res.memberCount) {
                        const members = res.memberResourceNames;

                        fetch_options.method = 'DELETE';
                        fetch_url = `https://people.googleapis.com/v1/${members[0]}:deleteContact?key=${API_KEY}`;

                        fetch(fetch_url, fetch_options)
                            .then(res => console.log(res));
                    }
                });
        });
    }else if (request.message === 'send_email') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/send?key=${API_KEY}`;

            let email = [
                'Content-Type: text/plain; charset="UTF-8"\n',
                'MIME-Version: 1.0\n',
                'Content-Transfer-Encoding: 7bit\n',
                'to: srinidhi.ayala@gmail.com\n',
                'subject: Testing123\n\n',
                'HI THIS IS A TEST'
            ].join('');

            let base64EncodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

            let fetch_options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'raw': base64EncodedEmail
                })
            };

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => console.log(res));
        });
    }
    else if (request.message === 'draft_email') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                sendResponse({ error: chrome.runtime.lastError });
                return;
            }

            let fetch_url = `https://gmail.googleapis.com/gmail/v1/users/me/drafts?key=${API_KEY}`;

            let email = [
                'Content-Type: text/plain; charset="UTF-8"\n',
                'MIME-Version: 1.0\n',
                'Content-Transfer-Encoding: 7bit\n',
                'to: srinidhi.ayala@gmail.com\n',
                'subject: Draft Test\n\n',
                'locem asjdhakjsdn adbakjb kajhdaskjbf ksjdfksdaljbf skdfb'
            ].join('');

            let base64EncodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

            let fetch_options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'message': {
                        'raw': base64EncodedEmail
                    }
                })
            };

            fetch(fetch_url, fetch_options)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(err => Promise.reject(err));
                    }
                    return res.json();
                })
                .then(res => {
                    console.log(res);
                    sendResponse(res);
                })
                .catch(err => {
                    console.error(err);
                    sendResponse({ error: err });
                });
        });
        return true; // Will respond asynchronously
    }
});