import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as DeviceContacts from 'expo-contacts';
import { Contact } from '../models/Contact';
import { getItem, updateList } from '../storage/storage';

const STORAGE_KEY = 'contacts';

const ContactsScreen = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState<Contact['role']>('other');

  React.useEffect(() => {
    (async () => {
      const data = await getItem<Contact[]>(STORAGE_KEY, []);
      setContacts(data);
    })();
  }, []);

  const addContact = async () => {
    if (!name.trim()) return;
    const newItem: Contact = { id: String(Date.now()), name: name.trim(), role };
    const next = await updateList<Contact>(STORAGE_KEY, (items) => [newItem, ...items]);
    setContacts(next);
    setName('');
    setRole('other');
  };

  const deleteContact = async (id: string) => {
    const next = await updateList<Contact>(STORAGE_KEY, (items) => items.filter((c) => c.id !== id));
    setContacts(next);
  };

  const importFromDevice = async () => {
    const { status } = await DeviceContacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Contacts permission was not granted.');
      return;
    }
    const { data } = await DeviceContacts.getContactsAsync({ fields: [DeviceContacts.Fields.PhoneNumbers, DeviceContacts.Fields.Emails] });
    if (!data || data.length === 0) {
      Alert.alert('No contacts', 'No device contacts found.');
      return;
    }
    const mapped: Contact[] = data.slice(0, 20).map((dc) => ({
      id: `${Date.now()}-${dc.id}`,
      name: dc.name ?? 'Unknown',
      role: 'other',
      phone: (dc as any).phoneNumbers?.[0]?.number,
      email: (dc as any).emails?.[0]?.email,
    }));
    const next = await updateList<Contact>(STORAGE_KEY, (items) => [...mapped, ...items]);
    setContacts(next);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Contacts</Text>

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginRight: 8 }}
        />
        <TextInput
          placeholder="Role (doctor/family/caregiver/pharmacy/other)"
          value={role}
          onChangeText={(v) => setRole((v as Contact['role']) || 'other')}
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40 }}
        />
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity onPress={addContact} style={{ backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginRight: 8 }}>
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={importFromDevice} style={{ backgroundColor: '#555', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Import from Contacts</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ color: '#555' }}>{item.role}</Text>
            {item.phone ? <Text>{item.phone}</Text> : null}
            {item.email ? <Text>{item.email}</Text> : null}
            <TouchableOpacity onPress={() => deleteContact(item.id)} style={{ marginTop: 6 }}>
              <Text style={{ color: '#c00' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
    </View>
  );
};

export default ContactsScreen;
