const localidades = [
  "Huambo", "Caála", "Bailundo", "Longonjo", "Londuimbali", 
  "Catchiungo", "Chicala-Choloanga", "Chinjenje"
];

const tabela = document.getElementById("dados"); 

localidades.forEach(loc => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
<td>${loc}</td>
<td><input type="number" step="0.01" class="demanda" readonly style="background-color: #f0f0f0;"></td>
<td><input type="number" step="0.01" class="utilizada" oninput="calcularDemanda(this)"></td>
<td>
  <input type="number" step="0.01" class="mt" oninput="calcularDemanda(this); toggleJustificativa(this)">
  <input type="text" class="just_mt" placeholder="Justificativa" style="display:none; width:100px">
</td>
<td>
  <input type="number" step="0.01" class="bt" oninput="calcularDemanda(this); toggleJustificativa(this)">
  <input type="text" class="just_bt" placeholder="Justificativa" style="display:none; width:100px">
</td>
<td>
  <input type="number" step="0.01" class="avaria_mt" oninput="calcularDemanda(this); toggleJustificativa(this)">
  <input type="text" class="just_av_mt" placeholder="Justificativa" style="display:none; width:100px">
</td>
<td>
  <input type="number" step="0.01" class="avaria_bt" oninput="calcularDemanda(this); toggleJustificativa(this)">
  <input type="text" class="just_av_bt" placeholder="Justificativa" style="display:none; width:100px">
</td>
`;
  tabela.appendChild(tr);
});

function calcularDemanda(input) {
  const linha = input.closest('tr');
  const demandaInput = linha.querySelector('.demanda');
  const utilizadaInput = linha.querySelector('.utilizada');
  const mtInput = linha.querySelector('.mt');
  const btInput = linha.querySelector('.bt');
  const avariaMtInput = linha.querySelector('.avaria_mt');
  const avariaBtInput = linha.querySelector('.avaria_bt');

  // Obter valores, defaulting para 0 se vazio
  const utilizada = parseFloat(utilizadaInput.value) || 0;
  const mt = parseFloat(mtInput.value) || 0;
  const bt = parseFloat(btInput.value) || 0;
  const avariaMt = parseFloat(avariaMtInput.value) || 0;
  const avariaBt = parseFloat(avariaBtInput.value) || 0;

  // Calcular demanda como soma de todos os componentes
  const demandaCalculada = utilizada + mt + bt + avariaMt + avariaBt;
  
  // Atualizar campo de demanda
  demandaInput.value = demandaCalculada.toFixed(2);
}

function gerarResumo() {
  let resumo = `DEM AT/ MT-RC\nDivisão de Despacho Huambo\nPonto de Situação Operativa da Província de Huambo\n${formatarDataCompleta()}\n\n\t\t${document.getElementById("hora").value}\n\n`;

  let totalDemanda = 0, totalUtilizada = 0, totalMT = 0, totalBT = 0, avariaMT = 0, avariaBT = 0;
  const linhas = tabela.querySelectorAll("tr");
  
  function formatarDataCompleta() {
      const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const hoje = new Date();
      const diaSemana = dias[hoje.getDay()];
      const dia = String(hoje.getDate()).padStart(2, '0');
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const ano = hoje.getFullYear();
      return `${diaSemana}, ${dia}-${mes}-${ano}`;
  }
    
  linhas.forEach(linha => {
    const tds = linha.querySelectorAll("td");
    if (!tds.length) return;
    
    const nome = tds[0].textContent;
    const demanda = parseFloat(tds[1].querySelector("input").value) || 0;
    const utilizada = parseFloat(tds[2].querySelector("input").value) || 0;
    const restrMT = parseFloat(tds[3].querySelector("input").value) || 0;
    const restrBT = parseFloat(tds[4].querySelector("input").value) || 0;
    const avMT = parseFloat(tds[5].querySelector("input").value) || 0;
    const avBT = parseFloat(tds[6].querySelector("input").value) || 0;
    
    // Calcular grau de atendimento baseado na demanda calculada
    const grau = (demanda === 0) ? 0 : ((utilizada / demanda) * 100).toFixed(2);

    const justMT = tds[3].querySelector(".just_mt").value;
    const justBT = tds[4].querySelector(".just_bt").value;
    const justAvMT = tds[5].querySelector(".just_av_mt").value;
    const justAvBT = tds[6].querySelector(".just_av_bt").value;

    resumo += `${nome}:\n`;
    resumo += `Demanda = ${demanda.toFixed(2)} MW\n`;
    resumo += `Pot. Utilizada = ${utilizada.toFixed(2)} MW\n`;
    resumo += `Restrição em MT = ${restrMT.toFixed(2)} MW${restrMT > 0 && justMT ? ` (${justMT})` : ""}\n`;
    resumo += `Restrição em BT = ${restrBT.toFixed(2)} MW${restrBT > 0 && justBT ? ` (${justBT})` : ""}\n`;
    resumo += `Avaria em MT = ${avMT.toFixed(2)} MW${avMT > 0 && justAvMT ? ` (${justAvMT})` : ""}\n`;
    resumo += `Avaria em BT = ${avBT.toFixed(2)} MW${avBT > 0 && justAvBT ? ` (${justAvBT})` : ""}\n`;
    resumo += `Grau de Atendi. = ${grau}%\n__________\n\n`;

    totalDemanda += demanda;
    totalUtilizada += utilizada;
    totalMT += restrMT;
    totalBT += restrBT;
    avariaMT += avMT;
    avariaBT += avBT;
  });

  const grauFinal = (totalDemanda === 0) ? 0 : ((totalUtilizada / totalDemanda) * 100).toFixed(2);
  resumo += `Demanda (Max) Total = ${totalDemanda.toFixed(2)} MW\nPot. Utilizada = ${totalUtilizada.toFixed(2)} MW\nPot. Restringida em MT = ${totalMT.toFixed(2)} MW\nPot. Restringida em BT = ${totalBT.toFixed(2)} MW\nPot. Avaria em MT = ${avariaMT.toFixed(2)} MW\nPot. Avaria em BT = ${avariaBT.toFixed(2)} MW\nGrau de Atendi. = ${grauFinal}%\n\nOperador(es): ${document.getElementById("operadores").value}\n\n\tDespacho - Huambo`;

  document.getElementById("output").value = resumo;
}

function copiarTexto() {
  const textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
  alert("Texto copiado para a área de transferência!");
}

function toggleJustificativa(input) {
  const value = parseFloat(input.value);
  const justificativaInput = input.nextElementSibling;
  if (value > 0) {
    justificativaInput.style.display = "inline";
  } else {
    justificativaInput.style.display = "none";
    justificativaInput.value = "";
  }
}

function gravarSituacao() {
  const dados = {};
  const linhas = tabela.querySelectorAll("tr");
  const agora = new Date();
  
  // Coletar dados de todas as localidades
  linhas.forEach(linha => {
    const tds = linha.querySelectorAll("td");
    if (!tds.length) return;
    
    const localidade = tds[0].textContent;
    dados[localidade] = {
      demanda: parseFloat(tds[1].querySelector("input").value) || 0,
      utilizada: parseFloat(tds[2].querySelector("input").value) || 0,
      restrMT: parseFloat(tds[3].querySelector("input").value) || 0,
      restrBT: parseFloat(tds[4].querySelector("input").value) || 0,
      avariaMT: parseFloat(tds[5].querySelector("input").value) || 0,
      avariaBT: parseFloat(tds[6].querySelector("input").value) || 0,
      justMT: tds[3].querySelector(".just_mt").value,
      justBT: tds[4].querySelector(".just_bt").value,
      justAvMT: tds[5].querySelector(".just_av_mt").value,
      justAvBT: tds[6].querySelector(".just_av_bt").value
    };
  });

  // Criar objeto com todos os dados da situação
  const situacao = {
    timestamp: agora.toISOString(),
    data: agora.toLocaleDateString('pt-PT'),
    hora: document.getElementById("hora").value,
    operadores: document.getElementById("operadores").value,
    localidades: dados
  };

  // Recuperar situações existentes
  let situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
  
  // Adicionar nova situação
  situacoes.push(situacao);
  
  // Manter apenas as últimas 50 situações para não sobrecarregar o storage
  if (situacoes.length > 50) {
    situacoes = situacoes.slice(-50);
  }
  
  // Salvar no localStorage
  localStorage.setItem('situacoesOperativas', JSON.stringify(situacoes));
  
  alert(`Situação operativa gravada com sucesso!\nData: ${situacao.data}\nHora: ${situacao.hora}`);
}

function eliminarSituacao() {
  if (confirm('Tem certeza que deseja eliminar TODAS as situações operativas gravadas?')) {
    localStorage.removeItem('situacoesOperativas');
    alert('Todas as situações operativas foram eliminadas!');
  }
}

function abrirGrafico() {
  // Verificar se existem dados gravados
  const situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
  if (situacoes.length === 0) {
    alert('Não existem situações operativas gravadas. Grave pelo menos uma situação antes de visualizar os gráficos.');
    return;
  }
  
  // Abrir página de análise gráfica
  window.open('analisegrafica.html', '_blank');
}