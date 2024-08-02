import { useTranslation } from 'next-i18next';

interface PropertyFeaturesProps {
  property: {
    description: string;
    features: string[];
  };
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">{t('propertyFeatures')}</h2>
      <p className="mb-4">{property.description}</p>
      <ul className="list-disc list-inside">
        {property.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
