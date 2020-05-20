import { LightningElement, track } from 'lwc';
import { gql } from 'apollo-boost';
import client from 'my/graphqlClient';

const PROPERTIES_LIST = gql`
    query($city: String, $bedrooms: Int, $bathrooms: Int, $limit: Int) {
        findProperties(
            city: $city
            bedrooms: $bedrooms
            bathrooms: $bathrooms
            limit: $limit
        ) {
            address
            city
            state
            zipCode
            bedrooms
            bathrooms
        }
    }
`;

export default class Properties extends LightningElement {
    loading = false;
    properties = [];
    selectItems = ['Any', 0, 1, 2, 3, 4, 5];
    selectLimitItems = [5, 15, 20, 25, 30];
    @track variables = {
        limit: 5,
        city: null,
        bedrooms: null,
        bathrooms: null
    };
    @track error = {
        hasError: false,
        message: null
    };

    async connectedCallback() {
        await this.loadProperties();
    }

    async loadProperties() {
        const variables = this.variables;
        const options = {
            query: PROPERTIES_LIST,
            variables
        };

        this.loading = true;
        this.error.hasError = false;
        this.error.message = null;
        try {
            const { data, loading } = await client.query(options);
            this.loading = loading;
            this.properties = data.findProperties.map((property, id) =>
                Object.assign({}, property, { id })
            );
        } catch (err) {
            this.error.hasError = true;
            this.error.message = err.message;
        } finally {
            this.loading = false;
        }
    }

    async handleCity(event) {
        const city = event.target.value;
        if (city != null && city.length > 0) {
            this.variables.city = city.trim();
        } else {
            this.variables.city = null;
        }
    }

    async handleSelect(event) {
        const name = event.target.name;
        if (event.detail === 'Any') {
            this.variables[name] = null;
            return;
        }
        this.variables[name] = +event.detail;
    }

    async handleLimit(event) {
        this.variables.limit = +event.detail;
    }

    async handleSearch(event) {
        event.preventDefault();
        await this.loadProperties();
    }
}
