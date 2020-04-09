import { LightningElement, track, wire } from 'lwc';
import retrieveDependencies from '@salesforce/apex/MetadataSelectorController.retrieveDependencies';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import { createsvg } from 'c/edgebundling';

import { loadScript } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/d3';


export default class Visualizer extends LightningElement 
{
    @wire(CurrentPageReference) pageRef;
    @track results;
    @track chart;
    @track types = [];

    @track refTypes;
    @track metadataName;
    @track metadataType;
    d3Initialized = false;

    renderedCallback() {
    
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;

        Promise.all([
            loadScript(this, D3 + '/d3.min.js')
        ])
        .then(() => {
            this.initializeD3();
        })
        .catch(error => {
            console.log('failed: ' + error);
        });
    }

    initializeD3() {
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    connectedCallback() {
        registerListener('metadataChange', this.handleMetadataChange, this);

        document.addEventListener('customEvent', e => {
            this.metadataType = e.detail.type;
            this.metadataName = e.detail.name;
            //this.fetchResults();
            fireEvent(this.pageRef, 'metadataClick', { name: this.metadataName, type: this.metadataType });
        });

        /*document.addEventListener('errorEvent', e => {
            var message = e.detail.message;
            const errorToast = new ShowToastEvent({
                title: 'No Filter Available',
                message: message
            });
            console.log('clicked error');
            this.dispatchEvent(errorToast);
        });*/
    }

    handleMetadataChange(detail) {
        this.metadataType = detail.selectedMetadataType;
        this.metadataName = detail.selectedMetadataName;
        this.refTypes = detail.referenceMetadataTypes;
        this.fetchResults();
    }

    fetchResults() {
        retrieveDependencies({ selectedMetadata: this.metadataType, referenceMetadataTypes: this.refTypes })
        .then(result => {
            this.results = result;
            let data = JSON.parse(result);
            // filter here
            if(this.metadataName != null && this.metadataName.length > 0) {
                var records = new Array();

                data.records.forEach(p => {
                    if(p.MetadataComponentName == this.metadataName) {
                        records.push(p);
                    }
                });

                data.records = records;
            }

            var svg = d3.select(this.template.querySelector('svg.d3'));

            createsvg(d3, data, svg);

            this.returnData(data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    returnData(data) {
        if(this.types.length == 0){
            data.records.forEach(element => {
                if (!this.types.some(p => p.name === element.RefMetadataComponentType)) {
                    this.types.push({ name: element.RefMetadataComponentType, count: 0 });
                }
            });

            this.types.sort(p => p.name);
        }

        this.types.forEach(p => {
            p.count = 0;
            data.records.forEach(q => {
                if(q.RefMetadataComponentType == p.name) {
                    p.count++;
                }
            });
        });

        fireEvent(this.pageRef, 'metadataTypes', this.types);
    }
}