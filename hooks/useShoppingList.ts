import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { ShoppingListResponse } from '@/models/shoppingList';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

export const useShoppingList = () => {
  const { t } = useTranslation();
  const [shoppingList, setShoppingList] = useState<ShoppingListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShoppingList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ShoppingListResponse>('/shopping_lists/me');
      setShoppingList(response.data);
      if (response.data.aisles.length === 0) {
        Toast.show({
          type: "info",
          text1: t("shoppingList.emptyToast.title"),
          text2: t("shoppingList.emptyToast.subtitle"),
        });
      }
    } catch (err) {
      Toast.show({type: "error", text1: t("error"), text2: t("shoppingList.error"),});
      //console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   fetchShoppingList();
  // }, [fetchShoppingList]);

  return { shoppingList, loading, generateList: fetchShoppingList };
};