import ApolloClient from 'apollo-boost';

const uri = 'https://jduque-rentdb.herokuapp.com/graphql';
export default new ApolloClient({ uri });
