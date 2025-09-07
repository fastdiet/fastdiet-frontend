import { useState, useCallback } from 'react';
import api from '@/utils/api';
import { ShoppingListResponse } from '@/models/shoppingList';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { handleApiError } from '@/utils/errorHandler';

const MIN_LOADING_DURATION = 500; 

export const useShoppingList = () => {
  const { t } = useTranslation();
  const [shoppingList, setShoppingList] = useState<ShoppingListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShoppingList = useCallback(async (servings: number) => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ShoppingListResponse>(
        '/shopping_lists/me',
        { params: { servings } }
      );
      setShoppingList(response.data);
      if (response.data.aisles.length === 0) {
        Toast.show({
          type: "info",
          text1: t("shoppingList.emptyToast.title"),
          text2: t("shoppingList.emptyToast.subtitle"),
        });
      }else {
        Toast.show({
            type: "success",
            text1: t("shoppingList.successToast.title"),
            text2: t("shoppingList.successToast.subtitle"),
        });
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      Toast.show({type: "error", text1: t("error"), text2: apiError.message,});
      //console.error(err);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADING_DURATION - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => setLoading(false), remainingTime);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // useEffect(() => {
  //   fetchShoppingList();
  // }, [fetchShoppingList]);

  return { shoppingList, loading, generateList: fetchShoppingList };
};