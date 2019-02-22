import React from 'react';

const AppContext = React.createContext({
    onUpdateConfig: () => {},
});

export default AppContext;