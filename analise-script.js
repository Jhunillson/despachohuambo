const localidades = [
    "Huambo", "Caála", "Bailundo", "Longonjo", "Londuimbali",
    "Catchiungo", "Chicala-Choloanga", "Chinjenje"
  ];
  
  const coresLocalidades = [
    '#dc143c', '#8b0000', '#ff6b6b', '#d32f2f',
    '#c62828', '#b71c1c', '#ff5722', '#e64a19'
  ];
  
  let chartInstances = [];
  
  function showToast(mensagem, tipo = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.innerText = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => { toast.remove(); }, 500);
    }, 3500);
  }
  
  function voltarPagina() {
    try { window.close(); } catch(e) {}
    setTimeout(() => { if (!window.closed) window.history.back(); }, 200);
  }
  
  function carregarDados() {
    const situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
    if (situacoes.length === 0) {
      document.getElementById('chartsContainer').innerHTML = `
        <div class="chart-container" style="grid-column:1/-1;">
          <div style="text-align:center; padding:30px; color:#666;">
            <h2>📊 Nenhum dado encontrado</h2>
            <p>Não existem situações operativas gravadas. Volte à página principal e grave pelo menos uma situação.</p>
          </div>
        </div>
      `;
      document.getElementById('statsInfo').innerHTML = '';
      return [];
    }
    const ultima = situacoes[situacoes.length - 1];
    document.getElementById('statsInfo').innerHTML = `
      <strong>📈 Estatísticas</strong> — Total de registros: <strong>${situacoes.length}</strong> &nbsp; | &nbsp;
      Última atualização: <strong>${ultima.data}</strong> às <strong>${ultima.hora}</strong>
    `;
    return situacoes;
  }
  
  function gerarGraficos() {
    const situacoes = carregarDados();
    if (!situacoes.length) return;
    chartInstances.forEach(c => c.destroy());
    chartInstances = [];
    const container = document.getElementById('chartsContainer');
    container.innerHTML = '';
    criarGraficoResumo(container, situacoes);
    localidades.forEach((loc, idx) => criarGraficoLocalidade(container, situacoes, loc, idx));
  }
  
  function criarGraficoResumo(container, situacoes) {
    const ultima = situacoes[situacoes.length - 1];
    const chartDiv = document.createElement('div');
    chartDiv.className = 'chart-container';
    chartDiv.style.gridColumn = '1 / -1';
    chartDiv.innerHTML = `
      <div class="chart-title">📊 Resumo Geral - Todas as Localidades (${ultima.data} - ${ultima.hora})</div>
      <canvas id="resumoChart"></canvas>
    `;
    container.appendChild(chartDiv);
  
    const labels = [], demandaData = [], utilizadaData = [];
    localidades.forEach(loc => {
      const d = ultima.localidades[loc];
      if (d && Number(d.demanda) > 0) {
        labels.push(loc);
        demandaData.push(d.demanda);
        utilizadaData.push(d.utilizada);
      }
    });
  
    const ctx = document.getElementById('resumoChart').getContext('2d');
    const gradDem = ctx.createLinearGradient(0,0,0,300);
    gradDem.addColorStop(0, 'rgba(220,20,60,0.95)');
    gradDem.addColorStop(1, 'rgba(220,20,60,0.45)');
    const gradUtil = ctx.createLinearGradient(0,0,0,300);
    gradUtil.addColorStop(0, 'rgba(139,0,0,0.95)');
    gradUtil.addColorStop(1, 'rgba(139,0,0,0.45)');
  
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Demanda (MW)', data: demandaData, backgroundColor: gradDem, borderColor: '#b71c1c', borderWidth: 1 },
          { label: 'Potência Utilizada (MW)', data: utilizadaData, backgroundColor: gradUtil, borderColor: '#4a0000', borderWidth: 1 }
        ]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 10 }, boxWidth: 12, padding: 6 }
          }
        }
      }
    });
    chartInstances.push(chart);
  }
  
  function criarGraficoLocalidade(container, situacoes, localidade, index) {
    const chartDiv = document.createElement('div');
    chartDiv.className = 'chart-container';
    chartDiv.innerHTML = `
      <div class="chart-title">⚡ ${localidade}</div>
      <canvas id="chart${index}"></canvas>
    `;
    container.appendChild(chartDiv);
  
    const labels = [], demanda = [], utilizada = [], restricoes = [], avarias = [];
    const ultimas = situacoes.slice(-10);
    ultimas.forEach(s => {
      const d = s.localidades[localidade] || {};
      labels.push(`${s.data}\n${s.hora}`);
      demanda.push(d.demanda || 0);
      utilizada.push(d.utilizada || 0);
      restricoes.push((d.restrMT || 0) + (d.restrBT || 0));
      avarias.push((d.avariaMT || 0) + (d.avariaBT || 0));
    });
  
    const ctx = document.getElementById(`chart${index}`).getContext('2d');
    const cor = coresLocalidades[index % coresLocalidades.length];
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Demanda', data: demanda, borderColor: cor, backgroundColor: cor+'33', fill: true, tension: 0.2 },
          { label: 'Potência Utilizada', data: utilizada, borderColor: '#000', backgroundColor: '#00000022', fill: false, tension: 0.15 },
          { label: 'Restrições', data: restricoes, borderColor: '#ff9800', backgroundColor: '#ff980033', fill: false, borderDash: [6,4] },
          { label: 'Avarias', data: avarias, borderColor: '#f44336', backgroundColor: '#f4433622', fill: false, borderDash: [10,6] }
        ]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 10 }, boxWidth: 12, padding: 6 }
          }
        }
      }
    });
    chartInstances.push(chart);
  }
  
  function atualizarGraficos(){ 
    gerarGraficos(); 
    showToast('Gráficos atualizados','success'); 
  }
  
  function exportarDados(){
    const situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
    if (!situacoes.length) { 
      showToast('Sem dados para exportar','error'); 
      return; 
    }
    let csv="Data,Hora,Localidade,Demanda,Utilizada,RestrMT,RestrBT,AvariaMT,AvariaBT\n";
    situacoes.forEach(s => {
      localidades.forEach(loc => {
        const d = s.localidades[loc];
        if (d) csv += `${s.data},${s.hora},${loc},${d.demanda},${d.utilizada},${d.restrMT},${d.restrBT},${d.avariaMT},${d.avariaBT}\n`;
      });
    });
    const link=document.createElement("a");
    link.href="data:text/csv;charset=utf-8,"+encodeURI(csv);
    link.download=`despacho_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link); 
    link.click(); 
    link.remove();
    showToast('Exportação concluída','success');
  }
  
  window.addEventListener('load', gerarGraficos);