import { useState } from 'react';

export default function CotacaoForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cotacoes, setCotacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarCotacoes = async () => {
    if (!startDate || !endDate) {
      alert('Por favor, preencha as duas datas!');
      return;
    }

    setLoading(true);
    setError('');
    setCotacoes([]);

    const dataInicio = startDate.replaceAll('-', '');
    const dataFim = endDate.replaceAll('-', '');

    try {
      const res = await fetch(
        `https://economia.awesomeapi.com.br/json/daily/USD-BRL/?start_date=${dataInicio}&end_date=${dataFim}`
      );

      if (!res.ok) throw new Error('Erro ao buscar cotações.');

      const dados = await res.json();
      setCotacoes(dados.reverse()); // Mostra da mais antiga para a mais nova
    } catch (err) {
      setError(err.message || 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Buscar Cotação USD/BRL</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Data Início:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: '1rem' }}
          />
        </label>
        <br /><br />
        <label>
          Data Fim:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: '1.9rem' }}
          />
        </label>
        <br /><br />
        <button onClick={buscarCotacoes} style={{ padding: '0.5rem 1rem' }}>
          Buscar
        </button>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cotacoes.length > 0 && (
        <div>
          <h2>Resultados:</h2>
          <ul>
            {cotacoes.map((item, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                <strong>Data:</strong> {new Date(item.timestamp * 1000).toLocaleDateString()}<br />
                <strong>Compra:</strong> R$ {item.bid}<br />
                <strong>Venda:</strong> R$ {item.ask}<br />
                <strong>Alta:</strong> R$ {item.high}<br />
                <strong>Baixa:</strong> R$ {item.low}<br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
