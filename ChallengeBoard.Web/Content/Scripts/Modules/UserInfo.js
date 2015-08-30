var progressbar = require('progressbar.js');

class UserInfo {
    constructor(user) {
        this.user = user;
        this.progressBar = new progressbar.Circle('#ProgressBarContainer', {
            color: '#00cc99',
            strokeWidth: 3,
            easing: 'easeInOut'
        });
        this.registerEvents();
    }
    registerEvents() {
        document.addEventListener("challengeCardSaved", event => this.updateProgressBar(event.detail));
    }
    initProgressBar() {
        this.progressBar.animate(0.7);
    }
    updateProgressBar(points) {
        console.log(points);
        this.progressBar.animate(0.9);
    }
}
module.exports = UserInfo;