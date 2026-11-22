// 1. Pegamos os elementos da tela usando os "id"s que criamos no HTML
const inputValorVenda = document.getElementById("valorVenda");
const inputTaxa = document.getElementById("taxaMaquininha");
const selectParcelas = document.getElementById("parcelas");
const selectQuemPaga = document.getElementById("quemPaga");
const btnCalcular = document.getElementById("btnCalcular");
const btnWhatsapp = document.getElementById("btnWhatsapp");

const areaResultado = document.getElementById("areaResultado");
const resValorFinal = document.getElementById("resValorFinal");
const resParcelas = document.getElementById("resParcelas");
const resLiquido = document.getElementById("resLiquido");
const resTaxaValor = document.getElementById("resTaxaValor");

// Guardará a última simulação para montar a mensagem do WhatsApp
let ultimaSimulacao = null;

// 2. Função auxiliar para formatar números no padrão brasileiro (R$ 1.234,56)
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// 3. Função principal que faz o cálculo
function calcularSimulacao() {
  // Converte o texto digitado nos inputs para número (Number)
  const valorBase = parseFloat(inputValorVenda.value);
  const taxaPercentual = parseFloat(inputTaxa.value) || 0;
  const numParcelas = parseInt(selectParcelas.value, 10);
  const quemPaga = selectQuemPaga.value;

  // Validação simples: garante que o usuário digitou um valor maior que zero
  if (isNaN(valorBase) || valorBase <= 0) {
    alert("Por favor, digite um valor de venda maior que zero.");
    inputValorVenda.focus();
    return;
  }

  if (taxaPercentual < 0 || taxaPercentual >= 100) {
    alert("Digite uma taxa percentual válida (entre 0% e 99%).");
    inputTaxa.focus();
    return;
  }

  const taxaDecimal = taxaPercentual / 100;

  let valorFinalCliente = 0;
  let valorLiquidoVendedor = 0;
  let valorTaxa = 0;

  if (quemPaga === "vendedor") {
    // Vendedor absorve a taxa: cliente paga o valor base, e a taxa é descontada dele
    valorFinalCliente = valorBase;
    valorTaxa = valorFinalCliente * taxaDecimal;
    valorLiquidoVendedor = valorFinalCliente - valorTaxa;
  } else {
    // Repassar taxa para o cliente: calculamos o valor final para que,
    // após o desconto da taxa percentual, o vendedor receba o valorBase desejado
    const divisor = 1 - taxaDecimal;
    valorFinalCliente = valorBase / divisor;
    valorLiquidoVendedor = valorBase;
    valorTaxa = valorFinalCliente - valorLiquidoVendedor;
  }

  const valorParcela = valorFinalCliente / numParcelas;

  // 4. Atualiza os textos na tela
  resValorFinal.textContent = formatarMoeda(valorFinalCliente);
  resParcelas.textContent = `${numParcelas}x de ${formatarMoeda(valorParcela)}`;
  resLiquido.textContent = formatarMoeda(valorLiquidoVendedor);
  resTaxaValor.textContent = formatarMoeda(valorTaxa);

  // Mostra o cartão de resultado removendo a classe "oculto"
  areaResultado.classList.remove("oculto");

  // Salva os dados para o botão do WhatsApp
  ultimaSimulacao = {
    valorFinalCliente,
    numParcelas,
    valorParcela,
    valorLiquidoVendedor,
    valorTaxa,
    quemPaga,
    taxaPercentual
  };
}

// 5. Função para enviar o resumo formatado no WhatsApp
function enviarParaWhatsapp() {
  if (!ultimaSimulacao) {
    alert("Faça uma simulação antes de enviar no WhatsApp.");
    return;
  }

  const { valorFinalCliente, numParcelas, valorParcela } = ultimaSimulacao;

  const mensagem =
    `*Resumo da Simulação*\n` +
    `• Valor total: *${formatarMoeda(valorFinalCliente)}*\n` +
    `• Parcelamento: *${numParcelas}x de ${formatarMoeda(valorParcela)}*`;

  // encodeURIComponent garante que acentos, emojis e espaços funcionem na URL
  const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsapp, "_blank", "noopener,noreferrer");
}

// 6. Liga os botões às funções quando o usuário clicar
btnCalcular.addEventListener("click", calcularSimulacao);
btnWhatsapp.addEventListener("click", enviarParaWhatsapp);