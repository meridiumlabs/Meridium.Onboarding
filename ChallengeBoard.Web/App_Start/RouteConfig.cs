using System.Web.Mvc;
using System.Web.Routing;

namespace ChallengeBoard.Web.App_Start
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Admin",
                url: "admin/{action}/{id}",
                defaults: new { controller = "Admin", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Auth",
                url: "authentication/{action}/{id}",
                defaults: new { controller = "Authentication", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute("404", "404", new { controller = "NotFound", action = "NotFound" });

            routes.MapRoute(
                "Profile",
                "{name}",
                new { controller = "Home", action = "Index", name = UrlParameter.Optional },
                new { httpMethod = new HttpMethodConstraint("GET") }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );           
        }
    }
}