const localidades = [
  "Huambo", "Caála", "Bailundo", "Longonjo", "Londuimbali", 
  "Catchiungo", "Chicala-Choloanga", "Chinjenje"
];

const tabela = document.getElementById("dados"); 

// Função para formatar números com vírgula
function formatarNumero(numero, casasDecimais = 2) {
  return numero.toFixed(casasDecimais).replace('.', ',');
}

// Preenche tabela dinamicamente
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

  const utilizada = parseFloat(utilizadaInput.value) || 0;
  const mt = parseFloat(mtInput.value) || 0;
  const bt = parseFloat(btInput.value) || 0;
  const avariaMt = parseFloat(avariaMtInput.value) || 0;
  const avariaBt = parseFloat(avariaBtInput.value) || 0;

  const demandaCalculada = utilizada + mt + bt + avariaMt + avariaBt;

  // Animação ao atualizar
  demandaInput.value = demandaCalculada.toFixed(2);
  demandaInput.classList.add("highlight-update");
  setTimeout(() => demandaInput.classList.remove("highlight-update"), 600);
}

function gerarResumo() {
  const operadores = document.getElementById("operadores").value.trim();
  
  if (!operadores) {
    showToast("Por favor, insira pelo menos um nome no campo Operadores!", "error");
    return;
  }

  let resumo = `*DEM AT/ MT-RC*\n*Divisão de Despacho Huambo*\n*Ponto de Situação Operativa da Província de Huambo*\n*${formatarDataCompleta()}*\n\n\t\t*${document.getElementById("hora").value}*\n\n`;

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
    
    const grau = (demanda === 0) ? '0,00' : formatarNumero((utilizada / demanda) * 100);

    const justMT = tds[3].querySelector(".just_mt").value;
    const justBT = tds[4].querySelector(".just_bt").value;
    const justAvMT = tds[5].querySelector(".just_av_mt").value;
    const justAvBT = tds[6].querySelector(".just_av_bt").value;

    resumo += `*${nome}:*\n`;
    resumo += `Demanda = ${formatarNumero(demanda)} MW\n`;
    resumo += `Pot. Utilizada = ${formatarNumero(utilizada)} MW\n`;
    resumo += `Restrição em MT = ${formatarNumero(restrMT)} MW${restrMT > 0 && justMT ? ` (${justMT})` : ""}\n`;
    resumo += `Restrição em BT = ${formatarNumero(restrBT)} MW${restrBT > 0 && justBT ? ` (${justBT})` : ""}\n`;
    resumo += `Avaria em MT = ${formatarNumero(avMT)} MW${avMT > 0 && justAvMT ? ` (${justAvMT})` : ""}\n`;
    resumo += `Avaria em BT = ${formatarNumero(avBT)} MW${avBT > 0 && justAvBT ? ` (${justAvBT})` : ""}\n`;
    resumo += `Grau de Atendi. = ${grau}%\n__________\n\n`;

    totalDemanda += demanda;
    totalUtilizada += utilizada;
    totalMT += restrMT;
    totalBT += restrBT;
    avariaMT += avMT;
    avariaBT += avBT;
  });

  const grauFinal = (totalDemanda === 0) ? '0,00' : formatarNumero((totalUtilizada / totalDemanda) * 100);
  resumo += `Demanda (Max) Total = ${formatarNumero(totalDemanda)} MW\nPot. Utilizada = ${formatarNumero(totalUtilizada)} MW\nPot. Restringida em MT = ${formatarNumero(totalMT)} MW\nPot. Restringida em BT = ${formatarNumero(totalBT)} MW\nPot. Avaria em MT = ${formatarNumero(avariaMT)} MW\nPot. Avaria em BT = ${formatarNumero(avariaBT)} MW\nGrau de Atendi. = ${grauFinal}%\n\n*Operador(es):* *${document.getElementById("operadores").value}*\n\n\t*Despacho - Huambo*`;

  document.getElementById("output").value = resumo;
  showToast("Resumo gerado com sucesso!", "info");
}

function abrirSituacaoRC() {
  window.open('situacao-rc.html', '_blank');
}

function copiarEPartilhar() {
  const textarea = document.getElementById("output");
  const texto = textarea.value;
  
  if (!texto.trim()) {
    showToast("Gere primeiro o resumo antes de partilhar!", "error");
    return;
  }
  
  // Copia para área de transferência
  textarea.select();
  document.execCommand("copy");
  
  // Codifica o texto para URL
  const textoEncoded = encodeURIComponent(texto);
  
  // Abre WhatsApp Web/App com o texto
  const whatsappUrl = `https://api.whatsapp.com/send?text=${textoEncoded}`;
  
  // Abre em nova aba
  window.open(whatsappUrl, '_blank');
  
  showToast("Texto copiado e WhatsApp aberto para partilha!", "success");
}

function copiarTexto() {
  const textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
  showToast("Texto copiado para a área de transferência!", "success");
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

  const situacao = {
    timestamp: agora.toISOString(),
    data: agora.toLocaleDateString('pt-PT'),
    hora: document.getElementById("hora").value,
    operadores: document.getElementById("operadores").value,
    localidades: dados
  };

  let situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
  situacoes.push(situacao);
  if (situacoes.length > 50) {
    situacoes = situacoes.slice(-50);
  }
  localStorage.setItem('situacoesOperativas', JSON.stringify(situacoes));
  
  showToast(`Situação operativa gravada! (${situacao.data} - ${situacao.hora})`, "success");
}

function eliminarSituacao() {
  const situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
  
  if (situacoes.length === 0) {
    showToast('Não existem situações gravadas para eliminar!', "info");
    return;
  }

  // Cria modal para seleção
  criarModalEliminacao(situacoes);
}

function criarModalEliminacao(situacoes) {
  // Remove modal existente se houver
  const modalExistente = document.getElementById('modalEliminacao');
  if (modalExistente) modalExistente.remove();

  // Cria overlay do modal
  const overlay = document.createElement('div');
  overlay.id = 'modalEliminacao';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 10000; display: flex;
    align-items: center; justify-content: center; padding: 20px;
  `;

  // Cria conteúdo do modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white; border-radius: 8px; max-width: 600px; width: 100%;
    max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;

  // Cabeçalho do modal
  const header = document.createElement('div');
  header.style.cssText = `
    background: linear-gradient(135deg, #dc143c, #b71c1c); color: white;
    padding: 20px; border-radius: 8px 8px 0 0; position: sticky; top: 0;
  `;
  header.innerHTML = `
    <h3 style="margin: 0; font-size: 1.2rem;">🗑️ Eliminar Situações Operativas</h3>
    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 0.9rem;">Selecione as situações que deseja eliminar:</p>
  `;

  // Lista de situações
  const lista = document.createElement('div');
  lista.style.cssText = 'padding: 20px;';

  situacoes.forEach((situacao, index) => {
    const item = document.createElement('div');
    item.style.cssText = `
      border: 2px solid #eee; border-radius: 5px; margin-bottom: 10px;
      padding: 15px; cursor: pointer; transition: all 0.3s;
      background: white;
    `;
    
    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" id="situacao_${index}" style="width: 18px; height: 18px;">
        <label for="situacao_${index}" style="cursor: pointer; flex: 1;">
          <strong style="color: #dc143c;">${situacao.data} - ${situacao.hora}</strong><br>
          <span style="color: #666; font-size: 0.9rem;">
            Operadores: ${situacao.operadores || 'Não informado'}
          </span>
        </label>
      </div>
    `;

    // Hover effect
    item.addEventListener('mouseenter', () => {
      item.style.background = '#fff5f5';
      item.style.borderColor = '#dc143c';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = 'white';
      item.style.borderColor = '#eee';
    });

    // Click no item seleciona checkbox
    item.addEventListener('click', (e) => {
      if (e.target.type !== 'checkbox') {
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
      }
    });

    lista.appendChild(item);
  });

  // Botões de ação
  const acoes = document.createElement('div');
  acoes.style.cssText = `
    padding: 20px; border-top: 1px solid #eee; display: flex;
    gap: 10px; justify-content: flex-end; background: #f8f9fa;
    border-radius: 0 0 8px 8px;
  `;

  const btnFechar = document.createElement('button');
  btnFechar.textContent = 'Cancelar';
  btnFechar.style.cssText = `
    background: #6c757d; color: white; padding: 10px 20px;
    border: none; border-radius: 5px; cursor: pointer; font-weight: 500;
  `;
  btnFechar.onclick = () => overlay.remove();

  const btnEliminarSelecionadas = document.createElement('button');
  btnEliminarSelecionadas.textContent = 'Eliminar Selecionadas';
  btnEliminarSelecionadas.style.cssText = `
    background: linear-gradient(135deg, #dc143c, #b71c1c); color: white;
    padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;
  `;
  btnEliminarSelecionadas.onclick = () => eliminarSelecionadas(situacoes, overlay);

  const btnEliminarTodas = document.createElement('button');
  btnEliminarTodas.textContent = 'Eliminar Todas';
  btnEliminarTodas.style.cssText = `
    background: linear-gradient(135deg, #dc3545, #721c24); color: white;
    padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;
  `;
  btnEliminarTodas.onclick = () => {
    if (confirm('Tem certeza que deseja eliminar TODAS as situações operativas?')) {
      localStorage.removeItem('situacoesOperativas');
      showToast('Todas as situações foram eliminadas!', 'success');
      overlay.remove();
    }
  };

  acoes.appendChild(btnFechar);
  acoes.appendChild(btnEliminarSelecionadas);
  acoes.appendChild(btnEliminarTodas);

  // Monta modal
  modal.appendChild(header);
  modal.appendChild(lista);
  modal.appendChild(acoes);
  overlay.appendChild(modal);

  // Fecha modal ao clicar fora
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

function eliminarSelecionadas(situacoes, overlay) {
  const checkboxes = overlay.querySelectorAll('input[type="checkbox"]:checked');
  
  if (checkboxes.length === 0) {
    showToast('Selecione pelo menos uma situação para eliminar!', 'error');
    return;
  }

  if (!confirm(`Confirma a eliminação de ${checkboxes.length} situação(ões)?`)) {
    return;
  }

  // Coleta índices selecionados (em ordem decrescente para não afetar os índices)
  const indicesParaEliminar = [];
  checkboxes.forEach(checkbox => {
    const index = parseInt(checkbox.id.split('_')[1]);
    indicesParaEliminar.push(index);
  });

  // Elimina em ordem decrescente
  indicesParaEliminar.sort((a, b) => b - a);
  indicesParaEliminar.forEach(index => {
    situacoes.splice(index, 1);
  });

  // Salva no localStorage
  localStorage.setItem('situacoesOperativas', JSON.stringify(situacoes));
  
  showToast(`${checkboxes.length} situação(ões) eliminada(s) com sucesso!`, 'success');
  overlay.remove();
}

function abrirGrafico() {
  const situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
  if (situacoes.length === 0) {
    showToast('Não existem situações gravadas. Grave pelo menos uma antes de visualizar.', "error");
    return;
  }
  window.open('analisegrafica.html', '_blank');
}

function abrirEscala() {
  window.open('https://jhunillson.github.io/schedule/', '_blank');
  showToast('Abrindo a página de escala...', 'info');
}

// ---------- Sistema de Toasts ----------
function showToast(mensagem, tipo = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.innerText = mensagem;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}
