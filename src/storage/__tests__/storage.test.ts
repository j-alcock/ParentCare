import { saveItem, getItem, updateList } from '../../storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('storage utils', () => {
  beforeEach(() => {
    (AsyncStorage.setItem as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
  });

  it('saveItem writes JSON to AsyncStorage', async () => {
    await saveItem('k', { a: 1 });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('k', JSON.stringify({ a: 1 }));
  });

  it('getItem returns fallback when missing', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const res = await getItem('k', 123);
    expect(res).toBe(123);
  });

  it('updateList updates and persists list', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([{ id: '1' }]));
    const res = await updateList<{ id: string }>('k', (items) => [{ id: '2' }, ...items]);
    expect(res).toEqual([{ id: '2' }, { id: '1' }]);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
