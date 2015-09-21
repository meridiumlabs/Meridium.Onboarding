import ChallengeCards from "./Modules/ChallengeCards";
import UserInfo from "./Modules/UserInfo";

document.addEventListener("DOMContentLoaded", function(event) {

    var username = document.getElementById("user-hide").textContent;
    
    var challengeCards = new ChallengeCards(username);
    var userInfo = new UserInfo(username);

    userInfo.initProgressBar();

    var cards = document.getElementById('Cards');
});
/*var msnry = new Masonry( cards, {
  itemSelector: '.item',
  columnWidth: 220
});*/