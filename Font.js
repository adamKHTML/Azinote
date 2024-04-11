import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';

export const useCustomFonts = () => {
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
    });

    return fontsLoaded;
};
