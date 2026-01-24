// Função para formatar números com vírgula
function formatarNumero(numero, casasDecimais = 2) {
  return numero.toFixed(casasDecimais).replace('.', ',');
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

// Obter valor do campo ou retornar "Indisponível"
function obterValor(id) {
  const valor = document.getElementById(id).value.trim();
  return valor || 'Indisponível';
}

// Formatar dados da SE
function formatarDadosSE(nome, sacc_v, sacc_a, saca_v, saca_a) {
  let texto = `*SE ${nome}*\n`;
  
  const saccV = obterValor(sacc_v);
  const saccA = obterValor(sacc_a);
  const sacaV = obterValor(saca_v);
  const sacaA = obterValor(saca_a);
  
  texto += `*S.A.C.C:* ${saccV} V / ${saccA} A\n`;
  texto += `*S.A.C.A:* ${sacaV} V / ${sacaA} A\n`;
  
  return texto;
}

// Verificar se uma SE tem todos os dados vazios
function seTemDadosVazios(prefixo) {
  const saccV = document.getElementById(`${prefixo}_sacc_v`).value.trim();
  const saccA = document.getElementById(`${prefixo}_sacc_a`).value.trim();
  const sacaV = document.getElementById(`${prefixo}_saca_v`).value.trim();
  const sacaA = document.getElementById(`${prefixo}_saca_a`).value.trim();
  
  return !saccV && !saccA && !sacaV && !sacaA;
}

// Gerar lista de SE's com dados indisponíveis
function gerarObservacaoAutomatica() {
  const subestacoes = [
    { id: 'benfica', nome: 'Benfica' },
    { id: 'caala', nome: 'Caála' },
    { id: 'centralidade', nome: 'Centralidade da Caála' },
    { id: 'bailundo', nome: 'Bailundo' },
    { id: 'camussamba', nome: 'Camussamba' },
    { id: 'cuanova', nome: 'Cuca Nova' },
    { id: 'cambiote', nome: 'Cambiote' },
    { id: 'catchiungo', nome: 'Catchiungo' }
  ];
  
  const sesIndisponiveis = [];
  
  subestacoes.forEach(se => {
    if (seTemDadosVazios(se.id)) {
      sesIndisponiveis.push(se.nome);
    }
  });
  
  if (sesIndisponiveis.length === 0) {
    return '';
  }
  
  if (sesIndisponiveis.length === 1) {
    return `_*At.te:* Os dados da SE ${sesIndisponiveis[0]} encontram-se indisponíveis_\n`;
  }
  
  // Formatar lista de SE's
  const ultimaSE = sesIndisponiveis.pop();
  const listaSEs = sesIndisponiveis.join(', ');
  
  return `_*At.te:* Os dados das SE's ${listaSEs} e ${ultimaSE} encontram-se indisponíveis_\n`;
}

// Gerar resumo TSA
function gerarResumoTSA() {
  const operadores = document.getElementById("operadoresTSA").value.trim();
  
  if (!operadores) {
    mostrarToast("Por favor, insira o nome dos operadores!", "error");
    return;
  }

  try {
    const dataCompleta = formatarDataCompleta();
    const hora = document.getElementById("horaTSA").value;

    let resumo = `*DEM AT/MT-RC, ENDE EP*\n`;
    resumo += `*CENTRO DE DESPACHO DA REGIÃO CENTRO*\n`;
    resumo += `_*${dataCompleta}*_\n`;
    resumo += `_*Saudações!*_\n`;
    resumo += `         *Resumo das ${hora} - TSA*\n`;
    resumo += `_____________________________________\n`;
    resumo += `             \n`;
    resumo += `               *HUAMBO*\n`;
    resumo += ` \n`;

    // SE Benfica
    resumo += formatarDadosSE(
      'Benfica',
      'benfica_sacc_v', 'benfica_sacc_a',
      'benfica_saca_v', 'benfica_saca_a'
    );

    // SE Caála
    resumo += formatarDadosSE(
      'Cáala',
      'caala_sacc_v', 'caala_sacc_a',
      'caala_saca_v', 'caala_saca_a'
    );

    // SE Centralidade da Caála
    resumo += formatarDadosSE(
      'Centralidade da Caála',
      'centralidade_sacc_v', 'centralidade_sacc_a',
      'centralidade_saca_v', 'centralidade_saca_a'
    );

    // SE Bailundo
    resumo += formatarDadosSE(
      'Bailundo',
      'bailundo_sacc_v', 'bailundo_sacc_a',
      'bailundo_saca_v', 'bailundo_saca_a'
    );

    // SE Camussamba
    resumo += formatarDadosSE(
      'Camussamba',
      'camussamba_sacc_v', 'camussamba_sacc_a',
      'camussamba_saca_v', 'camussamba_saca_a'
    );

    // SE Cuca Nova
    resumo += formatarDadosSE(
      'Cuca Nova',
      'cuanova_sacc_v', 'cuanova_sacc_a',
      'cuanova_saca_v', 'cuanova_saca_a'
    );

    // SE Cambiote
    resumo += formatarDadosSE(
      'Cambiote',
      'cambiote_sacc_v', 'cambiote_sacc_a',
      'cambiote_saca_v', 'cambiote_saca_a'
    );

    // SE Catchiungo
    resumo += formatarDadosSE(
      'Catchiungo',
      'catchiungo_sacc_v', 'catchiungo_sacc_a',
      'catchiungo_saca_v', 'catchiungo_saca_a'
    );

    // Gerar observação automática sobre SE's sem dados
    const observacao = gerarObservacaoAutomatica();
    if (observacao) {
      resumo += observacao;
    }

    resumo += `_____________________________________\n`;
    resumo += `     _*Operador / Manobrador:*_\n`;
    resumo += `_*${operadores}*_`;

    document.getElementById("resumoOutput").value = resumo;
    mostrarToast("Resumo TSA gerado com sucesso!", "success");
    
  } catch (error) {
    console.error('Erro ao gerar resumo TSA:', error);
    mostrarToast("Erro ao gerar resumo TSA.", "error");
  }
}

// Formatar data completa
function formatarDataCompleta() {
  const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const hoje = new Date();
  const diaSemana = dias[hoje.getDay()];
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${diaSemana}, ${dia}-${mes}-${ano}`;
}

// Copiar e partilhar no WhatsApp
function copiarEPartilharTSA() {
  const textarea = document.getElementById("resumoOutput");
  const texto = textarea.value;
  
  if (!texto.trim()) {
    mostrarToast("Gere primeiro o resumo antes de partilhar!", "error");
    return;
  }
  
  textarea.select();
  document.execCommand("copy");
  
  const textoEncoded = encodeURIComponent(texto);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${textoEncoded}`;
  
  window.open(whatsappUrl, '_blank');
  mostrarToast("Texto copiado e WhatsApp aberto!", "success");
}

// Salvar configuração
function salvarConfiguracaoTSA() {
  try {
    const configuracao = {
      timestamp: new Date().toISOString(),
      data: new Date().toLocaleDateString('pt-PT'),
      hora: document.getElementById('horaTSA').value,
      operadores: document.getElementById('operadoresTSA').value,
      subestacoes: {
        benfica: {
          sacc_v: document.getElementById('benfica_sacc_v').value,
          sacc_a: document.getElementById('benfica_sacc_a').value,
          saca_v: document.getElementById('benfica_saca_v').value,
          saca_a: document.getElementById('benfica_saca_a').value
        },
        caala: {
          sacc_v: document.getElementById('caala_sacc_v').value,
          sacc_a: document.getElementById('caala_sacc_a').value,
          saca_v: document.getElementById('caala_saca_v').value,
          saca_a: document.getElementById('caala_saca_a').value
        },
        centralidade: {
          sacc_v: document.getElementById('centralidade_sacc_v').value,
          sacc_a: document.getElementById('centralidade_sacc_a').value,
          saca_v: document.getElementById('centralidade_saca_v').value,
          saca_a: document.getElementById('centralidade_saca_a').value
        },
        bailundo: {
          sacc_v: document.getElementById('bailundo_sacc_v').value,
          sacc_a: document.getElementById('bailundo_sacc_a').value,
          saca_v: document.getElementById('bailundo_saca_v').value,
          saca_a: document.getElementById('bailundo_saca_a').value
        },
        camussamba: {
          sacc_v: document.getElementById('camussamba_sacc_v').value,
          sacc_a: document.getElementById('camussamba_sacc_a').value,
          saca_v: document.getElementById('camussamba_saca_v').value,
          saca_a: document.getElementById('camussamba_saca_a').value
        },
        cuanova: {
          sacc_v: document.getElementById('cuanova_sacc_v').value,
          sacc_a: document.getElementById('cuanova_sacc_a').value,
          saca_v: document.getElementById('cuanova_saca_v').value,
          saca_a: document.getElementById('cuanova_saca_a').value
        },
        cambiote: {
          sacc_v: document.getElementById('cambiote_sacc_v').value,
          sacc_a: document.getElementById('cambiote_sacc_a').value,
          saca_v: document.getElementById('cambiote_saca_v').value,
          saca_a: document.getElementById('cambiote_saca_a').value
        },
        catchiungo: {
          sacc_v: document.getElementById('catchiungo_sacc_v').value,
          sacc_a: document.getElementById('catchiungo_sacc_a').value,
          saca_v: document.getElementById('catchiungo_saca_v').value,
          saca_a: document.getElementById('catchiungo_saca_a').value
        }
      }
    };

    let configuracoes = JSON.parse(localStorage.getItem('configuracoesTSA') || '[]');
    configuracoes.push(configuracao);
    
    if (configuracoes.length > 20) {
      configuracoes = configuracoes.slice(-20);
    }
    
    localStorage.setItem('configuracoesTSA', JSON.stringify(configuracoes));
    mostrarToast('Configuração TSA salva com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao salvar configuração TSA:', error);
    mostrarToast('Erro ao salvar configuração.', 'error');
  }
}

// Carregar configuração
function carregarConfiguracaoTSA() {
  try {
    const configuracoes = JSON.parse(localStorage.getItem('configuracoesTSA') || '[]');
    
    if (configuracoes.length === 0) {
      mostrarToast('Nenhuma configuração TSA salva encontrada!', 'info');
      return;
    }

    const ultima = configuracoes[configuracoes.length - 1];
    
    // Carregar dados gerais
    document.getElementById('horaTSA').value = ultima.hora;
    document.getElementById('operadoresTSA').value = ultima.operadores;
    
    // Carregar dados de cada subestação
    const subestacoes = ['benfica', 'caala', 'centralidade', 'bailundo', 'camussamba', 'cuanova', 'cambiote', 'catchiungo'];
    subestacoes.forEach(se => {
      if (ultima.subestacoes[se]) {
        document.getElementById(`${se}_sacc_v`).value = ultima.subestacoes[se].sacc_v || '';
        document.getElementById(`${se}_sacc_a`).value = ultima.subestacoes[se].sacc_a || '';
        document.getElementById(`${se}_saca_v`).value = ultima.subestacoes[se].saca_v || '';
        document.getElementById(`${se}_saca_a`).value = ultima.subestacoes[se].saca_a || '';
      }
    });
    
    mostrarToast(`Configuração TSA carregada! (${ultima.data} - ${ultima.hora})`, 'success');
  } catch (error) {
    console.error('Erro ao carregar configuração TSA:', error);
    mostrarToast('Erro ao carregar configuração.', 'error');
  }
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
function inicializarPaginaTSA() {
  mostrarToast('Página TSA carregada! Sistema pronto para uso.', 'info');
}

// Event listener para quando a página carregar
window.addEventListener('load', inicializarPaginaTSA);
