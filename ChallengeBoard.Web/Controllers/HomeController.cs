using System;
using System.Collections.Generic;
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

            if (user.IsPublic || (Session["AuthID"] != null && Session["AuthID"].ToString() == user.AuthID))
            {
                var challenges = RavenService.GetAllChallenges(RavenSession);
                
                var boardViewModel = new BoardViewModel
                {
                    Challenges = challenges,
                    TotalPoints = CalculatePoints(challenges, user),
                    CurrentUser = user
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
                    points += challenge.Points;
                }
            }

            return points;
        }

        [HttpPost]
        public ActionResult ToggleChallenge(string id, string currentUser) {
            var user = RavenSession.Load<User>("users/" + currentUser);
            user.CompletedChallenges.Toggle(id);            
            RavenSession.SaveChanges();
            return new HttpStatusCodeResult(HttpStatusCode.OK);
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

        
    }


}