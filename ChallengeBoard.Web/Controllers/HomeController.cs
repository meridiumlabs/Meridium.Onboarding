using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using ChallengeBoard.Web.Core;

using ChallengeBoard.Web.Models;
using ChallengeBoard.Web.Models.Extensions;
using ChallengeBoard.Web.Models.ViewModels;
using Raven.Abstractions.Indexing;

namespace ChallengeBoard.Web.Controllers {
    public class HomeController : RavenSessionController {
        
        public ActionResult Index(string name)
        {
            
            if (string.IsNullOrEmpty(name))
            {
                return View("Welcome");
            }
            var user = RavenService.GetUser(RavenSession, name);
            
            if (user == null)
            {   
                return View("NewUser", new User{UserName = name});
            }
            var isAuthenticated = Session["AuthID"] != null && Session["AuthID"].ToString() == user.AuthID;

            if (user.IsPublic || isAuthenticated)
            {
                var challenges = RavenService.GetAllChallenges(RavenSession);
                
                var boardViewModel = new BoardViewModel
                {
                    Challenges = challenges.Where(m => m.Hide == false).ToList(),
                    TotalPoints = CalculatePoints(challenges, user),
                    CurrentUser = user,
                    IsAuthenticated = isAuthenticated
                };
                return View("Index", boardViewModel);
            }
            return RedirectToAction("Index", "Authentication", new { name = user.UserName });

        }

        private int CalculatePoints(List<Challenge> challenges, User user)
        {
            var points = 0;
            foreach (Challenge challenge in challenges)
            {
                if (challenge.IsComplete(user))
                {
                    var count = challenge.NumberOfCompletions(user);
                    points += challenge.Points * count;
                }
            }

            return points;
        }

        [HttpPost]
        public ActionResult ToggleChallenge(string id, string currentUser, bool single) {
            var user = RavenSession.Load<User>("users/" + currentUser);
            if (Session["AuthID"] != null && Session["AuthID"].ToString() == user.AuthID) {
                if (single) {
                    user.CompletedChallenges.Toggle(id);
                }
                else {
                    user.CompletedChallenges.Add(id);
                }
                var feedEntry = CreateFeedEntry("users/" + currentUser, id);
                RavenSession.Store(feedEntry);
                RavenSession.SaveChanges();
                return new HttpStatusCodeResult(HttpStatusCode.OK);
            }
            return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            //return RedirectToAction("Index", "Authentication", new { name = user.UserName });
        }
        [HttpPost]
        public ActionResult ToggleChallengeSubtract(string id, string currentUser)
        {
            var user = RavenSession.Load<User>("users/" + currentUser);
            if (Session["AuthID"] != null && Session["AuthID"].ToString() == user.AuthID)
            {
                user.CompletedChallenges.Subtract(id);
               
                RavenSession.SaveChanges();
                return new HttpStatusCodeResult(HttpStatusCode.OK);
            }
            return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            //return RedirectToAction("Index", "Authentication", new { name = user.UserName });
        }

        
        [HttpPost]
        public ActionResult NewUser(User user)
        {
            if (!string.IsNullOrEmpty(user.Name) && !string.IsNullOrEmpty(user.Password))
            {
                var newUser = RavenService.CreateUser(RavenSession, user);
                Session["AuthID"] = newUser.AuthID;
            }
            return RedirectToAction("Index", new { name = user.UserName });
        }

        protected Feed CreateFeedEntry(string userid, string challengeid)
        {
            var feedEntry = new Feed()
            {
                UserId = userid,
                TimeStamp = DateTime.Now,
                ChallengeId = challengeid
            };

            return feedEntry;
        }
    }


}