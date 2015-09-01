using System.Collections.Generic;
using System.Linq;
using ChallengeBoard.Web.Models;
using Raven.Client;

namespace ChallengeBoard.Web.Core
{
    public static class RavenService
    {
        public static void SaveChallenge(IDocumentSession session, Challenge challenge) {
           
           session.Store(challenge);
           session.SaveChanges();

        }

        public static List<Challenge> GetAllChallenges(IDocumentSession session)
        {
            return session.Query<Challenge>().OrderByDescending(m => m.Text).ToList();

        }

        public static User GetUser(IDocumentSession session, string name)
        {
            return session.Query<User>().Customize(x=>x.WaitForNonStaleResults()).FirstOrDefault(m => m.UserName == name.ToLower());
        }

        public static User CreateUser(IDocumentSession session, User newUser)
        {
            var user = new User {
                UserName = newUser.UserName.ToLower(),
                Name = newUser.Name,
                Password = newUser.Password,
                IsPublic = newUser.IsPublic
            };

            session.Store(user);
            session.SaveChanges();

            return user;
        }

        public static User UpdateUser(IDocumentSession session, string name)
        {
            var user = session.Load<User>("users/" + name);
            if (user.CompletedChallenges == null)
            {
                user.CompletedChallenges = new List<string>();
            }

            //user.Score = user.Score + 7;
            session.SaveChanges();

            return user;
        }
    }
}