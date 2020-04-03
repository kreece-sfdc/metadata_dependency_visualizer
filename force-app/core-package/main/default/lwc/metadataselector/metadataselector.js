import { LightningElement, track, wire } from 'lwc';
import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Metadataselector extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track selectedMetadataName = '';
    @track selectedMetadataType = '';

    @track referenceMetadataTypes = [];
    @track availableReferenceMetadataTypes = [];
    @track hasMetadata = false;
    @track hasReferenceMetadata = false;

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

    get selectedMetadataLabel() {
        return this.selectedMetadataType + ' > ' + this.selectedMetadataName;
    }

    handleCheckboxChange(e) {
        this.referenceMetadataTypes = e.detail.value;
    }

    
    handleClick() {
        fireEvent(this.pageRef, 'metadataChange', { selectedMetadataName: this.selectedMetadataName, selectedMetadataType: this.selectedMetadataType, referenceMetadataTypes: this.selectedValues });
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    connectedCallback() {
        registerListener('metadataClick', this.handleMetadataClick, this);
        registerListener('metadataTypes', this.handleMetadataTypes, this);
    }

    handleMetadataClick(detail) {
        this.selectedMetadataName = detail.name;
        this.selectedMetadataType = detail.type;
        this.hasMetadata = true;
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

    handleRemove() {
        this.selectedMetadataName = '';
        this.selectedMetadataType = '';
        this.hasMetadata = false;
        this.handleClick();
    }
}