chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (chrome.runtime.lastError || !token) {
      console.error(chrome.runtime.lastError);
      return;
    }
  
    // Use the token to authenticate with Google APIs
    fetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  });
  