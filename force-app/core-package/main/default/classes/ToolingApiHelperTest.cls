@isTest
public with sharing class ToolingApiHelperTest 
{
    @isTest 
    static void retrieveDependenciesTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = ToolingAPIHelper.buildDependencyQuery('ApexClass');

        system.assertNotEquals(null, response, 'Response Has Data');
    }

    @isTest 
    static void retrieveDependenciesEmptyTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = MetadataSelectorController.retrieveDependencies('', '');

        system.assertNotEquals(null, response, 'Response Has Data');
    }

    @isTest 
    static void retrieveDependenciesTestWithReferences()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = MetadataSelectorController.retrieveDependencies('ApexClass', 'ApexClass');

        system.assertNotEquals(null, response, 'Response Has Data');
    }

    @isTest 
    static void retrieveDependenciesTestWithReferencesNoMetadata()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = MetadataSelectorController.retrieveDependencies('', 'ApexClass');

        system.assertNotEquals(null, response, 'Response Has Data');
    }

    @isTest 
    static void buildMetadataDetailQueryTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiDetailMock());
        string response = MetadataSelectorController.retrieveMetadataDetail('ApexClass', 'ToolingAPIHelper');

        system.assertNotEquals(null, response, 'Response Has Data');
    }
}