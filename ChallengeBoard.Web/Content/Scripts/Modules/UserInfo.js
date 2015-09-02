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
    initProgressBar()
    {
        var currentPoints = parseFloat(document.getElementById('intro-score').innerText);
        var maxScore = parseFloat(document.getElementById('max-score').innerText);
        var progress = currentPoints / maxScore;
        this.progressBar.animate(progress);
    }
    updateProgressBar(points) {
        console.log(points);
        var scoreboard = document.getElementById('intro-score');
        var currentPoints = parseInt(scoreboard.innerText);
        scoreboard.innerText = currentPoints + parseInt(points);
        
        var progress = parseFloat(scoreboard.innerText)/parseFloat(document.getElementById('max-score').innerText);
        this.progressBar.animate(progress);
    }
}
module.exports = UserInfo;