// Função para formatar números com vírgula
function formatarNumero(numero, casasDecimais = 2) {
  return numero.toFixed(casasDecimais).replace('.', ',');
}

// Função principal de cálculo de demanda
function calcularDemanda(provincia) {
    try {
      const utilizada = parseFloat(document.getElementById(`${provincia}_utilizada`).value.replace(',', '.')) || 0;
      const restrMT = parseFloat(document.getElementById(`${provincia}_restr_mt`).value.replace(',', '.')) || 0;
      const restrBT = parseFloat(document.getElementById(`${provincia}_restr_bt`).value.replace(',', '.')) || 0;
      const avariaMT = parseFloat(document.getElementById(`${provincia}_avaria_mt`).value.replace(',', '.')) || 0;
      const avariaBT = parseFloat(document.getElementById(`${provincia}_avaria_bt`).value.replace(',', '.')) || 0;
  
      const demandaCalculada = utilizada + restrMT + restrBT + avariaMT + avariaBT;
      
      const demandaField = document.getElementById(`${provincia}_demanda`);
      if (demandaField) {
        demandaField.value = formatarNumero(demandaCalculada);
        
        // Animação visual
        demandaField.classList.add('highlight-update');
        setTimeout(() => demandaField.classList.remove('highlight-update'), 600);
      }
    } catch (error) {
      console.error(`Erro ao calcular demanda para ${provincia}:`, error);
    }
  }
  
  // Função para mostrar/esconder justificativas
  function toggleJustificativa(provincia, tipo) {
    try {
      const valorInput = document.getElementById(`${provincia}_${tipo}`);
      const justificativaInput = document.getElementById(`${provincia}_just_${tipo}`);
      
      if (valorInput && justificativaInput) {
        const valor = parseFloat(valorInput.value.replace(',', '.')) || 0;
        
        if (valor > 0) {
          justificativaInput.style.display = "block";
        } else {
          justificativaInput.style.display = "none";
          justificativaInput.value = "";
        }
      }
    } catch (error) {
      console.error(`Erro ao toggle justificativa para ${provincia}_${tipo}:`, error);
    }
  }
  
  // Voltar para página anterior
  function voltarPagina() {
    try { 
      window.close(); 
    } catch(e) {}
    setTimeout(() => { 
      if (!window.closed) window.history.back(); 
    }, 200);
  }
  
  // Carregar dados do Huambo da página principal
  function carregarDadosHuambo() {
    try {
      const situacoes = JSON.parse(localStorage.getItem('situacoesOperativas') || '[]');
      
      if (situacoes.length > 0) {
        const ultimaSituacao = situacoes[situacoes.length - 1];
        const localidades = ["Huambo", "Caála", "Bailundo", "Longonjo", "Londuimbali", "Catchiungo", "Chicala-Choloanga", "Chinjenje"];
        
        let totalUtilizada = 0, totalRestrMT = 0, totalRestrBT = 0, totalAvariaMT = 0, totalAvariaBT = 0;
        
        localidades.forEach(loc => {
          const dados = ultimaSituacao.localidades[loc];
          if (dados) {
            totalUtilizada += dados.utilizada || 0;
            totalRestrMT += dados.restrMT || 0;
            totalRestrBT += dados.restrBT || 0;
            totalAvariaMT += dados.avariaMT || 0;
            totalAvariaBT += dados.avariaBT || 0;
          }
        });
  
        const demandaHuambo = totalUtilizada + totalRestrMT + totalRestrBT + totalAvariaMT + totalAvariaBT;
  
        // Atualizar campos do Huambo (agora com vírgula)
        document.getElementById('huambo_demanda').value = formatarNumero(demandaHuambo);
        document.getElementById('huambo_utilizada').value = formatarNumero(totalUtilizada);
        document.getElementById('huambo_restr_mt').value = formatarNumero(totalRestrMT);
        document.getElementById('huambo_restr_bt').value = formatarNumero(totalRestrBT);
        document.getElementById('huambo_avaria_mt').value = formatarNumero(totalAvariaMT);
        document.getElementById('huambo_avaria_bt').value = formatarNumero(totalAvariaBT);
        document.getElementById('horaRC').value = ultimaSituacao.hora || '18h00';
  
        mostrarToast('Dados do Huambo carregados com sucesso!', 'success');
      } else {
        mostrarToast('Nenhuma situação gravada encontrada na página principal.', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do Huambo:', error);
      mostrarToast('Erro ao carregar dados do Huambo.', 'error');
    }
  }
  
  // Gerar relatório RC
  function gerarRelatorioRC() {
    const operadores = document.getElementById("operadoresRC").value.trim();
    
    if (!operadores) {
      mostrarToast("Por favor, insira o nome dos operadores!", "error");
      return;
    }
  
    try {
      const provincias = {
        "BENGUELA": obterDadosProvincia('benguela'),
        "BIÉ": obterDadosProvincia('bie'),
        "HUAMBO": obterDadosProvincia('huambo'),
        "CUANZA-SUL": obterDadosProvincia('cuanza')
      };
  
      const relatorio = construirRelatorio(provincias, operadores);
      document.getElementById("relatorioOutput").value = relatorio;
      mostrarToast("Relatório gerado com sucesso!", "success");
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      mostrarToast("Erro ao gerar relatório.", "error");
    }
  }
  
  // Obter dados de uma província
  function obterDadosProvincia(provincia) {
    return {
      demanda: parseFloat(document.getElementById(`${provincia}_demanda`).value.replace(',', '.')) || 0,
      utilizada: parseFloat(document.getElementById(`${provincia}_utilizada`).value.replace(',', '.')) || 0,
      restrMT: parseFloat(document.getElementById(`${provincia}_restr_mt`).value.replace(',', '.')) || 0,
      restrBT: parseFloat(document.getElementById(`${provincia}_restr_bt`).value.replace(',', '.')) || 0,
      avariaMT: parseFloat(document.getElementById(`${provincia}_avaria_mt`).value.replace(',', '.')) || 0,
      avariaBT: parseFloat(document.getElementById(`${provincia}_avaria_bt`).value.replace(',', '.')) || 0
    };
  }
  
  // Construir o relatório RC
  function construirRelatorio(provincias, operadores) {
    const dataCompleta = formatarDataCompleta();
    const hora = document.getElementById("horaRC").value;
    
    let relatorio = `*DEM*\n*AT/MT- RC*\n*DESPACHO DA REGIÃO CENTRO*\n *Situação Operativa Regional*\n *${dataCompleta}*\n *${hora}*\n______________\n`;
  
    // Adicionar cada província
    Object.keys(provincias).forEach(provincia => {
      const dados = provincias[provincia];
      const grau = (dados.demanda === 0) ? '100,00' : formatarNumero((dados.utilizada / dados.demanda) * 100);
      
      relatorio += `*${provincia}*\n`;
      relatorio += adicionarSeparador(provincia);
      relatorio += `Total Demanda = ${formatarNumero(dados.demanda)} MW\n`;
      relatorio += formatarDadosProvincia(provincia, dados, grau);
      relatorio += adicionarSeparadorFinal(provincia);
    });
  
    // Totais regionais
    const totais = calcularTotaisRegionais(provincias);
    const grauRegional = (totais.demanda === 0) ? '100,00' : formatarNumero((totais.utilizada / totais.demanda) * 100);
  
    relatorio += ` *TOTAL DA REGIÃO*\n___________________________________\n`;
    relatorio += `Total Demanda = ${formatarNumero(totais.demanda)} MW\n`;
    relatorio += `P.Total Utilizada = ${formatarNumero(totais.utilizada)} MW\n`;
    relatorio += `Restrição em MT = ${formatarNumero(totais.restrMT)} MW\n`;
    relatorio += `Restrição em BT = ${formatarNumero(totais.restrBT)} MW\n`;
    relatorio += `Total Avaria em MT = ${formatarNumero(totais.avariaMT)} MW\n`;
    relatorio += `Total Avaria em BT = ${formatarNumero(totais.avariaBT)} MW\n`;
    relatorio += `*Grau de Atendimento* = *${grauRegional}%*\n\n`;
    relatorio += `                    *Operadores*\n        *${operadores}*\n *Att., Despacho, ENDE - HUAMBO*`;
  
    return relatorio;
  }
  
  // Funções auxiliares para formatação do relatório
  function adicionarSeparador(provincia) {
    const separadores = {
      "BENGUELA": "________________________________\n",
      "BIÉ": "________________________________\n", 
      "HUAMBO": "_________________________________\n",
      "CUANZA-SUL": "__________________________________\n"
    };
    return separadores[provincia] || "________________________________\n";
  }
  
  function formatarDadosProvincia(provincia, dados, grau) {
    let texto = "";
    
    if (provincia === "BIÉ") {
      texto += `P.Total Utilizada = ${formatarNumero(dados.utilizada)} MW\n`;
      texto += `P.Restringida MT = ${formatarNumero(dados.restrMT)} MW\n`;
      texto += `P.Restringida BT = ${formatarNumero(dados.restrBT)} MW\n`;
      texto += `Total avaria em MT = ${formatarNumero(dados.avariaMT)} MW\n`;
      texto += `Total avaria em BT = ${formatarNumero(dados.avariaBT)} MW\n`;
      texto += `*Grau de atendimento = ${grau}%*\n`;
    } else if (provincia === "CUANZA-SUL") {
      texto += `P.Total Utilizada = ${formatarNumero(dados.utilizada)} MW\n`;
      texto += `P.Restringida em MT = ${formatarNumero(dados.restrMT)} MW\n`;
      texto += `P. Restringida em BT = ${formatarNumero(dados.restrBT)} MW\n`;
      texto += `Total avaria em MT = ${formatarNumero(dados.avariaMT)} MW\n`;
      texto += `Total avaria em BT = ${formatarNumero(dados.avariaBT)} MW\n`;
      texto += `*Grau de atendimento = ${grau}%*\n`;
    } else {
      texto += `P.Total Utilizada = ${formatarNumero(dados.utilizada)} MW\n`;
      texto += `P.Restringida em MT = ${formatarNumero(dados.restrMT)} MW\n`;
      texto += `P. Restringida em BT = ${formatarNumero(dados.restrBT)} MW\n`;
      texto += `Total Avaria em MT = ${formatarNumero(dados.avariaMT)} MW\n`;
      texto += `Total Avaria em BT = ${formatarNumero(dados.avariaBT)} MW\n`;
      texto += `*Grau de ${provincia === "BENGUELA" ? "Atendimento" : "atendimento"} = ${grau}%*\n`;
    }
    
    return texto;
  }
  
  function adicionarSeparadorFinal(provincia) {
    const separadores = {
      "BENGUELA": "________\n",
      "BIÉ": "______________\n",
      "HUAMBO": "_________________\n", 
      "CUANZA-SUL": "______________________\n"
    };
    return separadores[provincia] || "________\n";
  }
  
  function calcularTotaisRegionais(provincias) {
    let totais = {demanda: 0, utilizada: 0, restrMT: 0, restrBT: 0, avariaMT: 0, avariaBT: 0};
    
    Object.values(provincias).forEach(dados => {
      totais.demanda += dados.demanda;
      totais.utilizada += dados.utilizada;
      totais.restrMT += dados.restrMT;
      totais.restrBT += dados.restrBT;
      totais.avariaMT += dados.avariaMT;
      totais.avariaBT += dados.avariaBT;
    });
    
    return totais;
  }
  
  function formatarDataCompleta() {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const hoje = new Date();
    const diaSemana = dias[hoje.getDay()];
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = meses[hoje.getMonth()];
    const ano = hoje.getFullYear();
    return `${diaSemana}, ${dia} de ${mes} ${ano}`;
  }
  
  // Copiar e partilhar no WhatsApp
  function copiarEPartilharRC() {
    const textarea = document.getElementById("relatorioOutput");
    const texto = textarea.value;
    
    if (!texto.trim()) {
      mostrarToast("Gere primeiro o relatório antes de partilhar!", "error");
      return;
    }
    
    textarea.select();
    document.execCommand("copy");
    
    const textoEncoded = encodeURIComponent(texto);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${textoEncoded}`;
    
    window.open(whatsappUrl, '_blank');
    mostrarToast("Texto copiado e WhatsApp aberto!", "success");
  }
  
  // Copiar apenas texto
  function copiarTextoRC() {
    const textarea = document.getElementById("relatorioOutput");
    const texto = textarea.value;
    
    if (!texto.trim()) {
      mostrarToast("Gere primeiro o relatório antes de copiar!", "error");
      return;
    }
    
    textarea.select();
    document.execCommand("copy");
    mostrarToast("Texto copiado para a área de transferência!", "success");
  }
  
  // Salvar configuração
  function salvarConfiguracao() {
    try {
      const configuracao = {
        timestamp: new Date().toISOString(),
        data: new Date().toLocaleDateString('pt-PT'),
        hora: document.getElementById('horaRC').value,
        operadores: document.getElementById('operadoresRC').value,
        provincias: {
          benguela: obterTodosDadosProvincia('benguela'),
          bie: obterTodosDadosProvincia('bie'),
          cuanza: obterTodosDadosProvincia('cuanza')
        }
      };
  
      let configuracoes = JSON.parse(localStorage.getItem('configuracoesRC') || '[]');
      configuracoes.push(configuracao);
      
      if (configuracoes.length > 20) {
        configuracoes = configuracoes.slice(-20);
      }
      
      localStorage.setItem('configuracoesRC', JSON.stringify(configuracoes));
      mostrarToast('Configuração salva com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      mostrarToast('Erro ao salvar configuração.', 'error');
    }
  }
  
  function obterTodosDadosProvincia(provincia) {
    return {
      utilizada: document.getElementById(`${provincia}_utilizada`).value,
      restrMT: document.getElementById(`${provincia}_restr_mt`).value,
      restrBT: document.getElementById(`${provincia}_restr_bt`).value,
      avariaMT: document.getElementById(`${provincia}_avaria_mt`).value,
      avariaBT: document.getElementById(`${provincia}_avaria_bt`).value,
      justRestrMT: document.getElementById(`${provincia}_just_restr_mt`).value,
      justRestrBT: document.getElementById(`${provincia}_just_restr_bt`).value,
      justAvariaMT: document.getElementById(`${provincia}_just_avaria_mt`).value,
      justAvariaBT: document.getElementById(`${provincia}_just_avaria_bt`).value
    };
  }
  
  // Carregar configuração
  function carregarConfiguracao() {
    try {
      const configuracoes = JSON.parse(localStorage.getItem('configuracoesRC') || '[]');
      
      if (configuracoes.length === 0) {
        mostrarToast('Nenhuma configuração salva encontrada!', 'info');
        return;
      }
  
      const ultima = configuracoes[configuracoes.length - 1];
      
      // Carregar dados para cada província
      ['benguela', 'bie', 'cuanza'].forEach(provincia => {
        if (ultima.provincias[provincia]) {
          carregarDadosProvincia(provincia, ultima.provincias[provincia]);
          calcularDemanda(provincia);
          verificarJustificativas(provincia);
        }
      });
      
      document.getElementById('horaRC').value = ultima.hora;
      document.getElementById('operadoresRC').value = ultima.operadores;
      
      mostrarToast(`Configuração carregada! (${ultima.data} - ${ultima.hora})`, 'success');
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      mostrarToast('Erro ao carregar configuração.', 'error');
    }
  }
  
  function carregarDadosProvincia(provincia, dados) {
    document.getElementById(`${provincia}_utilizada`).value = dados.utilizada || '0,00';
    document.getElementById(`${provincia}_restr_mt`).value = dados.restrMT || '0,00';
    document.getElementById(`${provincia}_restr_bt`).value = dados.restrBT || '0,00';
    document.getElementById(`${provincia}_avaria_mt`).value = dados.avariaMT || '0,00';
    document.getElementById(`${provincia}_avaria_bt`).value = dados.avariaBT || '0,00';
    document.getElementById(`${provincia}_just_restr_mt`).value = dados.justRestrMT || '';
    document.getElementById(`${provincia}_just_restr_bt`).value = dados.justRestrBT || '';
    document.getElementById(`${provincia}_just_avaria_mt`).value = dados.justAvariaMT || '';
    document.getElementById(`${provincia}_just_avaria_bt`).value = dados.justAvariaBT || '';
  }
  
  function verificarJustificativas(provincia) {
    const tipos = ['restr_mt', 'restr_bt', 'avaria_mt', 'avaria_bt'];
    tipos.forEach(tipo => {
      toggleJustificativa(provincia, tipo);
    });
  }
  
  // Sistema de notificações Toast
  function mostrarToast(mensagem, tipo = "info") {
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
  
  // Inicialização quando a página carrega
  function inicializarPagina() {
    // Carregar dados do Huambo
    carregarDadosHuambo();
    
    // Calcular demandas iniciais
    const provincias = ['benguela', 'bie', 'cuanza'];
    provincias.forEach(provincia => {
      calcularDemanda(provincia);
      verificarJustificativas(provincia);
    });
    
    mostrarToast('Página carregada! Sistema pronto para uso.', 'info');
  }
  
  // Event listener para quando a página carregar
  window.addEventListener('load', inicializarPagina);
