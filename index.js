const app = require("express")();
const expressGraphql = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User { 
    id: ID
    name: String
    repo: String
    age: Int
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    createUser(name: String!, repo: String!, age: Int!): User
  }
`);

// type User define uma strutura para o schema
// type Query consulta os dados
// type Mutation enviar dados

// '!' é para dizer que é um argumento obrigatório

const providers = {
  users: []
};

// provider é apenas um objeto com um item que contem um array '[]'
// e com o resolver `createUser` será povoado com o `users`

let id = 0;

const resolvers = {
  user({ id }) {
    return providers.users.find(item => item.id === Number(id));
  },

  users() {
    return providers.users;
  },

  createUser({ name, repo, age }) {
    const user = {
      id: id++,
      name,
      repo,
      age
    };

    providers.users.push(user);

    return user;
  }
};

// Os resolvers são funções que o mesmo nome das requisições que estão em `Mutation` e `Query`

app.use(
  "/graphql",
  expressGraphql({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

// middleware do graphQl

app.listen(3000);
