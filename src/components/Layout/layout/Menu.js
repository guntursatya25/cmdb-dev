import { useState } from 'react';

const MenuComponent = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    const renderContent = () => {
        const activeTabContent = tabs.find(tab => tab.name === activeTab);
        return activeTabContent ? activeTabContent.content : null;
    };

    return (
        <div className="flex gap-2 ">
             <div className="w-1/4 p-4 sticky top-20 h-fit bg-white z-10 rounded-lg">
                <ul>
                    {tabs.map((tab) => (
                        <li 
                            key={tab.name} 
                            onClick={() => setActiveTab(tab.name)}
                            className={activeTab === tab.name ? 'font-bold'  : '' }
                        >
                            {tab.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="w-3/4 p-6 container mt-[2px]">
                {renderContent()}
            </div>
        </div>
    );
};
export default MenuComponent