# María Luz · Gestão de ensaios

O sistema ativo usa Google Apps Script para o painel e Google Sheets para armazenar os pedidos. Supabase não é necessário.

## Acesso

Abra o sistema: https://script.google.com/macros/s/AKfycbxv9Cx8EHz6Md_P2xTBFOMsNQ_rlKR0Rb1Y9y4-UoSVK55FwEowF1ZBPqzfm52ABxx69Q/exec

A implantação está restrita à conta Google proprietária. Você e Albert precisam estar conectados à mesma conta autorizada para usar esse endereço. A página index.html deste repositório tem um botão para abrir o sistema.

## Uso

1. Clique em Novo ensaio e preencha data, telefone, quantidade de fotos, temas, link do Google Fotos e instruções.
2. Albert já está selecionado na produção e revisão. Não há valor, moeda, identificação do bebê ou botão de WhatsApp.
3. Acompanhe os status Pendente, Em produção, Em revisão e Finalizado.
4. Para finalizar, marque os sete itens do checklist. O servidor também exige essa verificação.
5. Use Atualizar para buscar alterações feitas pela outra pessoa.

## Armazenamento

Os pedidos são gravados na aba Pedidos do sistema da planilha selecionada. Edite pedidos pelo painel; a última coluna oculta guarda os dados utilizados pelo sistema e não deve ser alterada. As outras abas não são usadas pelo painel. Não há migração automática de dados do antigo modo local ou Supabase.

O servidor usa bloqueio de gravação e versão por pedido para impedir que alterações concorrentes sobrescrevam silenciosamente outro trabalho. Não há exclusão pela interface.

## Código e manutenção

Os arquivos em apps-script/ são a base do aplicativo. O ID da planilha foi omitido do modelo público do servidor. A cópia configurada está no projeto privado do Apps Script. Alterações no GitHub não atualizam automaticamente o Apps Script: edite os arquivos no projeto e atualize a implantação existente.

supabase.sql é uma alternativa antiga e não precisa ser executado para usar a versão atual.

## Verificação

Painel publicado e conectado. Cadastro fictício salvo, recuperado após recarregar e atualizado para Finalizado. Finalização com checklist incompleto bloqueada. Pedido fictício removido após a validação.
