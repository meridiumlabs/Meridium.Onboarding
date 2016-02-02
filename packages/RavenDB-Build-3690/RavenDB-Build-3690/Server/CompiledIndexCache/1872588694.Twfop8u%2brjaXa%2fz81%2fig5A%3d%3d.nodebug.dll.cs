using Raven.Abstractions;
using Raven.Database.Linq;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using System;
using Raven.Database.Linq.PrivateExtensions;
using Lucene.Net.Documents;
using System.Globalization;
using System.Text.RegularExpressions;
using Raven.Database.Indexing;

public class Index_Auto_Users_ByUserName : Raven.Database.Linq.AbstractViewGenerator
{
	public Index_Auto_Users_ByUserName()
	{
		this.ViewText = @"from doc in docs.Users
select new {
	UserName = doc.UserName
}";
		this.ForEntityNames.Add("Users");
		this.AddMapDefinition(docs => 
			from doc in ((IEnumerable<dynamic>)docs)
			where string.Equals(doc["@metadata"]["Raven-Entity-Name"], "Users", System.StringComparison.InvariantCultureIgnoreCase)
			select new {
				UserName = doc.UserName,
				__document_id = doc.__document_id
			});
		this.AddField("UserName");
		this.AddField("__document_id");
		this.AddQueryParameterForMap("UserName");
		this.AddQueryParameterForMap("__document_id");
		this.AddQueryParameterForReduce("UserName");
		this.AddQueryParameterForReduce("__document_id");
	}
}
