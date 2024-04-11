import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import RNPickerSelect from 'react-native-picker-select';

const db = SQLite.openDatabase('notes.db');

const EditMode = ({ note, onSave, onCancel, navigation, route }) => {
    const [editedNote, setEditedNote] = useState(note);


    const handleChangeTitle = (text) => {
        setEditedNote({
            ...editedNote,
            title: text,
        });
    };

    const handleChangeContent = (text) => {
        setEditedNote({
            ...editedNote,
            content: text,
        });
    };

    const handleChangePriority = (text) => {
        setEditedNote({
            ...editedNote,
            priority: text,
        });
    };

    const handleSaveNote = () => {
        const currentDate = new Date().toISOString();

        const updatedNote = {
            ...editedNote,
            date: currentDate,
        };

        db.transaction(tx => {
            tx.executeSql(
                'UPDATE notes SET title = ?, content = ?, priority = ?, date = ? WHERE id = ?',
                [updatedNote.title, updatedNote.content, updatedNote.priority, updatedNote.date, updatedNote.id],
                () => {
                    console.log('Note updated successfully!');
                    onSave();

                    navigation.goBack();
                },
                (_, error) => console.log('Error updating note: ', error)
            );
        });
    };

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                value={editedNote.title}
                onChangeText={handleChangeTitle}
                placeholder="Title"
            />
            <TextInput
                style={styles.input}
                value={editedNote.content}
                onChangeText={handleChangeContent}
                placeholder="Content"
                multiline
            />
            <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(value) => handleChangePriority(value)}
                items={[
                    { label: 'Reminder', value: '0' },
                    { label: 'Standard', value: '1' },
                    { label: 'Urgent', value: '2' },
                ]}
            />
            <View style={styles.buttonsContainer}>
                <Button title="Save" onPress={handleSaveNote} />
                <Button title="Cancel" onPress={onCancel} />
            </View>
        </View>
    );
};


export default EditMode;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontFamily: 'Montserrat_400Regular'

    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        fontFamily: 'Montserrat_400Regular'

    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        fontFamily: 'Montserrat_400Regular'

    },
});

