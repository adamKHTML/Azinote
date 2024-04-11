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


            <View style={styles.section}>
                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: '30' }}>Welcome to Azinotes.{"\n"}Create your notes by clicking the 'Add' button.</Text>
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
                            <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteNote(note.id)}>
                                <Entypo name='circle-with-cross' size={23} color='#fff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('FormScreen')}>
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>


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
    section: {
        marginTop: 60,
        padding: 20,
        marginVertical: 10,
        width: '80%',


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
        fontFamily: 'Montserrat_400Regular'
    },
    cardContent: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    cardPriorityContainer: {
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#ffd4ca',
        borderRadius: 5,
        padding: 10,
    },
    buttonDelete: {
        backgroundColor: '#F45B69',
        borderRadius: 5,
        padding: 10,
    },
    cardDate: {
        fontSize: 16,
        marginBottom: 10,
        color: '#808080',
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
    headerContainer: {

        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
            borderColor: '#F45B69',
            borderRadius: 30,
            backgroundColor: '#ffd4ca',
            color: '#F45B69',
            paddingRight: 30,
            width: 125,
            overflow: 'hidden',
            fontFamily: 'Montserrat_400Regular'

        },
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#F45B69',
            borderRadius: 30,
            backgroundColor: '#ffd4ca',
            color: '#F45B69',
            paddingRight: 30,
            overflow: 'hidden',
            width: 115,
            fontFamily: 'Montserrat_400Regular'
        },
    },

    addButton: {
        backgroundColor: '#114b5f',
        borderRadius: 11,
        width: 150,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#114b5f',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
        opacity: 1,
    },
    addButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular'
    },

});

