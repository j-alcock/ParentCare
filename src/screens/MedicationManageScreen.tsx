import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Pressable, TextInput, Switch, Alert } from 'react-native';
import { Medication } from '../models/Healthcare';
import { getItem, updateList } from '../storage/storage';
import { useNavigation } from '@react-navigation/native';

const MEDS_KEY = 'medications';

const MedicationManageScreen = () => {
  const navigation = useNavigation();

  const [meds, setMeds] = React.useState<Medication[]>([]);
  const [showAddChoice, setShowAddChoice] = React.useState(false);
  const [showManualForm, setShowManualForm] = React.useState(false);

  const [medName, setMedName] = React.useState('');
  const [medDosage, setMedDosage] = React.useState('');
  const [medSchedule, setMedSchedule] = React.useState('');
  const [medWhenToTake, setMedWhenToTake] = React.useState('');
  const [medTakeWithFood, setMedTakeWithFood] = React.useState<boolean | null>(null);
  const [medRefillsRemaining, setMedRefillsRemaining] = React.useState('');
  const [medRefillDateISO, setMedRefillDateISO] = React.useState('');
  const [medPharmacy, setMedPharmacy] = React.useState('');
  const [medPrescribedBy, setMedPrescribedBy] = React.useState('');
  const [medNotes, setMedNotes] = React.useState('');

  React.useEffect(() => {
    (async () => {
      setMeds(await getItem<Medication[]>(MEDS_KEY, []));
    })();
  }, []);

  const deleteMed = async (id: string) => {
    const next = await updateList<Medication>(MEDS_KEY, (items) => items.filter((m) => m.id !== id));
    setMeds(next);
  };

  const addMed = async () => {
    if (!medName.trim()) {
      Alert.alert('Missing name', 'Please provide a medication name.');
      return;
    }
    const refillsNum = medRefillsRemaining.trim() ? parseInt(medRefillsRemaining.trim(), 10) : undefined;
    const newItem: Medication = {
      id: String(Date.now()),
      name: medName.trim(),
      dosage: medDosage || undefined,
      schedule: medSchedule || undefined,
      notes: medNotes || undefined,
      refillsRemaining: Number.isNaN(refillsNum as number) ? undefined : refillsNum,
      refillDateISO: medRefillDateISO || undefined,
      whenToTake: medWhenToTake || undefined,
      takeWithFood: medTakeWithFood === null ? undefined : medTakeWithFood,
      pharmacy: medPharmacy || undefined,
      prescribedBy: medPrescribedBy || undefined,
    };
    const next = await updateList<Medication>(MEDS_KEY, (items) => [newItem, ...items]);
    setMeds(next);
    setShowManualForm(false);
    setShowAddChoice(false);
    setMedName('');
    setMedDosage('');
    setMedSchedule('');
    setMedWhenToTake('');
    setMedTakeWithFood(null);
    setMedRefillsRemaining('');
    setMedRefillDateISO('');
    setMedPharmacy('');
    setMedPrescribedBy('');
    setMedNotes('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 18 }}>Manage Medications</Text>
        <TouchableOpacity onPress={() => setShowAddChoice(true)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#111' }}>
          <Text style={{ color: '#fff' }}>Add Medication</Text>
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
            <TouchableOpacity onPress={() => deleteMed(item.id)} style={{ marginTop: 6 }}>
              <Text style={{ color: '#c00' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />

      <Modal visible={showAddChoice} transparent animationType="fade" onRequestClose={() => setShowAddChoice(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            {!showManualForm ? (
              <>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Add Medication</Text>
                <Pressable onPress={() => setShowManualForm(true)} style={{ paddingVertical: 12 }}>
                  <Text>Manual Entry</Text>
                </Pressable>
                <Pressable onPress={() => { setShowAddChoice(false); navigation.navigate('PillBottleCapture' as never); }} style={{ paddingVertical: 12 }}>
                  <Text>Pill Bottle</Text>
                </Pressable>
                <Pressable onPress={() => { setShowAddChoice(false); navigation.navigate('MedicationListCapture' as never); }} style={{ paddingVertical: 12 }}>
                  <Text>Medication List</Text>
                </Pressable>
                <Pressable onPress={() => setShowAddChoice(false)} style={{ paddingVertical: 12, marginTop: 4 }}>
                  <Text style={{ color: '#c00' }}>Cancel</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Manual Entry</Text>
                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                  <TextInput placeholder="Name" value={medName} onChangeText={setMedName} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginRight: 8 }} />
                  <TextInput placeholder="Dosage" value={medDosage} onChangeText={setMedDosage} style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40 }} />
                </View>
                <TextInput placeholder="Schedule (e.g., daily, 2x/day)" value={medSchedule} onChangeText={setMedSchedule} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8 }} />
                <TextInput placeholder="When to take (e.g., 8am, 2pm)" value={medWhenToTake} onChangeText={setMedWhenToTake} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Take with food</Text>
                  <Switch value={!!(medTakeWithFood === true)} onValueChange={(v) => setMedTakeWithFood(v)} />
                </View>
                <TextInput placeholder="Refills remaining (number)" value={medRefillsRemaining} onChangeText={setMedRefillsRemaining} keyboardType="number-pad" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8 }} />
                <TextInput placeholder="Next refill date (YYYY-MM-DD)" value={medRefillDateISO} onChangeText={setMedRefillDateISO} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8 }} />
                <TextInput placeholder="Pharmacy" value={medPharmacy} onChangeText={setMedPharmacy} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8 }} />
                <TextInput placeholder="Prescribed by" value={medPrescribedBy} onChangeText={setMedPrescribedBy} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8 }} />
                <TextInput placeholder="Notes" value={medNotes} onChangeText={setMedNotes} multiline style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, minHeight: 80, textAlignVertical: 'top' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                  <Pressable onPress={() => setShowManualForm(false)} style={{ paddingVertical: 10, paddingHorizontal: 12, marginRight: 8 }}>
                    <Text>Back</Text>
                  </Pressable>
                  <Pressable onPress={addMed} style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#111', borderRadius: 8 }}>
                    <Text style={{ color: '#fff' }}>Save</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MedicationManageScreen;


