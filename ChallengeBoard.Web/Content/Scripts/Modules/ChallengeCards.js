class ChallengeCards {
    constructor(user) {
        this.user = user;
        this.registerClickEvent();
    }
    registerClickEvent() {
        var self = this;
        var cards = document.getElementsByClassName("card");        
        for (var i = 0; i < cards.length; i++) {
            (function() {
                cards[i].addEventListener("click", function(e) {
                    e.preventDefault();

                    self.updateChallengeCard(this);
                    self.updateChallengeOnServer(this);

                });
                var card = cards[i];
                cards[i].getElementsByClassName('card-count--subtr')[0].addEventListener("click", function(e) {
                    //alert("hej");
                    e.preventDefault();
                    e.stopPropagation();

                    self.updateChallengeCardSubtract(card);
                    self.updateChallengeCardSubtractOnServer(card);
                });
            }());
        }
    }
    updateChallengeCard(card) {
        var cardIsMarkedAsComplete = card.classList.contains("card--complete");
        
        var points = card.getAttribute('data-points');
        if (cardIsMarkedAsComplete) {
            //points = points * -1;
        } else {
            card.classList.add("card--complete");
        }
        //console.log(card.getElementsByClassName('card-count--number')[0].textContent);
        var currentCount = card.getElementsByClassName('card-count--number')[0];
        currentCount.textContent = parseInt(currentCount.textContent) + 1;
        var event = new CustomEvent("challengeCardSaved", { "detail": points });
        document.dispatchEvent(event);
    }
    updateChallengeCardSubtract(card) {
        var cardIsMarkedAsComplete = card.classList.contains("card--complete");
        
        var points = card.getAttribute('data-points');
        //if (cardIsMarkedAsComplete) {
            points = points * -1;
        //} else {
            //card.classList.add("card--complete");
        //}
        console.log(card);
        var currentCount = card.getElementsByClassName('card-count--number')[0];
        currentCount.textContent = parseInt(currentCount.textContent) - 1;
        var event = new CustomEvent("challengeCardSaved", { "detail": points });
        document.dispatchEvent(event);
    }
    updateChallengeOnServer(card) {        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'Home/ToggleChallenge');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status !== 200) {
                //Something went wrong message.
                // return to login form
                var username = document.getElementById("user-hide").textContent;
                window.location.href = "/Authentication?name=" + username;
                return;
            }            
        };
        xhr.send(JSON.stringify({
            id: card.getAttribute('data-id'),
            currentUser: this.user
        }));
    }
    updateChallengeCardSubtractOnServer(card) {        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'Home/ToggleChallengeSubtract');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status !== 200) {
                //Something went wrong message.
                // return to login form
                var username = document.getElementById("user-hide").textContent;
                window.location.href = "/Authentication?name=" + username;
                return;
            }            
        };
        xhr.send(JSON.stringify({
            id: card.getAttribute('data-id'),
            currentUser: this.user
        }));
    }
}
module.exports = ChallengeCards;