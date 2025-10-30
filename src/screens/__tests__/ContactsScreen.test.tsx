import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContactsScreen from '../ContactsScreen';
import * as DeviceContacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('ContactsScreen', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));
  });

  it('adds a contact and persists it', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ContactsScreen />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'Dr. Smith');
    fireEvent.changeText(getByPlaceholderText('Role (doctor/family/caregiver/pharmacy/other)'), 'doctor');
    fireEvent.press(getByText('Add'));

    await waitFor(() => expect(queryByText('Dr. Smith')).toBeTruthy());
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('imports from device contacts when permission granted', async () => {
    (DeviceContacts.getContactsAsync as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: '1', name: 'Caregiver One', phoneNumbers: [{ number: '123' }] },
        { id: '2', name: 'Pharmacy A', emails: [{ email: 'a@pharm.com' }] }
      ]
    });

    const { getByText, findByText } = render(<ContactsScreen />);

    fireEvent.press(getByText('Import from Contacts'));

    expect(await findByText('Caregiver One')).toBeTruthy();
    expect(await findByText('Pharmacy A')).toBeTruthy();
  });
});
