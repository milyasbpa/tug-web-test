import namespaces from '../json/index';

type I18nNamespaces = typeof namespaces;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends I18nNamespaces {}
}
