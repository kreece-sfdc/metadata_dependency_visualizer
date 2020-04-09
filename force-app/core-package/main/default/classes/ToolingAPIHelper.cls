public with sharing class ToolingAPIHelper 
{
    public static string buildDependencyQuery(string metadata)
    {
        return buildDependencyQuery(metadata, '');
    }

    public static string buildDependencyQuery(string metadata, string referenceMetadataTypes)
    {
        string selectQuery = 'SELECT MetadataComponentId, MetadataComponentName, MetadataComponentType, RefMetadataComponentId, RefMetadataComponentName, RefMetadataComponentType FROM MetadataComponentDependency';
        string whereQuery = ' WHERE ';
        string whereQueryMetadata = 'MetadataComponentType=\'' + metadata + '\'';
        string whereQueryReferenceTypes = 'RefMetadataComponentType IN (' + referenceMetadataTypes + ')';

        if(!string.isEmpty(metadata) || !string.isEmpty(referenceMetadataTypes))
        {
            selectQuery += whereQuery;

            if(!string.isEmpty(metadata) && !string.isEmpty(referenceMetadataTypes))
            {
                selectQuery += string.join(new List<string> { whereQueryMetadata, whereQueryReferenceTypes }, ' AND ');
            }
            else if(!string.isEmpty(metadata))
            {
                selectQuery += whereQueryMetadata;
            }
            else if(!string.isEmpty(referenceMetadataTypes))
            {
                selectQuery += whereQueryReferenceTypes;
            }
        }

        string toolingApiUrl = '/services/data/v48.0/tooling/query?q=';
        string completeUrl = toolingApiUrl + EncodingUtil.urlEncode(selectQuery, 'UTF-8');

        return SendAPIRequest(completeUrl);
    }

    public static string buildMetadataDetailQuery(string metadataType, string metadataName)
    {
        string selectQuery = 'SELECT Id, Name FROM ' + sanitiseInput(metadataType) + ' WHERE Name = \'' + sanitiseInput(metadataName) + '\'';

        string toolingApiUrl = '/services/data/v48.0/tooling/query?q=';
        string completeUrl = toolingApiUrl + EncodingUtil.urlEncode(selectQuery, 'UTF-8');

        string response = sendAPIRequest(completeUrl);
        ToolingAPIQueryResponse apiResponse = ToolingAPIQueryResponse.parse(response);

        return sendAPIRequest(apiResponse.records[0].attributes.url);
    }

    public static string sanitiseInput(string input) 
    {
        return input;
    }

    public static string sendAPIRequest(string url)
    {
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:MetadataVisualizerNamedCredentials' + url);
        request.setHeader('Content-Type', 'application/json');
        request.setMethod('GET');

        Http http = new Http();
        HttpResponse response = http.send(request);

        string responseJson = response.getBody();
        
        return responseJson;
    }
}