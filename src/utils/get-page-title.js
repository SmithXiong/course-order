import defaultSettings from '@/settings'

const title = defaultSettings.title || '小白代理'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
