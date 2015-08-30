using System.Collections.Generic;
using System.Web.Mvc;
using ChallengeBoard.Web.Core;
using ChallengeBoard.Web.Models;

namespace ChallengeBoard.Web.Controllers
{
    public class AdminController : RavenSessionController
    {
        //
        // GET: /Admin/

        public ActionResult Index()
        {
            //get all challenges from database
            var model = new List<Challenge>();
            model = RavenService.GetAllChallenges(RavenSession);
            return View(model);
        }

        public ActionResult AddChallenge()
        {
            var model = new Challenge();
            return View(model);
        }

        [HttpPost]
        public ActionResult AddChallenge(Challenge challenge)
        {

            RavenService.SaveChallenge(RavenSession, challenge);

            return RedirectToAction("AddChallenge");
        }

    }
}
