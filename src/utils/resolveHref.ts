const PAGES_WITH_CONTACT = ['/', '/catalogo'];

export function resolveHref(href: string, pathname: string): string {
  if (href.startsWith('#') && !PAGES_WITH_CONTACT.includes(pathname)) {
    return `/${href}`;
  }
  return href;
}
