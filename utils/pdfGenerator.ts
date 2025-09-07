import { ShoppingListResponse } from '@/models/shoppingList';
import { getAisleInfo } from '@/constants/aisles';
import { formatAmount } from '@/utils/clean';
import { TFunction } from 'i18next';
import { pdfStyles } from '@/styles/pdf';

const INGREDIENT_IMAGE_BASE_URL = "https://img.spoonacular.com/ingredients_100x100/";

interface PdfGeneratorProps {
  shoppingList: ShoppingListResponse;
  logoBase64: string | null;
  t: TFunction;
  unitSystem: 'metric' | 'us';
  userName?: string;
  menuDates: { startDate: string; endDate: string };
}

export const generatePdfHtml = ({
  shoppingList,
  logoBase64,
  t,
  unitSystem,
  userName,
  menuDates,
}: PdfGeneratorProps): string => {

  const styles = `
  <style>
    @page { 
      margin: 15mm 10mm 15mm 10mm;
      background-color: ${pdfStyles.colors.backgroundBody};
    }
    body { 
      font-family: ${pdfStyles.fontFamily};
      color: ${pdfStyles.colors.textMedium};
      background-color: ${pdfStyles.colors.backgroundBody};
      font-size: 10px;
      margin: 0;
      padding: 15px;
      padding-bottom: 40px; 
    }
    .header { 
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding-bottom: 16px;
      border-bottom: 1px solid ${pdfStyles.colors.border};
      margin-bottom: 20px;
    }
    .header-logo {
      flex-shrink: 0;
      width: 100px; 
      height: 100px;
      margin-right: 20px;
      border-radius: 8px;
      object-fit: contain;
    }
    .header-info {
     flex: 1;
    }
    .header-title { 
        font-family: 'InterBold', ${pdfStyles.fontFamily};
        font-size: 27px;
        font-weight: 700;
        color: ${pdfStyles.colors.textDark};
        margin: 0 0 6px 0;
    }

    .header-subtitle {
        font-size: 17px;
        color: ${pdfStyles.colors.textMedium};
        margin: 5px 0;
    }
    
    .intro-text {
      font-size: 17px;
      max-width: 85%;
      line-height: 1.8;
      color: ${pdfStyles.colors.textMedium};
      margin-bottom: 12px;
    }
    
    .main-container {
      display: table; width: 100%;
      border-spacing: 12px 0;
      table-layout: fixed;
    }
    .column { display: table-cell; vertical-align: top; width: 50%; }
    .aisle-section {
        break-inside: avoid;
        background-color: ${pdfStyles.colors.backgroundCard};
        border: 1px solid ${pdfStyles.colors.border};
        border-radius: 8px;
        margin-bottom: 12px;
        padding: 10px 12px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    .aisle-title {
      display: flex; align-items: center;
      font-family: 'InterSemiBold', ${pdfStyles.fontFamily};
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 8px; margin-bottom: 8px;
      border-bottom: 2px solid ${pdfStyles.colors.border}; 
      color: ${pdfStyles.colors.primary};
    }
    .aisle-icon { font-size: 16px; margin-right: 8px; }
    ul { list-style-type: none; padding: 0; margin: 0; }
    li {
      display: flex; align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid ${pdfStyles.colors.borderLight};
    }
    li:last-child { border-bottom: none; }
    .item-image {
      width: 24px; height: 24px;
      border-radius: 5px; margin-right: 8px;
      object-fit: cover;
      flex-shrink: 0;
      background-color: #f0f0f0;
    }
    .item-name { 
      flex: 1;
      font-family: 'InterMedium', ${pdfStyles.fontFamily};
      font-weight: 500;
      font-size: 14px; 
      line-height: 1.8;
      text-transform: capitalize;
    }
    .item-measure { 
      font-family: 'InterSemiBold', ${pdfStyles.fontFamily};
      font-weight: 600;
      font-size: 13.5px; 
      color: ${pdfStyles.colors.textMedium};
      padding-left: 8px;
      text-align: right; white-space: nowrap;
    }
  </style>
`;

  const leftColumnAisles: typeof shoppingList.aisles = [];
  const rightColumnAisles: typeof shoppingList.aisles = [];
  let leftCount = 0;
  let rightCount = 0;

  shoppingList.aisles.forEach(aisle => {
    const itemCount = aisle.items.length;
    if (leftCount <= rightCount) {
      leftColumnAisles.push(aisle);
      leftCount += itemCount;
    } else {
      rightColumnAisles.push(aisle);
      rightCount += itemCount;
    }
  });

  const renderColumn = (aisles: typeof shoppingList.aisles) => {
    return aisles.map(aisle => {
      const { name: translatedAisleName, icon } = getAisleInfo(aisle.aisle, t);
      
      const itemsHtml = aisle.items.map(item => {
        const measure = item.measures?.[unitSystem] || item.measures?.metric || Object.values(item.measures)[0];
        const amount = measure ? formatAmount(measure.amount ?? 0) : formatAmount(item.amount ?? 0);
        const unitKey = measure?.unit || item.unit || '';
        const unit = t(`units.${unitKey}`, { defaultValue: unitKey });
        const imageUrl = item.image_filename ? `${INGREDIENT_IMAGE_BASE_URL}${item.image_filename}` : '';
        
        return `
          <li>
            ${imageUrl ? `<img src="${imageUrl}" class="item-image" onerror="this.style.visibility='hidden'"/>` : `<div class="item-image"></div>`}
            <span class="item-name">${item.name}</span>
            <span class="item-measure">${amount} ${unit}</span>
          </li>
        `;
      }).join('');

      return `
        <div class="aisle-section">
          <div class="aisle-title">
            <span class="aisle-icon">${icon}</span>
            <span>${translatedAisleName}</span>
          </div>
          <ul>${itemsHtml}</ul>
        </div>
      `;
    }).join('');
  };

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${t('shoppingList.pdf.filename', { date: '' })}</title>
        ${styles}
      </head>
      <body>

       <header class="header">
            ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" />` : ''}
            <div class="header-info">
                <h1 class="header-title">${t('shoppingList.title')}</h1>
                ${userName ? `<p class="header-subtitle">${t('shoppingList.pdf.forUser', { name: userName })}</p>` : ''}
                <p class="header-subtitle">
                ${t('shoppingList.pdf.weekOf', { startDate: menuDates.startDate, endDate: menuDates.endDate })}
                </p>
                <p class="header-subtitle">
                ${t('shoppingList.pdf.generatedBy')} FastDiet · ${new Date().toLocaleDateString()}
                </p>
            </div>
        </header>

        <p class="intro-text">
          ${t('shoppingList.pdf.introHello', { name: userName || t('user.defaultName', 'compañero/a') })}
        </p>
        <p class="intro-text">
          ${t('shoppingList.pdf.introText')}
        </p>

        <div class="main-container">
          <div class="column">${renderColumn(leftColumnAisles)}</div>
          <div class="column">${renderColumn(rightColumnAisles)}</div>
        </div>
      </body>
    </html>
  `;
};
