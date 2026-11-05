import * as React from 'react'

import * as types from 'notion-types'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin'
import { SiGooglescholar } from '@react-icons/all-files/si/SiGooglescholar'
import cs from 'classnames'
import { Breadcrumbs, Header, useNotionContext } from 'react-notion-x'

import {
  github,
  googleScholar,
  linkedin,
  navigationLinks,
  navigationStyle
} from '@/lib/config'

import styles from './styles.module.css'

const HeaderSocialLinks = () => (
  <>
    {github && (
      <a
        className={cs('breadcrumb', 'button', styles.headerSocial, styles.github)}
        href={`https://github.com/${github}`}
        title='GitHub'
        aria-label='GitHub'
        target='_blank'
        rel='noopener noreferrer'
      >
        <FaGithub />
      </a>
    )}

    {linkedin && (
      <a
        className={cs('breadcrumb', 'button', styles.headerSocial, styles.linkedin)}
        href={`https://www.linkedin.com/in/${linkedin}`}
        title='LinkedIn'
        aria-label='LinkedIn'
        target='_blank'
        rel='noopener noreferrer'
      >
        <FaLinkedin />
      </a>
    )}

    {googleScholar && (
      <a
        className={cs(
          'breadcrumb',
          'button',
          styles.headerSocial,
          styles.googleScholar
        )}
        href={`https://scholar.google.com/citations?user=${googleScholar}`}
        title='Google Scholar'
        aria-label='Google Scholar'
        target='_blank'
        rel='noopener noreferrer'
      >
        <SiGooglescholar />
      </a>
    )}
  </>
)

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <HeaderSocialLinks />
        </div>
      </div>
    </header>
  )
}