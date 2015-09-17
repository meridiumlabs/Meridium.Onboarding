class ChallengeCards {
    constructor(user) {
        this.user = user;
        this.registerClickEvent();
    }
    registerClickEvent() {
        var self = this;
        var cards = document.getElementsByClassName("card");        
        for (var i = 0; i < cards.length; i++) {            
            cards[i].addEventListener("click", function(e) {
                e.preventDefault();                 
                self.updateChallengeCard(this);
                self.updateChallengeOnServer(this);
            });
        }
    }
    updateChallengeCard(card) {
        var cardIsMarkedAsComplete = card.classList.contains("card--complete");
        card.classList.toggle("card--complete");
        var points = card.getAttribute('data-points');
        if(cardIsMarkedAsComplete) {
            points = points * -1;
        }

        //var e = document.createEvent('CustomEvent');

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
}
module.exports = ChallengeCards;