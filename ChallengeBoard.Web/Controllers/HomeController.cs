using System.Net;
using System.Web.Mvc;
using ChallengeBoard.Web.Core;
using ChallengeBoard.Web.Models;
using ChallengeBoard.Web.Models.Extensions;
using ChallengeBoard.Web.Models.ViewModels;

namespace ChallengeBoard.Web.Controllers {
    public class HomeController : RavenSessionController {
        public ActionResult Index(string name) {
            var user = RavenService.GetUser(RavenSession, name) ?? RavenService.CreateUser(RavenSession, name);
            var boardViewModel = new BoardViewModel {
                Challenges = RavenService.GetAllChallenges(RavenSession),
                CurrentUser = user
            };            
            return View(boardViewModel);
        }

        [HttpPost]
        public ActionResult ToggleChallenge(string id, string currentUser) {
            var user = RavenSession.Load<User>("users/" + currentUser);
            user.CompletedChallenges.Toggle(id);            
            RavenSession.SaveChanges();
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}