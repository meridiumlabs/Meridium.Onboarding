using System.Collections.Generic;

namespace ChallengeBoard.Web.Models.Extensions {
    public static class ListExtensions {
        public static void Toggle(this List<string> list, string id) {
            if (list == null) {
                return;
            }
            /*if (list.Contains(id)) {
                list.Remove(id);
            }
            else {*/
                list.Add(id);
            //}
        }
    }
}