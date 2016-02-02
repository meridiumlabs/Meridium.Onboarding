using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnBoard.Web.Models
{
    public class Feed
    {
        public string UserId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string ChallengeId { get; set; }
    }

    public class FeedViewModel
    {
        public DateTime TimeStamp { get; set; }
        public string Challenge { get; set; }
    }
}