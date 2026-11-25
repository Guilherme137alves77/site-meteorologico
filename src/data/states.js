// 27 Brazilian states with capital coordinates (used for Open-Meteo queries).
// id matches IBGE "codarea" in the GeoJSON malha.
export const STATES = [
  { id: '11', sigla: 'RO', name: 'Rondônia', capital: 'Porto Velho', latitude: -8.7619, longitude: -63.9039 },
  { id: '12', sigla: 'AC', name: 'Acre', capital: 'Rio Branco', latitude: -9.9747, longitude: -67.81 },
  { id: '13', sigla: 'AM', name: 'Amazonas', capital: 'Manaus', latitude: -3.119, longitude: -60.0217 },
  { id: '14', sigla: 'RR', name: 'Roraima', capital: 'Boa Vista', latitude: 2.8235, longitude: -60.6758 },
  { id: '15', sigla: 'PA', name: 'Pará', capital: 'Belém', latitude: -1.4558, longitude: -48.5044 },
  { id: '16', sigla: 'AP', name: 'Amapá', capital: 'Macapá', latitude: 0.0349, longitude: -51.0694 },
  { id: '17', sigla: 'TO', name: 'Tocantins', capital: 'Palmas', latitude: -10.1689, longitude: -48.3317 },
  { id: '21', sigla: 'MA', name: 'Maranhão', capital: 'São Luís', latitude: -2.5307, longitude: -44.3068 },
  { id: '22', sigla: 'PI', name: 'Piauí', capital: 'Teresina', latitude: -5.0892, longitude: -42.8019 },
  { id: '23', sigla: 'CE', name: 'Ceará', capital: 'Fortaleza', latitude: -3.7172, longitude: -38.5433 },
  { id: '24', sigla: 'RN', name: 'Rio Grande do Norte', capital: 'Natal', latitude: -5.7945, longitude: -35.211 },
  { id: '25', sigla: 'PB', name: 'Paraíba', capital: 'João Pessoa', latitude: -7.1195, longitude: -34.845 },
  { id: '26', sigla: 'PE', name: 'Pernambuco', capital: 'Recife', latitude: -8.0476, longitude: -34.877 },
  { id: '27', sigla: 'AL', name: 'Alagoas', capital: 'Maceió', latitude: -9.6498, longitude: -35.7089 },
  { id: '28', sigla: 'SE', name: 'Sergipe', capital: 'Aracaju', latitude: -10.9472, longitude: -37.0731 },
  { id: '29', sigla: 'BA', name: 'Bahia', capital: 'Salvador', latitude: -12.9777, longitude: -38.5016 },
  { id: '31', sigla: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte', latitude: -19.9167, longitude: -43.9345 },
  { id: '32', sigla: 'ES', name: 'Espírito Santo', capital: 'Vitória', latitude: -20.3155, longitude: -40.3128 },
  { id: '33', sigla: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729 },
  { id: '35', sigla: 'SP', name: 'São Paulo', capital: 'São Paulo', latitude: -23.5505, longitude: -46.6333 },
  { id: '41', sigla: 'PR', name: 'Paraná', capital: 'Curitiba', latitude: -25.4284, longitude: -49.2733 },
  { id: '42', sigla: 'SC', name: 'Santa Catarina', capital: 'Florianópolis', latitude: -27.5954, longitude: -48.548 },
  { id: '43', sigla: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre', latitude: -30.0346, longitude: -51.2177 },
  { id: '50', sigla: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande', latitude: -20.4697, longitude: -54.6201 },
  { id: '51', sigla: 'MT', name: 'Mato Grosso', capital: 'Cuiabá', latitude: -15.601, longitude: -56.0974 },
  { id: '52', sigla: 'GO', name: 'Goiás', capital: 'Goiânia', latitude: -16.6869, longitude: -49.2648 },
  { id: '53', sigla: 'DF', name: 'Distrito Federal', capital: 'Brasília', latitude: -15.7939, longitude: -47.8828 },
];

export const STATES_BY_ID = Object.fromEntries(STATES.map((s) => [s.id, s]));
