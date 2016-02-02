using System.Collections.Generic;
using System.ComponentModel;

namespace OnBoard.Web.Models {
    public class User {
        public User() {
            CompletedChallenges = new List<string>();
        }
        public string AuthID { get; set; }
        [DisplayName("Användarnamn")]
        public string UserName { get; set; }
        [DisplayName("För- och efternamn")]
        public string Name { get; set; }
        [DisplayName("Lösenord")]
        public string Password { get; set; }
        [DisplayName("Visa publikt")]
        public bool IsPublic { get; set; }
        public List<string> CompletedChallenges { get; set; }
    }
}