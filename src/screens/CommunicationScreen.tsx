import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Message } from '../models/Message';
import { getItem, updateList } from '../storage/storage';

const MSG_KEY = 'messages';

const CommunicationScreen = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [draft, setDraft] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const data = await getItem<Message[]>(MSG_KEY, []);
      setMessages(data);
    })();
  }, []);

  const send = async () => {
    if (!draft.trim()) return;
    const newMsg: Message = { id: String(Date.now()), sender: 'primary', text: draft.trim(), timestampISO: new Date().toISOString() };
    const next = await updateList<Message>(MSG_KEY, (items) => [newMsg, ...items]);
    setMessages(next);
    setDraft('');
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        inverted
        style={{ flex: 1, padding: 16 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text style={{ fontWeight: '600' }}>{item.sender}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
      <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: '#eee', flexDirection: 'row' }}>
        <TextInput
          placeholder="Type a message..."
          value={draft}
          onChangeText={setDraft}
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginRight: 8 }}
        />
        <TouchableOpacity onPress={send} style={{ backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommunicationScreen;
