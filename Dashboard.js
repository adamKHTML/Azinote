import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView, Dimensions, Image } from 'react-native';
import WavyHeader from './Component/WavyHeader';
import { Entypo } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import RNPickerSelect from 'react-native-picker-select';




const db = SQLite.openDatabase('notes.db');

const Dashboard = ({ navigation }) => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            showNotes();
        });

        showNotes();

        return unsubscribe;
    }, [navigation]);

    const showNotes = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM notes',
                [],
                (_, resultSet) => {
                    setNotes(resultSet.rows._array);
                    setIsLoading(false);
                },
                (_, error) => console.log('Error fetching notes: ', error)
            );
        });
    };

    const deleteNote = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM notes WHERE id = ?',
                [id],
                () => {
                    console.log('Note deleted successfully!');
                    setNotes(notes.filter(note => note.id !== id));
                },
                (_, error) => console.log('Error deleting note: ', error)
            );
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);


        const day = ('0' + date.getDate()).slice(-2);
        const monthIndex = date.getMonth();
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
        const month = monthNames[monthIndex];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

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

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substring(0, maxLength) + '...';

        }
    };

    const filterNotes = (notes, sortCriterion) => {
        switch (sortCriterion) {
            case 'Reminder':
                return notes.sort((a, b) => {
                    if (a.priority === '0' && b.priority !== '0') return -1;
                    if (a.priority !== '0' && b.priority === '0') return 1;
                    return 0;
                });
            case 'Standard':
                return notes.sort((a, b) => {
                    if (a.priority === '1' && b.priority !== '1') return -1;
                    if (a.priority !== '1' && b.priority === '1') return 1;
                    return 0;
                });
            case 'Urgent':
                return notes.sort((a, b) => {
                    if (a.priority === '2' && b.priority !== '2') return -1;
                    if (a.priority !== '2' && b.priority === '2') return 1;
                    return 0;
                });
            case 'recent':
                return notes.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return notes.sort((a, b) => new Date(a.date) - new Date(b.date));
            default:
                return notes;
        }
    };


    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const filteredNotes = filterNotes(notes, selectedFilter);

    return (

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <WavyHeader customStyles={styles.svgCurve} />
                <View style={styles.headerContainer}>
                    <Image style={styles.headerImage} source={require('./img/Azilog.png')} />
                </View>
            </View>


            <RNPickerSelect
                style={styles.picker}
                onValueChange={(value) => setSelectedFilter(value)}
                items={[
                    { label: 'Reminder', value: 'Reminder' },
                    { label: 'Standard', value: 'Standard' },
                    { label: 'Urgent', value: 'Urgent' },
                    { label: 'Recent', value: 'recent' },
                    { label: 'Oldest', value: 'oldest' },
                ]}
            />
            {notes.map((note, index) => {
                const formattedDate = formatDate(note.date);
                const priorityLabel = formatPriorityLabel(note.priority);
                const priorityStyle = formatPriorityStyle(note.priority);

                return (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>{note.title}</Text>
                        <Text style={styles.cardDate}>{formattedDate}</Text>
                        <Text style={styles.cardContent}>{truncateText(note.content, 100)}</Text>
                        <View style={styles.cardPriorityContainer}>
                            <Text style={styles.cardPriorityLabel}>Priority :</Text>
                            <Text style={[styles.cardPriority, formatPriorityStyle(note.priority)]}>{priorityLabel}</Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Entypo name='cog' size={23} color='#fff' onPress={() => navigation.navigate('Note', { note: note })} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => deleteNote(note.id)}>
                                <Entypo name='circle-with-cross' size={23} color='#fff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}

            <Button title="Add" className="btn btn-dark" onPress={() => navigation.navigate('FormScreen')} />

        </ScrollView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        marginTop: 60,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        width: '80%',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardContent: {
        fontSize: 16,
        marginBottom: 10,
    },
    cardPriority: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#5AB1BB',
        borderRadius: 5,
        padding: 10,
    },
    priorityReminder: {
        backgroundColor: '#f0f0f0',
        color: '#888383',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        maxWidth: 'auto',
    },
    priorityStandard: {
        backgroundColor: '#ffd166',
        color: '#664c10',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        maxWidth: 'auto',
    },
    priorityUrgent: {
        backgroundColor: '#F45B69',
        color: '#314031',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        maxWidth: 'auto',
    },
    headerContainer: {

        marginHorizontal: 10,
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    svgCurve: {
        position: 'absolute',
        width: Dimensions.get('window').width,
    },
    headerImage: {
        width: 125,
        height: 125,
        resizeMode: 'contain',
    },

    picker: {
        inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#FFD4CA',
            borderRadius: 30,
            backgroundColor: 'transparent',
            color: 'white',
            paddingRight: 30,
            width: 95,
            overflow: 'hidden',

        },
        inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: 'transparent',
            borderRadius: 30,
            backgroundColor: '#C5A6D6',
            color: 'black',
            paddingRight: 30,
        },
    },
});
