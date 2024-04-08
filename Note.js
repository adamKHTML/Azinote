import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, KeyboardAvoidingView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import EditMode from './EditMode';



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

        return `${time} ${day} ${month} ${year}`;
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



    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <View style={styles.noteContainer}>
                    <Text style={styles.noteTitle}>{note.title}</Text>
                    <Text style={styles.cardDate}>Date: {formattedDate}</Text>
                    <Text style={styles.cardPriority}>Priority: {formatPriorityLabel(note.priority)}</Text>
                    <Text style={styles.noteContent}>{note.content}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditNote}>
                        <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                </View>
                {isEditMode && (
                    <EditMode

                        note={note}
                        onCancel={handleCancelEdit}
                        onSave={handleSaveNote}
                        navigation={navigation}
                    />
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Note;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    noteContent: {
        fontSize: 16,
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
    },
    cardPriority: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    cardDate: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
});