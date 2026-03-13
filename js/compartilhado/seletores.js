export const pegar = (seletor) => document.querySelector(seletor);
export const pegarTodos = (seletor) => document.querySelectorAll(seletor);

export const elementos = {
    botoesMenu:        pegarTodos('.menu-lateral__botao'),
    menuLateral:       pegar('#menuLateral'),
    botaoMenu:         pegar('#botaoMenu'),
    botaoFecharMenu:   pegar('#botaoFecharMenu'),
    fundoMenu:         pegar('#fundoMenu'),
    formularioEntrada: pegar('#formularioEntrada'),
    formularioSaida:   pegar('#formularioSaida'),
    formularioEdicao:  pegar('#formularioEdicao'),
    listaProdutos:     pegar('#listaProdutos'),
    listaSaidas:       pegar('#listaSaidas'),
    vazioEstoque:      pegar('#vazioEstoque'),
    vazioSaidas:       pegar('#vazioSaidas'),
    modalFundo:        pegar('#modalFundo'),
    modalFechar:       pegar('#modalFechar'),
    botaoCancelar:     pegar('#botaoCancelarEdicao'),
    saidaCodigo:       pegar('#saidaCodigo'),
    saidaDescricao:    pegar('#saidaDescricao'),
    buscaProdutos:     pegar('#buscaProdutos'),
    buscaSaidas:       pegar('#buscaSaidas'),
    totalPecas:        pegar('#totalPecas'),
    valorTotal:        pegar('#valorTotalEstoque'),
    notificacoes:      pegar('#notificacoes')
};
