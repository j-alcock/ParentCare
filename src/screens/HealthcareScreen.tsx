import React from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Medication, Appointment } from '../models/Healthcare';
import { getItem, updateList } from '../storage/storage';

const MEDS_KEY = 'medications';
const APPTS_KEY = 'appointments';

const HealthcareScreen = () => {
  const [tab, setTab] = React.useState<'meds' | 'appts'>('meds');
  const navigation = useNavigation();

  const [meds, setMeds] = React.useState<Medication[]>([]);
  const [medName, setMedName] = React.useState('');
  const [medDosage, setMedDosage] = React.useState('');

  const [appts, setAppts] = React.useState<Appointment[]>([]);
  const [apptTitle, setApptTitle] = React.useState('');
  const [apptWhen, setApptWhen] = React.useState('');

  React.useEffect(() => {
    (async () => {
      setMeds(await getItem<Medication[]>(MEDS_KEY, []));
      setAppts(await getItem<Appointment[]>(APPTS_KEY, []));
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      (async () => {
        const latestMeds = await getItem<Medication[]>(MEDS_KEY, []);
        const latestAppts = await getItem<Appointment[]>(APPTS_KEY, []);
        if (active) {
          setMeds(latestMeds);
          setAppts(latestAppts);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const addMed = async () => {
    if (!medName.trim()) return;
    const newItem: Medication = { id: String(Date.now()), name: medName.trim(), dosage: medDosage || undefined };
    const next = await updateList<Medication>(MEDS_KEY, (items) => [newItem, ...items]);
    setMeds(next);
    setMedName('');
    setMedDosage('');
  };

  const deleteMed = async (id: string) => {
    const next = await updateList<Medication>(MEDS_KEY, (items) => items.filter((m) => m.id !== id));
    setMeds(next);
  };

  const addAppt = async () => {
    if (!apptTitle.trim() || !apptWhen.trim()) {
      Alert.alert('Missing info', 'Please provide title and datetime (e.g., 2025-11-01 10:00)');
      return;
    }
    const newItem: Appointment = { id: String(Date.now()), title: apptTitle.trim(), datetimeISO: apptWhen.trim() };
    const next = await updateList<Appointment>(APPTS_KEY, (items) => [newItem, ...items]);
    setAppts(next);
    setApptTitle('');
    setApptWhen('');
  };

  const deleteAppt = async (id: string) => {
    const next = await updateList<Appointment>(APPTS_KEY, (items) => items.filter((a) => a.id !== id));
    setAppts(next);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ flex: 1, padding: 16, backgroundColor: tab === 'meds' ? '#eee' : '#fff' }} onPress={() => setTab('meds')}>
          <Text style={{ textAlign: 'center' }}>Medications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, padding: 16, backgroundColor: tab === 'appts' ? '#eee' : '#fff' }} onPress={() => setTab('appts')}>
          <Text style={{ textAlign: 'center' }}>Appointments</Text>
        </TouchableOpacity>
      </View>

      {tab === 'meds' ? (
        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 18 }}>Medications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MedicationManage' as never)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#eee' }}>
              <Text>Manage</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={meds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                {item.dosage ? <Text style={{ color: '#555' }}>{item.dosage}</Text> : null}
                {item.schedule ? <Text style={{ color: '#555' }}>Schedule: {item.schedule}</Text> : null}
                {item.whenToTake ? <Text style={{ color: '#555' }}>When: {item.whenToTake}</Text> : null}
                {typeof item.takeWithFood === 'boolean' ? (
                  <Text style={{ color: '#555' }}>Take with food: {item.takeWithFood ? 'Yes' : 'No'}</Text>
                ) : null}
                {typeof item.refillsRemaining === 'number' ? (
                  <Text style={{ color: '#555' }}>Refills remaining: {item.refillsRemaining}</Text>
                ) : null}
                {item.refillDateISO ? <Text style={{ color: '#555' }}>Next refill: {item.refillDateISO}</Text> : null}
                {item.pharmacy ? <Text style={{ color: '#555' }}>Pharmacy: {item.pharmacy}</Text> : null}
                {item.prescribedBy ? <Text style={{ color: '#555' }}>Prescribed by: {item.prescribedBy}</Text> : null}
                {item.notes ? <Text style={{ color: '#555' }}>Notes: {item.notes}</Text> : null}
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
          />
        </View>
      ) : (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>Appointments</Text>
          <View style={{ marginBottom: 12 }}>
            <TextInput placeholder="Title" value={apptTitle} onChangeText={setApptTitle} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8 }} />
            <TextInput placeholder="When (e.g., 2025-11-01 10:00)" value={apptWhen} onChangeText={setApptWhen} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40 }} />
          </View>
          <TouchableOpacity onPress={addAppt} style={{ backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginBottom: 12, alignSelf: 'flex-start' }}>
            <Text style={{ color: '#fff' }}>Add</Text>
          </TouchableOpacity>
          <FlatList
            data={appts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ fontWeight: '600' }}>{item.title}</Text>
                <Text style={{ color: '#555' }}>{item.datetimeISO}</Text>
                <TouchableOpacity onPress={() => deleteAppt(item.id)} style={{ marginTop: 6 }}>
                  <Text style={{ color: '#c00' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
          />
        </View>
      )}
    </View>
  );
};

export default HealthcareScreen;
