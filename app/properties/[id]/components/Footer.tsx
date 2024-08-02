import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('about')}</h3>
            <p>{t('footerAboutText')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/properties">{t('properties')}</Link></li>
              <li><Link href="/about">{t('about')}</Link></li>
              <li><Link href="/contact">{t('contact')}</Link></li>
              <li><Link href="/terms">{t('termsAndConditions')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <p>{t('address')}</p>
            <p>{t('phone')}</p>
            <p>{t('email')}</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} {t('siteName')}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
