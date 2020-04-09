import { LightningElement, track, wire } from 'lwc';
import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import retrieveMetadataDetail from '@salesforce/apex/MetadataSelectorController.retrieveMetadataDetail';
import { CurrentPageReference } from 'lightning/navigation';
import { GetObjectDetails, iterate } from 'c/edgebundling';

export default class Metadataselector extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track filterMetadataName = '';
    @track filterMetadataType = '';

    @track displayMetadataName = '';
    @track displayMetadataType = '';

    @track selectedMetadataDetail = [];

    @track referenceMetadataTypes = [];
    @track availableReferenceMetadataTypes = [];
    @track hasMetadata = false;
    @track hasReferenceMetadata = false;

    @track isFilterApplied = false;

    get metadataTypes() {
        var options = new Array();
        this.availableReferenceMetadataTypes.forEach(p => {
            options.push({ label: p.name + ' (' + p.count + ')', value: p.name });
        });
        return options;
    }

    get selectedValues() {
        if(this.referenceMetadataTypes.length > 0) {
            var md = '\'' + this.referenceMetadataTypes.join('\',\'') + '\'';
            return md;
        }
        return '';
    }

    get displayMetadataLabel() {
        return this.displayMetadataType + ' > ' + this.displayMetadataName;
    }

    get filterMetadataLabel() {
        return this.filterMetadataType + ' > ' + this.filterMetadataName;
    }

    handleCheckboxChange(e) {
        this.referenceMetadataTypes = e.detail.value;
    }

    
    handleClick() {
        fireEvent(this.pageRef, 'metadataChange', { selectedMetadataName: this.filterMetadataName, selectedMetadataType: this.filterMetadataType, referenceMetadataTypes: this.selectedValues });
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    connectedCallback() {
        registerListener('metadataClick', this.handleMetadataClick, this);
        registerListener('metadataTypes', this.handleMetadataTypes, this);
    }

    handleMetadataClick(detail) {
        this.displayMetadataName = detail.name;
        this.displayMetadataType = detail.type;
        this.hasMetadata = true;
        this.retrieveMetadataDetail();
    }

    retrieveMetadataDetail() {
        retrieveMetadataDetail({ metadataType: this.displayMetadataType, metadataName: this.displayMetadataName })
        .then(result => {
            var parsedJson = JSON.parse(result);
            var res = GetObjectDetails(parsedJson);
            //var res = iterate(parsedJson);
            this.selectedMetadataDetail = res;
        })
        .catch(error => {
            console.log('error: ' + error);
        });
    }

    handleMetadataTypes(types) {
        this.availableReferenceMetadataTypes = types;
        
        if(!this.hasReferenceMetadata) {
            types.forEach(p => {
                this.referenceMetadataTypes.push(p.name);
            });
        }

        this.hasReferenceMetadata = true;
    }

    handleRemoveFilter() {
        this.filterMetadataName = '';
        this.filterMetadataType = '';
        this.isFilterApplied = false;
        this.handleClick();
    }

    applyfilter() {
        this.filterMetadataName = this.displayMetadataName;
        this.filterMetadataType = this.displayMetadataType;
        this.handleClick();
        this.isFilterApplied = true;
    }
}