import defaultSettings from '@/settings'

const title = defaultSettings.title || '微代做2.0';

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
