import { useState } from 'react';
import styles from '../styles/Home.module.css';

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
      setCotacoes(dados.reverse());
    } catch (err) {
      setError(err.message || 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Buscar Cotação USD/BRL</h1>

        <label className={styles.label}>
          Data Início:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Data Fim:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.input}
          />
        </label>

        <button onClick={buscarCotacoes} className={styles.button}>
          Buscar
        </button>

        {loading && <p className={styles.loading}>Carregando...</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>

      {cotacoes.length > 0 && (
        <div className={styles.resultBox}>
          <h2 className={styles.subtitle}>Resultados:</h2>
          <ul className={styles.resultList}>
            {cotacoes.map((item, index) => (
              <li key={index} className={styles.resultItem}>
                <p><strong>Data:</strong> {new Date(item.timestamp * 1000).toLocaleDateString()}</p>
                <p><strong>Compra:</strong> R$ {item.bid}</p>
                <p><strong>Venda:</strong> R$ {item.ask}</p>
                <p><strong>Alta:</strong> R$ {item.high}</p>
                <p><strong>Baixa:</strong> R$ {item.low}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
