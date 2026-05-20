import { Github, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/settings';
import { cn } from '@/lib/utils';

const pageLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/projects', key: 'projects' },
  { href: '/contact', key: 'contact' },
] as const;

export function Footer({ locale }: { locale: Locale }) {
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const tContact = useTranslations('contact');
  const tHero = useTranslations('hero');

  const year = new Date().getFullYear();
  const wordmark = locale === 'ar' ? tHero('name') : 'Hasan Oso';
  const wordmarkClass = locale === 'ar' ? 'font-arabic' : 'serif-display';

  return (
    <footer className="mt-24 border-t border-border-subtle">
      <div className="container-prose py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-3">
            <p className={cn('text-xl tracking-wide text-primary', wordmarkClass)}>
              {wordmark}
            </p>
            <p className="text-sm text-secondary">{tFooter('tagline')}</p>
            <p className="text-sm text-tertiary">{tFooter('location')}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-ultrawide text-tertiary keep-latin">
              {tFooter('pagesLabel')}
            </p>
            <ul className="space-y-2">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary hover:text-primary transition-colors duration-200 text-sm link-underline"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-ultrawide text-tertiary keep-latin">
              {tFooter('contactLabel')}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${tContact('values.mail')}`}
                  className="text-secondary hover:text-primary transition-colors duration-200 keep-latin link-underline"
                >
                  {tContact('values.mail')}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${tContact('values.tel').replace(/\s/g, '')}`}
                  className="text-secondary hover:text-primary transition-colors duration-200 keep-latin"
                >
                  {tContact('values.tel')}
                </a>
              </li>
              <li className="text-tertiary">{tContact('values.location')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-xs text-tertiary">
            {tFooter('copyright', { year })}{' '}
            <span className="text-muted ms-1">{tFooter('themeLine')}</span>
          </p>
          <ul className="flex items-center gap-4">
            <li>
              <a
                href="https://github.com/hasanoso"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-tertiary hover:text-gold transition-colors duration-200"
              >
                <Github size={16} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/hasanoso"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-tertiary hover:text-gold transition-colors duration-200"
              >
                <Linkedin size={16} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
