// import Keycloak, { KeycloakError, KeycloakInstance } from 'keycloak-js';
import m, { FactoryComponent } from 'mithril';
import { FlatButton, Select, TextInput } from 'mithril-materialized';
import { IContent } from '../models';
import { Roles } from '../models/roles';

const userKey = 'username';
const userRole = 'userrole';

export const Auth = {
  username: localStorage.getItem(userKey) || '',
  roles: (localStorage.getItem(userRole) || '').split(','),
  isAuthenticated: false,

  isLoggedIn() {
    console.table(Auth);
    return (
      typeof Auth.username !== 'undefined' &&
      Auth.username.length > 0 &&
      Auth.roles &&
      Auth.roles.length > 0 &&
      Auth.roles[0].length > 0
    );
  },
  /** Can edit all documents, (un-)publish them, but also change the persons that have access. */
  isAdmin() {
    return Auth.roles.indexOf(Roles.ADMIN) >= 0;
  },
  /** Can edit all documents, (un-)publish them. */
  isEditor() {
    return (
      Auth.roles.indexOf(Roles.EDITOR) >= 0 || Auth.roles.indexOf(Roles.HOVD) >= 0 || Auth.roles.indexOf(Roles.OVD) >= 0
    );
  },
  /** Can edit the document, but also change the persons that have access. */
  isOwner(doc: Partial<IContent>) {
    return Auth.isAdmin() || (Auth.isAuthenticated && doc.author && doc.author.indexOf(Auth.username) >= 0);
  },
  /** Can edit the document, but also change the persons that have access. */
  canCRUD(doc: Partial<IContent>) {
    return Auth.isAuthenticated && (Auth.isAdmin() || Auth.isOwner(doc));
  },
  /** Can edit the document and publish it. */
  canEdit(doc: Partial<IContent>) {
    return Auth.isAuthenticated && (Auth.canCRUD(doc) || Auth.isEditor());
  },
  setUsername(username: string) {
    Auth.username = username;
    localStorage.setItem(userKey, username);
    Auth.login();
  },
  setRoles(roles: Array<string | number>) {
    Auth.roles = roles as string[];
    localStorage.setItem(userRole, roles.join(','));
    Auth.login();
  },
  setAuthenticated(authN: boolean) {
    Auth.isAuthenticated = authN;
  },
  async login() {
    Auth.isAuthenticated = Auth.isLoggedIn();
  },
  logout() {
    Auth.setAuthenticated(false);
    Auth.setUsername('');
    Auth.setRoles([]);
    m.route.set('/');
  },
};

Auth.login();
(window as any).Auth = Auth;

export const Login: FactoryComponent = () => {
  return {
    oninit: async () => {
      await Auth.login();
    },
    view: () => {
      console.log(`Authenticated: ${Auth.isAuthenticated}`);
      return m('.row', { style: 'margin-top: 10px;height: 80vh' }, [
        m(
          '.col.s6',
          m(TextInput, {
            label: 'Gebruikersnaam',
            initialValue: Auth.username,
            iconName: 'person',
            onchange: Auth.setUsername,
          })
        ),
        m(
          '.col.s6',
          m(Select, {
            label: 'Rollen',
            multiple: true,
            options: [
              { id: Roles.OVD, label: 'OVD' },
              { id: Roles.HOVD, label: 'HOVD' },
              { id: Roles.EDITOR, label: 'Editor' },
              { id: Roles.ADMIN, label: 'Administrator' },
              { id: Roles.OVERIG, label: 'Overig' },
            ],
            placeholder: 'Kies je rol(-en)',
            checkedId: Auth.roles,
            onchange: Auth.setRoles,
            // inline: true,
          })
        ),
        Auth.isAuthenticated &&
          m(
            '.col.s12',
            m(FlatButton, {
              label: 'Logout',
              iconName: 'exit_to_app',
              onclick: (e: any) => {
                Auth.logout();
                e.redraw = false;
              },
            })
          ),
      ]);
    },
  };
};
