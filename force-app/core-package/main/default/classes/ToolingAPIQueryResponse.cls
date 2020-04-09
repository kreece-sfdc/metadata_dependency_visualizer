public with sharing class ToolingAPIQueryResponse 
{
    public List<Records> records;

	public class Attributes {
		public string url;
	}

	public class Records {
		public Attributes attributes;
	}

	public static ToolingAPIQueryResponse parse(string json) {
		return (ToolingAPIQueryResponse)system.JSON.deserialize(json, ToolingAPIQueryResponse.class);
	}
}