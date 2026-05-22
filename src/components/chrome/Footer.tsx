import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/i18n/settings';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-32 border-t border-void-3/50 bg-void-0">
      <Container variant="app" as="div">
        <div className="flex flex-col items-start gap-6 py-12 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-text-bright font-display text-base tracking-wide keep-latin">
              {tMeta('name')}
            </p>
            <p className="text-text-faint text-sm">{t('tagline')}</p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em]">
              <a
                href="mailto:hello@hasanoso.com"
                className="text-text-muted hover:text-gold-core transition-colors"
              >
                {t('email')}
              </a>
              <a
                href="https://github.com/hasanoso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-gold-core transition-colors keep-latin"
              >
                {t('github')}
              </a>
              <a
                href="https://www.linkedin.com/in/hasan-oso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-gold-core transition-colors keep-latin"
              >
                {t('linkedin')}
              </a>
            </div>
            <p className="text-text-ghost text-[10px] font-mono uppercase tracking-[0.3em]">
              <span className="keep-latin">©{year}</span> · {t('rights')}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
