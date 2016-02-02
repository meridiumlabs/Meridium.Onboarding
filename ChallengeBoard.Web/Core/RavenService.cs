using System;
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

        public static string GetChallengeName(IDocumentSession session, string challengeId)
        {
            var challenge = session.Load<Challenge>(challengeId); 
            if (challenge != null)
            {
                return challenge.Text;
            }
            return string.Empty;
        }
        public static List<FeedViewModel> GetHistory(IDocumentSession session, User user)
        {
            var list = new List<FeedViewModel>();
            var userId = "users/" + user.UserName;
            var feedItems = session.Query<Feed>().Where(m => m.UserId == userId).OrderByDescending(m => m.TimeStamp).Take(10);

            foreach (Feed feedItem in feedItems)
            {
                var model = new FeedViewModel()
                {
                    TimeStamp = feedItem.TimeStamp,
                    Challenge = GetChallengeName(session, feedItem.ChallengeId)
                };

                list.Add(model);
            }

            return list;
        }

        public static User CreateUser(IDocumentSession session, User newUser)
        {
            var user = new User {
                UserName = newUser.UserName.ToLower(),
                Name = newUser.Name,
                Password = newUser.Password,
                IsPublic = newUser.IsPublic,
                AuthID = Guid.NewGuid().ToString()
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