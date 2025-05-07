import React from "react";

const TabContent = ({ activeTab, tabs, className = "", children }) => {
  return (
    <div className={`flex-1 overflow-auto ${className}`}>
      {tabs.map((tab) => (
        <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
          {children(tab)}
        </div>
      ))}
    </div>
  );
};

export default TabContent;
