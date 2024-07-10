import React from 'react';
import DesignComponent from './components/DesignComponent';

const PropertyManagement = () => {
    const properties = [
        { id: 1, name: 'Property 1', location: 'Location 1', status: 'Available' },
        { id: 2, name: 'Property 2', location: 'Location 2', status: 'Occupied' },
        // 追加の物件情報をここに記載
    ];

    return (
        <div>
            <h1>物件管理</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>名前</th>
                        <th>場所</th>
                        <th>ステータス</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map(property => (
                        <tr key={property.id}>
                            <td>{property.id}</td>
                            <td>{property.name}</td>
                            <td>{property.location}</td>
                            <td>{property.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DesignComponent />
        </div>
    );
};

export default PropertyManagement;



