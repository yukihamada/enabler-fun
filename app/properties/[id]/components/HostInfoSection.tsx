import Image from 'next/image';
import { useTranslation } from 'next-i18next';

interface HostInfoSectionProps {
  hostInfo: {
    name: string;
    bio: string;
    image: string;
  };
  isEditing: boolean;
  isAdmin: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => void;
  enablerVision: {
    name: string;
    slogan: string;
    image: string;
    vision: string;
    missionStatement: string;
    uniquePoints: string[];
    stats: Record<string, string | number>;
  };
}

const HostInfoSection: React.FC<HostInfoSectionProps> = ({ hostInfo, isEditing, isAdmin, onInputChange, enablerVision }) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg shadow-lg mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-blue-800">{enablerVision?.name || 'ホスト名未設定'}</h2>
          <p className="text-xl text-green-600 font-semibold mt-2">{enablerVision?.slogan || 'スローガン未設定'}</p>
        </div>
        <Image
          src={enablerVision?.image || '/default-image.jpg'}
          alt={enablerVision?.name || 'ホスト画像'}
          width={80}
          height={80}
          className="rounded-full shadow-md"
        />
      </div>

      <div className="bg-white bg-opacity-70 p-6 rounded-lg mb-6">
        <h3 className="text-2xl font-bold text-blue-700 mb-3">{t('ourVision')}</h3>
        <p className="text-lg text-gray-700">{enablerVision?.vision || 'ビジョン未設定'}</p>
        <p className="text-md text-green-700 mt-3 italic">{enablerVision?.missionStatement || 'ミッションステートメント未設定'}</p>
      </div>

      <div className="bg-white bg-opacity-70 p-6 rounded-lg mb-6">
        <h3 className="text-2xl font-bold text-blue-700 mb-3">{t('whatMakesUsUnique')}</h3>
        <ul className="list-none space-y-2">
          {enablerVision?.uniquePoints?.map((point, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-700">{point}</span>
            </li>
          )) || <li>ユニークポイント未設定</li>}
        </ul>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(enablerVision?.stats || {}).map(([key, value]) => (
          <div key={key} className="bg-white bg-opacity-70 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{value}</p>
            <p className="text-sm text-gray-600">{t(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HostInfoSection;