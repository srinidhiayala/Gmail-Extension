const recipient = document.querySelector("#recipient");
const subject = document.querySelector("#subject");
const body_message = document.querySelector("#message");
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
  

document.querySelector("#submit").addEventListener("click", function() {
    
    chrome.runtime.sendMessage({message: "send_email", data: {recipient:recipient.value,subject:subject.value,body_message:body_message.value}});
    popup.classList.remove('popup-hidden');
    popup.classList.add('popup-visible');
  });

document.querySelector("#draft").addEventListener("click", function() {
    chrome.runtime.sendMessage({message: "draft_email"});
  });

closePopup.addEventListener('click', function() {
    popup.classList.remove('popup-visible');
    popup.classList.add('popup-hidden');
});
  



// document.addEventListener('DOMContentLoaded', function() {
//     console.log("entered")
//   const button = document.querySelector("#thing");
//   if (button) {
//     console.log("entered IF")
//     button.addEventListener("click", function() {
//       chrome.runtime.sendMessage({ message: "get_access_token" });
//     });
//   } else {
//     console.error('Element with id "thing" not found');
//   }
// });
