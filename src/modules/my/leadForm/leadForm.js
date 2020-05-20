import { LightningElement, track } from 'lwc';
import { gql } from 'apollo-boost';
import Joi from '@hapi/joi';
import client from 'my/graphqlClient';

const CREATE_LEAD = gql`
    mutation($lead: LeadInput!) {
        createLead(lead: $lead) {
            firstName
            lastName
            company
            email
        }
    }
`;

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    company: Joi.string().required(),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .allow(null)
});

export default class LeadForm extends LightningElement {
    loading = false;
    success = false;
    @track error = {
        hasError: false,
        message: null
    };
    @track lead = {
        firstName: null,
        lastName: null,
        company: null,
        email: null
    };

    async handleSubmit(event) {
        event.preventDefault();
        await this.createLead();
    }

    async createLead() {
        this.loading = true;
        this.error.hasError = false;
        this.error.message = null;
        try {
            const lead = this.lead;
            await schema.validateAsync(lead);
            const options = {
                mutation: CREATE_LEAD,
                variables: {
                    lead
                }
            };
            const { loading } = await client.mutate(options);
            this.loading = loading;
            this.success = true;
        } catch (err) {
            this.error.hasError = true;
            this.error.message = err.message;
        } finally {
            this.loading = false;
        }
    }

    handleInput(event) {
        const { name, value } = event.target;
        this.lead[name] = value;
    }
}
