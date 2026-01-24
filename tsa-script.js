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
    const observacoes = document.getElementById("observacoes").value.trim();

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

    // Observações (se houver)
    if (observacoes) {
      resumo += `_*At.te:* ${observacoes}_\n`;
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
      observacoes: document.getElementById('observacoes').value,
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
    document.getElementById('observacoes').value = ultima.observacoes;
    
    // Carregar dados de cada subestação
    const subestacoes = ['benfica', 'caala', 'bailundo', 'camussamba', 'cuanova'];
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
