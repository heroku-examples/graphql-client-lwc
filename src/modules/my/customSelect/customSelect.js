import { LightningElement, api } from 'lwc';

export default class CustomSelect extends LightningElement {
    @api name = '';
    @api label = '';
    @api items = [];

    handleSelect(event) {
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent('select', { detail: value }));
    }
}
