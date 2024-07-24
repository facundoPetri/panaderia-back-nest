import hbs from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

const formatDate = (initialDate: string) => {
  if (!initialDate) return '';
  const date = new Date(initialDate);
  const dateFormat = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  return dateFormat;
};

hbs.registerHelper('formatDate', formatDate);
hbs.registerHelper('today', function () {
  const today = new Date();
  return today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

export const generatePdf = ({ title, user, data, headers, tableTemplate }) => {
  const templateHtml = readFileSync(
    join(process.cwd(), 'views/index.hbs'),
    'utf8',
  );
  const tableTemplateHtml = readFileSync(
    join(process.cwd(), `views/${tableTemplate}.hbs`),
    'utf8',
  );

  hbs.registerPartial('tableBody', tableTemplateHtml);

  const template = hbs.compile(templateHtml);
  const html = template({
    title,
    user,
    data,
    headers,
  });

  return html;
};
