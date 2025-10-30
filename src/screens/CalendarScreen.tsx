import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';

const CalendarScreen = () => {
  const [events, setEvents] = React.useState<Calendar.Event[]>([]);
  const [defaultCalendarId, setDefaultCalendarId] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Calendar permission was not granted.');
        return;
      }
      const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCal = cals.find((c: any) => c.source && (c.source.name?.toLowerCase().includes('icloud') || c.source.isLocalAccount));
      const calId = (defaultCal?.id ?? cals[0]?.id) || null;
      setDefaultCalendarId(calId);

      const now = new Date();
      const in30d = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (calId) {
        const evts = await Calendar.getEventsAsync([calId], now, in30d);
        setEvents(evts);
      }
    })();
  }, []);

  const createQuickEvent = async () => {
    if (!defaultCalendarId) return;
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const id = await Calendar.createEventAsync(defaultCalendarId, {
      title: 'Healthcare Appointment',
      startDate: start,
      endDate: end,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notes: 'Created from ParentCare',
    } as any);
    if (id) {
      Alert.alert('Event created', 'A sample event was added to your calendar.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 18 }}>Upcoming (30 days)</Text>
        <TouchableOpacity onPress={createQuickEvent} style={{ backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Add Quick Event</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontWeight: '600' }}>{item.title || 'Untitled'}</Text>
            <Text style={{ color: '#555' }}>{new Date(item.startDate as any).toLocaleString()}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
    </View>
  );
};

export default CalendarScreen;
