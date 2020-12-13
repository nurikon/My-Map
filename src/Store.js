import React, { useState, createContext } from 'react';

export const dbLocationsContext = createContext()
export const dbCategoriesContext = createContext()
export const selectedLocationContext = createContext()
export const currentScreenContext = createContext()

const Store = ({ children }) => {

    const [dbLocations, setDbLocations] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentScreen, setCurrentScreen] = useState(null)

    return (
        <currentScreenContext.Provider value={[currentScreen, setCurrentScreen]}>
            <selectedLocationContext.Provider value={[selectedLocation, setSelectedLocation]}>
                <dbCategoriesContext.Provider value={[dbCategories, setDbCategories]}>
                    <dbLocationsContext.Provider value={[dbLocations, setDbLocations]}>
                        {children}
                    </dbLocationsContext.Provider>
                </dbCategoriesContext.Provider>
            </selectedLocationContext.Provider>
        </currentScreenContext.Provider>
    );
}

export default Store;
