const axios = require('axios')

const {
       GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull

} = require('graphql');

/**
 * 
 
// HARDCODED DATA

const customers = [
    { id: '1', name: 'Denisse Barrera', email: 'denisse@xte.com', age: 20 },
    { id: '2', name: 'Fernando Cifuentes', email: 'cifuentes@xte.com', age: 20 },
    { id: '3', name: 'Terry', email: 'Terry@xte.com', age: 5 }
];
*/

//customer type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
});

//ROOT QUERY

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLString }

            },
            resolve(parentValue, args) {
                /*
                for (let i = 0; i < customers.length; i++) {
                    if (customers[i].id == args.id) {
                        return customers[i];
                    }
                }
                */
                return axios.get('https://xteapi.herokuapp.com/db/' + args.id)
                    .then(res => res.data);


            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {

                return axios.get('https://xteapi.herokuapp.com/db/')
                    .then(res => res.data);
            }
        }
    }

});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'mutarion',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parentValue, args) {
                return axios.post('https://xteapi.herokuapp.com/db/', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                    .then(res => res.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return axios.delete('https://xteapi.herokuapp.com/db/' + args.id, {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                    .then(res => res.data);
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                return axios.patch('https://xteapi.herokuapp.com/db/' + args.id, args)
                    .then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});