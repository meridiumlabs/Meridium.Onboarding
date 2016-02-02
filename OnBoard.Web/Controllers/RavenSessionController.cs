using System.Web.Mvc;
using OnBoard.Web;
using Raven.Client;

namespace OnBoard.Web.Controllers {
    public class RavenSessionController : Controller {   
        public IDocumentSession RavenSession { get; protected set; }

        protected override void OnActionExecuting(ActionExecutingContext filterContext) {
            RavenSession = MvcApplication.Store.OpenSession();
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext) {
            if (filterContext.IsChildAction) return;
            using (RavenSession) {
                if (filterContext.Exception != null) return;
                if (RavenSession != null) {
                    RavenSession.SaveChanges();
                }                    
            }
        }
    }
}
