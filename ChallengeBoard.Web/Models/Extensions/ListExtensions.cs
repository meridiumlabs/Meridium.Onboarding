using System.Collections.Generic;
using System.Linq;

namespace ChallengeBoard.Web.Models.Extensions {
    public static class ListExtensions {
        public static void Toggle(this List<string> list, string id) {
            if (list == null) {
                return;
            }
            if (list.Contains(id)) {
                list.Remove(id);
            }
            else {
                list.Add(id);
            }
        }
        public static void Add(this List<string> list, string id) {
            if (list == null) {
                return;
            }
            list.Add(id);
        }
        public static void Subtract(this List<string> list, string id)
        {
            if (list == null)
            {
                return;
            }
            /*if (list.Contains(id)) {
                list.Remove(id);
            }
            else {*/
            var first = list.FirstOrDefault(x => x == id);
            list.Remove(first);
            //}
        }
    }
}