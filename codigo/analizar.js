// Recalcula la comparación del benchmark sin dependencias externas.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const lines = fs.readFileSync(path.join(dataDir, 'vacantes.csv'), 'utf8').trim().split(/\r?\n/);
const headers = lines[0].split(',');
const rows = lines.slice(1).map(line => {
  const values = line.split(',');
  return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
});

for (const row of rows) {
  row.clase_real = Number(row.clase_real);
  row.baseline = Number(/remote|remoto/i.test(row.ubicacion));
  row.mejorado = Number(/^(colombia only|open worldwide)$/i.test(row.etiqueta_elegibilidad));
}

const metricas = { n: rows.length, positive: rows.filter(row => row.clase_real === 1).length };
for (const regla of ['baseline', 'mejorado']) {
  const tp = rows.filter(row => row[regla] === 1 && row.clase_real === 1).length;
  const fp = rows.filter(row => row[regla] === 1 && row.clase_real === 0).length;
  const fn = rows.filter(row => row[regla] === 0 && row.clase_real === 1).length;
  const tn = rows.filter(row => row[regla] === 0 && row.clase_real === 0).length;
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const accuracy = (tp + tn) / rows.length;
  const f1 = 2 * precision * recall / (precision + recall);
  metricas[regla] = { tp, fp, fn, tn, precision, recall, accuracy, f1 };
}

const outputHeaders = [...headers, 'baseline', 'mejorado'];
const csv = [outputHeaders.join(','), ...rows.map(row => outputHeaders.map(header => row[header]).join(','))].join('\n') + '\n';
fs.writeFileSync(path.join(dataDir, 'resultados.csv'), csv, 'utf8');
fs.writeFileSync(path.join(dataDir, 'metricas.json'), JSON.stringify(metricas, null, 2) + '\n', 'utf8');
process.stdout.write(`${JSON.stringify(metricas, null, 2)}\n`);
