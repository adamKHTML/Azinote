import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, TextInput, TouchableOpacity, Text, Platform, DatePickerAndroid, Dimensions, ScrollView } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import RNPickerSelect from 'react-native-picker-select';
import WavyHeader from './Component/WavyHeader';





const db = SQLite.openDatabase('notes.db');

const FormScreen = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('0');
  const [names, setNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, content TEXT, priority TEXT)');
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM notes', null,
        (_, resultSet) => setNames(resultSet.rows._array),
        (_, error) => console.log(error)
      );
    });

    setIsLoading(false);
  }, []);


  const saveNote = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO notes (title, date, content, priority) VALUES (?, ?, ?, ?)',
        [title, date.toISOString(), content, priority],
        () => {
          console.log('Note saved successfully!');
          setNames([...names, { id: names.length + 1, name: title }]);
          setTitle('');
          setDate(new Date());
          setContent('');
          setPriority('0');

        },
        (_, error) => console.log('Error inserting note: ', error)
      );
    });
  };

  const openDatePicker = async () => {
    if (Platform.OS === 'android') {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: new Date(),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          const selectedDate = new Date(year, month, day);
          setDate(selectedDate);
        }
      } catch ({ code, message }) {
        console.warn('Cannot open date picker', message);
      }
    }
  };

  const deleteNote = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM notes WHERE id = ?',
        [id],
        () => {
          console.log('Note deleted successfully!');
          setNames(names.filter(note => note.id !== id));
        },
        (_, error) => console.log('Error deleting note: ', error)
      );
    });
  };

  if (isLoading) {
    return (
      <View style={loadingStyles.container}>
        <Text style={loadingStyles.title}>Chargement en cours...</Text>
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>


      <View style={styles.section}>
        <WavyHeader customStyles={styles.svgCurve} />

        <View style={styles.headerContainer}>
          <AntDesign name="form" size={45} color="white" />
        </View>

      </View>



      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={text => setTitle(text)}
      />

      <TouchableOpacity onPress={openDatePicker}>
        <Text style={styles.dateInput}>{date.toDateString()}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.textarea}
        multiline={true}
        numberOfLines={4}
        placeholder="Content"
        value={content}
        onChangeText={text => setContent(text)}
      />
      <RNPickerSelect
        style={styles.picker}
        value={priority}
        onValueChange={(value) => setPriority(value)}
        items={[
          { label: 'Reminder', value: '0' },
          { label: 'Standard', value: '1' },
          { label: 'Urgent', value: '2' },
        ]}
      />
      <TouchableOpacity style={row.saveButton} onPress={saveNote}>
        <Text style={row.addButtonText}>Save</ Text>
      </TouchableOpacity>
      <View>
        {names.map((note, index) => (
          <View key={index} style={row.container}>
            <Text style={row.text}>{note.title}</Text>
            <TouchableOpacity style={row.button} onPress={() => deleteNote(note.id)}>
              <Entypo name='circle-with-cross' size={28} color={'#fff'} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

};

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F45B69',
    alignItems: 'center',
    justifyContent: 'center',
    color: "#ffd4ca",
  },
  section: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

  },
  scrollContainer: {

    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',



  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    fontFamily: 'Montserrat_400Regular',
    marginTop: Dimensions.get('window').height * 0.3,

  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    height: 150,
    fontFamily: 'Montserrat_400Regular'

  },
  dateInput: {

    backgroundColor: '#456990',
    color: '#fff',
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    fontFamily: 'Montserrat_400Regular',
    overflow: 'hidden',

  },
  headerContainer: {

    position: 'absolute',
    paddingTop: Dimensions.get('window').height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',

  },
  svgCurve: {
    height: 89,
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  picker: {
    inputIOS: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: '100%',
      fontFamily: 'Montserrat_400Regular'

    },
    inputAndroid: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: '100%',
      fontFamily: 'Montserrat_400Regular'

    },

  },
});

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E152A',
    alignItems: 'center',
    justifyContent: 'center',
    color: "#fff",
  },
  title: {
    color: "#fff",
    marginTop: "1em",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: 'Montserrat_400Regular'

  }
});

const row = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

  },
  text: {
    fontSize: 18,
    fontFamily: 'Montserrat_400Regular'

  },
  button: {
    backgroundColor: '#F45B69',
    borderRadius: 5,
    padding: 10,
  },

  saveButton: {
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

