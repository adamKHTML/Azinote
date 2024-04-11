import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, KeyboardAvoidingView, Dimensions, ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import EditMode from './EditMode';
import WavyHeader from './Component/WavyHeader';


const Note = ({ navigation, route }) => {
    const { note } = route.params;
    const [isEditMode, setIsEditMode] = useState(false);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

        });

        return unsubscribe;
    }, [navigation]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const time = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
        const day = ('0' + date.getDate()).slice(-2);
        const monthIndex = date.getMonth();
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
        const month = monthNames[monthIndex];
        const year = date.getFullYear();

        return `${time} - ${day} ${month} ${year}`;
    };


    const formattedDate = formatDate(note.date);

    const formatPriorityLabel = (value) => {
        switch (value) {
            case '0':
                return 'Reminder';
            case '1':
                return 'Standard';
            case '2':
                return 'Urgent';
            default:
                return '';
        }
    };

    const priorityLabel = formatPriorityLabel(note.priority);
    // const priorityStyle = formatPriorityStyle(note.priority);


    const handleEditNote = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    const handleSaveNote = () => {


        console.log('Note saved');
        setIsEditMode(false);


    };


    const formatPriorityStyle = (value) => {
        switch (value) {
            case '0':
                return styles.priorityReminder;
            case '1':
                return styles.priorityStandard;
            case '2':
                return styles.priorityUrgent;
            default:
                return {};
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <WavyHeader customStyles={styles.svgCurve} />
                <View style={styles.headerContainer}>
                </View>

            </View>
            <KeyboardAvoidingView behavior='padding'>
                <View style={styles.noteContainer}>
                    <Text style={styles.noteTitle}>{note.title}</Text>
                    <Text style={styles.cardDate}>Date: {formattedDate}</Text>
                    <View style={styles.cardPriorityContainer}>
                        <Text style={styles.cardPriorityLabel}>Priority :</Text>
                        <Text style={[styles.cardPriority, formatPriorityStyle(note.priority)]}>{priorityLabel}</Text>
                    </View>
                    <Text style={styles.noteContent}>{note.content}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditNote}>
                        <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {isEditMode && (
                        <EditMode

                            note={note}
                            onCancel={handleCancelEdit}
                            onSave={handleSaveNote}
                            navigation={navigation}
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default Note;

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    container: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noteContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '80%',

    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Montserrat_400Regular'

    },
    noteContent: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular'

    },
    editButton: {
        backgroundColor: '#5AB1BB',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular'

    },

    cardPriorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    cardPriority: {
        fontSize: 14,
        color: 'gray',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        overflow: 'hidden',
        fontFamily: 'Montserrat_400Regular'

    },
    cardPriorityLabel: {
        fontSize: 16,
        color: '#808080',
        marginBottom: 10,
        fontFamily: 'Montserrat_400Regular'

    },
    priorityReminder: {
        backgroundColor: '#f0f0f0',
        color: '#888383',
        borderRadius: 5,
        padding: 5,
        alignSelf: 'flex-start',
        maxWidth: 'auto',
        borderRadius: 5,

    },
    priorityStandard: {
        backgroundColor: '#ffd166',
        color: '#664c10',
        alignSelf: 'flex-start',
        maxWidth: 'auto',
        padding: 5,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    priorityUrgent: {
        backgroundColor: '#F45B69',
        color: '#314031',
        padding: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        maxWidth: 'auto',
        borderRadius: 5,
        paddingVertical: 5,

    },
    cardDate: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
        fontFamily: 'Montserrat_400Regular'

    },

    headerContainer: {

        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    svgCurve: {
        position: 'absolute',
        width: Dimensions.get('window').width,
    },

});