using System.Collections.Generic;

namespace ChallengeBoard.Web.Models.ViewModels {
    public class BoardViewModel {
        public List<Challenge> Challenges { get; set; }
        public User CurrentUser { get; set; }
        public int TotalPoints { get; set; }
        public bool IsAuthenticated { get; set; }
    }
}