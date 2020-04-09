public with sharing class MetadataSelectorController 
{
    @AuraEnabled(cacheable=true)
    public static string retrieveDependencies(string selectedMetadata, string referenceMetadataTypes) 
    {
        return ToolingApiHelper.buildDependencyQuery(selectedMetadata, referenceMetadataTypes);
    }

    @AuraEnabled(cacheable=true)
    public static string retrieveMetadataDetail(string metadataType, string metadataName) 
    {
        return ToolingApiHelper.buildMetadataDetailQuery(metadataType, metadataName);
    }
}
