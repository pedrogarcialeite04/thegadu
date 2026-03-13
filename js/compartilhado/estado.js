import { apiProdutos, apiSaidas } from './api.js';

let listaProdutos = [];
let listaSaidas   = [];
let indiceEdicao  = null;
let carregado     = false;

export function obterProdutos() { return listaProdutos; }
export function obterSaidas() { return listaSaidas; }
export function obterIndiceEdicao() { return indiceEdicao; }
export function definirIndiceEdicao(valor) { indiceEdicao = valor; }

export async function carregarProdutos() {
    try {
        const resposta = await apiProdutos.listar();
        listaProdutos = resposta.dados;
        return listaProdutos;
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        return listaProdutos;
    }
}

export async function carregarSaidas() {
    try {
        const resposta = await apiSaidas.listar();
        listaSaidas = resposta.dados;
        return listaSaidas;
    } catch (erro) {
        console.error('Erro ao carregar saídas:', erro);
        return listaSaidas;
    }
}

export async function carregarDados() {
    await Promise.all([carregarProdutos(), carregarSaidas()]);
    carregado = true;
}

export function dadosCarregados() { return carregado; }

export async function salvarNovoProduto(produto) {
    const resposta = await apiProdutos.criar(produto);
    await carregarProdutos();
    return resposta;
}

export async function atualizarProdutoAPI(codigo, dados) {
    const resposta = await apiProdutos.atualizar(codigo, dados);
    await carregarProdutos();
    return resposta;
}

export async function excluirProdutoAPI(codigo) {
    const resposta = await apiProdutos.excluir(codigo);
    await carregarProdutos();
    return resposta;
}

export async function registrarSaidaAPI(dados) {
    const resposta = await apiSaidas.registrar(dados);
    await Promise.all([carregarProdutos(), carregarSaidas()]);
    return resposta;
}

export async function excluirSaidaAPI(id) {
    const resposta = await apiSaidas.excluir(id);
    await carregarSaidas();
    return resposta;
}

export async function obterResumoAPI() {
    const resposta = await apiProdutos.resumo();
    return resposta.dados;
}

export function iniciarSincronizacao(callbackAtualizacao) {
    setInterval(async () => {
        await carregarDados();
        if (callbackAtualizacao) callbackAtualizacao();
    }, 30000);
}
