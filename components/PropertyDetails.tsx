import React from 'react';
import { Property } from '../types/property';
import ImageCarousel from './ImageCarousel';

interface PropertyDetailsProps {
  property: Property;
  isDarkMode: boolean;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-inner`}>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
          {property.imageUrls && property.imageUrls.length > 0 && (
            <ImageCarousel images={property.imageUrls} />
          )}
        </div>
        <div className="w-full lg:w-1/2 px-4">
          <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{property.title}</h3>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{property.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{property.price}</span>
              <span className={`ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{property.priceUnit}</span>
            </div>
            {property.area && (
              <div className="flex items-center">
                <span className={`mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>広さ:</span>
                <span className={` ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{property.area} m²</span>
              </div>
            )}
            <div className="flex items-center">
              <span className={`mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>宿泊可能人数:</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{property.maxGuests} 人</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>ベッドルーム:</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{property.bedrooms} 部屋</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>バスルーム:</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{property.bathrooms} 室</span>
            </div>
          </div>
          <div className="mt-4">
            <a
              href={`/properties/${property.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out`}
            >
              詳細を見る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;