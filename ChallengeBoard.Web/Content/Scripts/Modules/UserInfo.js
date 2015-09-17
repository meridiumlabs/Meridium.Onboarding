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
    registerEvents()
    {
        var event = new Event("challengeCardSaved");
        document.addEventListener("challengeCardSaved", event => this.updateProgressBar(event.detail));
    }
    initProgressBar()
    {
        var currentPoints = parseFloat(document.getElementById('intro-score').textContent);
        var maxScore = parseFloat(document.getElementById('max-score').textContent);
        var progress = currentPoints / maxScore;
        this.progressBar.animate(progress);

        
    }
    updateProgressBar(points) {
        console.log(points);
        var scoreboard = document.getElementById('intro-score');
        var currentPoints = parseInt(scoreboard.textContent);
        
        var newScore = currentPoints + parseInt(points);
        scoreboard.textContent = newScore;
        var progress = parseFloat(scoreboard.textContent)/parseFloat(document.getElementById('max-score').textContent);
        this.progressBar.animate(progress);

        //update bonus rings
        if (newScore >= 100) {
            
            var level = document.getElementById('bonus-level-one');
            if (!level.classList.contains("fulfilled")) {
                level.classList.add("fulfilled");
            }
        } else {
            
            var level = document.getElementById('bonus-level-one');
            if (level.classList.contains("fulfilled")) {
                level.classList.remove("fulfilled");
            }
        }
        if (currentPoints >= 400) {
            
            var level = document.getElementById('bonus-level-two');
            if (!level.classList.contains("fulfilled")) {
                level.classList.add("fulfilled");
            }
        } else {
            
            var level = document.getElementById('bonus-level-two');
            if (level.classList.contains("fulfilled")) {
                level.classList.remove("fulfilled");
            }
        }
                
        if (currentPoints >= 800) {
            var level = document.getElementById('bonus-level-three');
            if (!level.classList.contains("fulfilled")) {
                level.classList.add("fulfilled");
            }
        } else {
            var level = document.getElementById('bonus-level-three');
            if (level.classList.contains("fulfilled")) {
                level.classList.remove("fulfilled");
            }
        }
        if (currentPoints >= 1300) {
            var level = document.getElementById('bonus-level-four');
            if (!level.classList.contains("fulfilled")) {
                level.classList.add("fulfilled");
            }
        } else {
            var level = document.getElementById('bonus-level-four');
            if (level.classList.contains("fulfilled")) {
                level.classList.remove("fulfilled");
            }
        }
        if (currentPoints >= 2000) {
            var level = document.getElementById('bonus-level-five');
            if (!level.classList.contains("fulfilled")) {
                level.classList.add("fulfilled");
            }
        } else {
            var level = document.getElementById('bonus-level-five');
            if (level.classList.contains("fulfilled")) {
                level.classList.remove("fulfilled");
            }
        }

    }
}
module.exports = UserInfo;