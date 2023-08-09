'use client'; // only needed if you choose App Router

import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  defaultTheme,
  AdminProps,
} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const theme: AdminProps['theme'] = {
  ...defaultTheme,
  palette: {
    mode: 'dark', // Switching the dark mode on is a single property value change.
  },
};

const AdminApp = () => (
  <Admin theme={theme} dataProvider={dataProvider}>
    <Resource
      name="users"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="name"
    />
    <Resource
      name="posts"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="title"
    />
    <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);

export default AdminApp;
