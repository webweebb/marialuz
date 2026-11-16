# María Luz · Gestão de ensaios

Painel em português com pedidos, pesquisa, filtros, responsáveis e checklist obrigatório para finalizar. Telefone em texto, sem link ou botão de WhatsApp.

## Ativar para a equipe

1. Crie um projeto em https://supabase.com. Execute `supabase.sql` uma vez no SQL Editor do projeto novo.
2. Em Authentication, desative o cadastro público. Crie os usuários da administração e do suporte em Users, com e-mail e senha. Não use contas de clientes.
3. Para cada usuário, copie o UUID e execute no SQL Editor: `insert into public.team_members (user_id) values ('UUID-DO-USUARIO');`.
4. Em Project Settings / API, copie a Project URL e a chave **publishable** ou **anon**. Nunca use uma chave secret/service_role no site.
5. Publique os arquivos em uma hospedagem estática. No GitHub: Settings → Pages → Deploy from a branch → main → / (root). Se Pages não estiver disponível, use uma hospedagem compatível, como Vercel.
6. Abra o endereço publicado, clique em **Conexão**, preencha a URL e a chave pública e entre com seu usuário. Faça a mesma configuração no navegador de cada pessoa da equipe.
7. Para revogar acesso, remova o UUID de `team_members` pelo painel do banco.

Não coloque senhas ou pedidos reais no repositório. O banco exige autenticação e autorização em `team_members`; todo membro autorizado pode consultar, criar e editar os pedidos. Não há exclusão de pedidos pela interface. A identidade da última alteração fica registrada no banco em `updated_by`. Os responsáveis pela produção e revisão têm a opção Albert predefinida. Essa opção não cria uma conta: o acesso precisa ser cadastrado e autorizado no Supabase.

## Uso

Cadastre data, telefone, quantidade, temas, álbum do Google Fotos e instruções. Nome de identificação, valor e moeda foram retirados da interface. Os campos antigos permanecem no banco para compatibilidade e preservação dos pedidos existentes; novos pedidos usam valores técnicos neutros nesses campos. Acompanhe os quatro status. Para finalizar, marque os sete itens e confira o revisor Albert. O banco também valida essa regra. Alterações simultâneas no mesmo pedido são recusadas por controle de versão; atualize e reabra para conferir a alteração da outra pessoa. Clique em Atualizar para buscar alterações da equipe.

O modo de teste local funciona sem conta; grava apenas no navegador atual. Ele não compartilha pedidos e não migra dados de teste para o banco. O login real mantém a sessão somente na memória: ao recarregar ou fechar a página será necessário entrar novamente. A conexão pública é lembrada neste navegador.

## Validação

Sintaxe do JavaScript e verificações estáticas executadas antes do envio. A conexão real, políticas SQL e login precisam ser validados no projeto Supabase após sua configuração; nenhum projeto ou usuário Supabase foi criado automaticamente.
