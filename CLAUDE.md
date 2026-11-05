# Ember

Ember é um app de gestão para foodtrucks. A primeira usuária é a dona do foodtruck, num tablet Android em paisagem: primeiro cadastrando o cardápio em casa, depois no caixa, com fila. Depois virá uma versão web. O produto será vendido a outros foodtrucks, então nada pode ser específico de um foodtruck.

## Antes de criar ou alterar qualquer tela

1. Leia `../foodtruck-ds/design-system/README.md`: voz, cores, tipografia, layout em paisagem e os comportamentos que toda tela segue.
2. Leia o `components/<Comp>/README.md` de cada componente que for usar. As regras de uso estão lá; o visual está em `components/bundle.css`.
3. Leia o contrato da API em `https://foodtruck-api.fly.dev/openapi.json`, incluindo o guia de integração em `info.description`. Ele diz o que existe, a ordem do primeiro acesso, como tratar cada `code` de erro e o que ainda **não** existe (pedidos, caixa, fotos de item).

## Design system

- O design fica fora deste projeto, na pasta irmã `../foodtruck-ds/`: `design-system/` (tokens e componentes) e `design/screens/` (telas propostas). `design-system/` é a fonte da verdade do design. Use só os tokens de `tokens.json`/`tokens.css`; não invente cores, tamanhos ou espaçamentos.
- As prévias (`components/<Comp>/preview.html`) pressupõem `tokens.css` e `components/bundle.css` já carregados. Abertas soltas no navegador, aparecem sem estilo.
- Há uma vitrine do mesmo sistema no claude.ai: https://claude.ai/artifact/RaMiSAtEmHmwSAm45jYRMg. Se as duas divergirem, vale o que está em `../foodtruck-ds/`.
- As telas propostas são revisadas em https://claude.ai/artifact/9G6NafRExxv7Wb9HRgQnYA, publicada a partir de `../foodtruck-ds/index.html`.

## API

- Base: `https://foodtruck-api.fly.dev/api/v1`. Um único foodtruck. Login com e-mail e senha; sessão e erros conforme a seção Autenticação do guia (não existe cadastro, "esqueci a senha" nem troca de senha no app).
- Dinheiro em centavos inteiros na API; em reais (R$ 25,00) só na tela.
- Traduza erros a partir de `code`, nunca de `message`.

## Expo

Regras do projeto Expo (comandos, Expo Router, development build): @AGENTS.md
