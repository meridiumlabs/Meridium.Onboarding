using System;
using System.Web;
using System.Web.Mvc;
using OnBoard.Web.Core;
using OnBoard.Web.Models;

namespace OnBoard.Web.Controllers
{
    public class AuthenticationController : RavenSessionController
    {
        //
        // GET: /Authentication/

        public ActionResult Index(string name)
        {
            
            return View(new User {UserName = name});
        }
        
        [HttpPost]
        public ActionResult Login(User user)
        {
            
            var userFromDatabase = RavenService.GetUser(RavenSession, user.UserName);
            if (user.Password != userFromDatabase.Password)
            {
                return RedirectToAction("Index", new { name = user.UserName });
            }

            
            var cookie = new HttpCookie("AuthID");
            cookie.Value = userFromDatabase.AuthID;
            cookie.Expires = new DateTime(2020, 12, 31);
            Response.Cookies.Add(cookie);
            

            return RedirectToAction("Index", "Home", new { name = user.UserName });
        }

    }
}
