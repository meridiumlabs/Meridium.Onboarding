namespace ChallengeBoard.Web.Models.Extensions {
    public static class ChallengeExtensions {
        public static bool IsComplete(this Challenge challenge, User user) {
            return user.CompletedChallenges.Contains(challenge.Id);
        }
    }
}