using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Autofac;
using OnBoard.Web.Models;
using Raven.Client;
using Raven.Client.Document;

namespace OnBoard.Web {    
    public class MvcApplication : HttpApplication {
        public static DocumentStore Store;
        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);


            Store = new DocumentStore() { ConnectionStringName = "Onboarding" };
            Store.Initialize();
            var builder = new ContainerBuilder();

            Store.Conventions.RegisterIdConvention<User>((dbname, commands, user) => "users/" + user.UserName);

            builder.Register(c => {
                var store = new DocumentStore {
                    ConnectionStringName = "Onboarding",
                    DefaultDatabase = "Onboarding"
                }.Initialize();

                return store;

            }).As<IDocumentStore>().SingleInstance();

            builder.Register(c => c.Resolve<IDocumentStore>().OpenAsyncSession()).As<IAsyncDocumentSession>().InstancePerLifetimeScope();

        }
    }
}