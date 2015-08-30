using System.Collections.Generic;

namespace ChallengeBoard.Web.Models {
    public class User {
        public User() {
            CompletedChallenges = new List<string>();
        }
        public string UserName { get; set; }
        public string Password { get; set; }
        public List<string> CompletedChallenges { get; set; }
    }
}