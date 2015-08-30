var Masonry = require('masonry-layout');

import ChallengeCards from "./Modules/ChallengeCards";
import UserInfo from "./Modules/UserInfo";

var challengeCards = new ChallengeCards('christian');
var userInfo = new UserInfo('christian');

userInfo.initProgressBar();

var cards = document.getElementById('Cards');
/*var msnry = new Masonry( cards, {
  itemSelector: '.item',
  columnWidth: 220
});*/