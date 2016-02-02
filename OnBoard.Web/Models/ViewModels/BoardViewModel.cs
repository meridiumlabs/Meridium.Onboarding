using System.Collections.Generic;
using OnBoard.Web.Models;

namespace OnBoard.Web.Models.ViewModels {
    public class BoardViewModel {
        public List<Challenge> Challenges { get; set; }
        public User CurrentUser { get; set; }
        public int TotalPoints { get; set; }
        public bool IsAuthenticated { get; set; }
        public List<FeedViewModel> History { get; set; }
    }
}