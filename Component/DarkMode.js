
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const DarkMode = ({ onChange, iconColor }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        onChange(newMode);
    };


    return (
        <TouchableOpacity onPress={toggleDarkMode}>
            <FontAwesome5 name={isDarkMode ? "sun" : "moon"} size={24} color={iconColor} />
        </TouchableOpacity>
    );
};

export default DarkMode;

