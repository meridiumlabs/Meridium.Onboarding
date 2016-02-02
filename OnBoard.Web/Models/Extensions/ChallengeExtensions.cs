using System.Linq;
using OnBoard.Web.Models;

namespace OnBoard.Web.Models.Extensions {
    public static class ChallengeExtensions {
        public static bool IsComplete(this Challenge challenge, User user) {
            return user.CompletedChallenges.Contains(challenge.Id);
        }

        public static int NumberOfCompletions(this Challenge challenge, User user)
        {
            var count = user.CompletedChallenges.Count(s => challenge.Id == s);

            return count;
        }
    }
}