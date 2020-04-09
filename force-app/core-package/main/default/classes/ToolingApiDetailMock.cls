public with sharing class ToolingApiDetailMock implements HttpCalloutMock 
{
    public HTTPResponse respond(HTTPRequest req)
    {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"size" : 1,"totalSize" : 1,"done" : true,"queryLocator" : null,"entityTypeName" : "ApexClass","records" : [ {"attributes" : {"type" : "ApexClass","url" : "/services/data/v48.0/tooling/sobjects/ApexClass/01p26000001if3ZAAQ"},"Id" : "01p26000001if3ZAAQ","Name" : "ToolingAPIHelper","FullName" : "mdv__ToolingAPIHelper","NamespacePrefix" : "mdv"}]}');
        response.setStatusCode(200);
        return response;
    }
}