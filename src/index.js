import { GraphQLServer } from 'graphql-yoga';

//Demo user data
const users = [
  {
    id: '1',
    name: 'Brian',
    email: 'brian@example.com',
    age: 26,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
    age: 29,
  },
  {
    id: '3',
    name: 'Mark',
    email: 'mark@example.com',
    age: 30,
  },
];

//Demo posts data
const posts = [
  {
    id: '10',
    title: 'Intro post',
    body:
      'This is our first post. Welcome to our site. Hope to serve you. Thanks',
    published: true,
    author: '1',
    comments: ['101', '102'],
  },
  {
    id: '11',
    title: 'Political rant',
    body:
      'Politics is dead as we know it. It is basically entertainment at this point',
    published: true,
    author: '1',
  },
  {
    id: '12',
    title: '3 secrets to living a long life',
    body:
      'Sleep is possibly the most important habit you can clean to get the best bang for your buck',
    published: true,
    author: '3',
    comments: ['103'],
  },
  {
    id: '13',
    title: 'Tips for securing your first job',
    body: 'Apply. Do not fear putting yourself out there',
    published: false,
    author: '2',
    comments: ['104'],
  },
];

//Comments dummy data
const comments = [
  {
    id: '101',
    text: 'This is the first comment',
    author: '3',
    post: '10',
  },
  {
    id: '102',
    text: 'This is my second comment. Awesome!',
    author: '2',
    post: '11',
  },
  {
    id: '103',
    text: 'This is another comment. Third to be exact ',
    author: '2',
    post: '11',
  },

  {
    id: '104',
    text: 'fourth comment coming through',
    author: '1',
    post: '13',
  },
];
//Type definitions
const typeDefs = `
  type Query {
    users: [User!]!
    posts(query: String): [Post!]!
    grades: [Int!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

`;

//Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      return users;
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },

    comments(parent, args, ctx, info) {
      return comments;
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },

    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },

    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },

  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },

    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Server started!');
});
