import React from 'react';

const DesignComponent = () => {
    const designURL = 'https://new-design-url.com';

    return (
        <div>
            <h1>デザインコンポーネント</h1>
            <a href={designURL}>新しいデザインを見る</a>
        </div>
    );
};

export default DesignComponent;

