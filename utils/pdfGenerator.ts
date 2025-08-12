import { ShoppingListResponse } from '@/models/shoppingList';
import { getAisleInfo } from '@/constants/aisles';
import { formatAmount } from '@/utils/clean';
import { TFunction } from 'i18next';

const INGREDIENT_IMAGE_BASE_URL = "https://img.spoonacular.com/ingredients_100x100/";


export const generatePdfHtml = (
  shoppingList: ShoppingListResponse, 
  logoBase64: string | null,
  t: TFunction,
  unitSystem: 'metric' | 'us'
): string => {

  const styles = `
    <style>
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        color: #333; 
        font-size: 11px;
        margin: 0;
      }
      @page { 
        margin: 35px 25px; 
      }
      .header { 
        display: flex; 
        align-items: center; 
        margin-bottom: 25px; 
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }
      .logo { 
        width: 45px; 
        height: 45px; 
        margin-right: 15px; 
      }
      .title { 
        font-size: 22px; 
        font-weight: 600; 
        color: #000;
        margin: 0;
      }
      .aisle-section { 
        margin-bottom: 20px; 
        page-break-inside: avoid; 
      }
      .aisle-title {
        font-size: 16px;
        font-weight: 500;
        background-color: #f4f5f7;
        padding: 10px 12px;
        border-radius: 8px;
        color: #1f2937;
        text-transform: capitalize;
      }
      ul { 
        list-style-type: none; 
        padding: 0; 
        margin: 8px 0 0 0;
      }
      li {
        display: flex;
        align-items: center;
        padding: 8px 5px;
        border-bottom: 1px solid #f3f4f6;
      }
      li:last-child {
        border-bottom: none;
      }
      .item-image {
        width: 35px;
        height: 35px;
        border-radius: 6px;
        background-color: #f9fafb;
        margin-right: 12px;
        object-fit: contain;
      }
      .item-name { 
        flex: 1;
        font-size: 13px; 
        text-transform: capitalize;
      }
      .item-measure { 
        font-size: 13px; 
        color: #4b5563;
        font-weight: 500;
        min-width: 80px;
        text-align: right;
      }
      .footer {
        position: fixed;
        bottom: -25px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10px;
        color: #9ca3af;
      }
    </style>
  `;

  const aislesHtml = shoppingList.aisles.map(aisle => {
    const { name: translatedAisleName } = getAisleInfo(aisle.aisle, t);
    const itemsHtml = aisle.items.map(item => {
      // Replicamos la lógica de selección de medida de tu componente
      const measure = item.measures?.[unitSystem] || item.measures?.metric || Object.values(item.measures)[0];
      const amount = measure ? formatAmount(measure.amount ?? 0) : formatAmount(item.amount ?? 0);
      const unitKey = measure?.unit || item.unit || '';
      const unit = t(`units.${unitKey}`, { defaultValue: unitKey }); // Usamos defaultValue para evitar errores si no hay traducción

      // Lógica para la imagen del ingrediente
      const imageUrl = item.image_filename ? `${INGREDIENT_IMAGE_BASE_URL}${item.image_filename}` : '';
      
      return `
        <li>
          <img src="${imageUrl}" class="item-image" onerror="this.style.display='none'" />
          <span class="item-name">${item.name}</span>
          <span class="item-measure">${amount} ${unit}</span>
        </li>
      `;
    }).join('');

    return `
      <div class="aisle-section">
        <div class="aisle-title">${translatedAisleName}</div>
        <ul>${itemsHtml}</ul>
      </div>
    `;
  }).join('');

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${t('shoppingList.title')}</title>
        ${styles}
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" class="logo" />` : ''}
          <h1 class="title">${t('shoppingList.title')}</h1>
        </div>
        ${aislesHtml}
        <div class="footer">
          ${t('shoppingList.generatedBy')} TuNombreDeApp
        </div>
      </body>
    </html>
  `;
};