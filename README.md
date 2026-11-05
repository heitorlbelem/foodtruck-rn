# Ember

App de cadastro do cardápio (categorias, itens, adicionais e combos) para tablet Android em paisagem. Expo SDK 58, Expo Router e TypeScript, rodando como **development build**.

## Rodar

Pré-requisitos: Node 24, Android Studio com um emulador ou um tablet conectado, e `ANDROID_HOME` apontando para o SDK (no macOS: `~/Library/Android/sdk`).

```sh
npm install
npm run android   # gera a pasta android/, compila e instala o development build
npm start         # depois da primeira vez: só o Metro; abra o app já instalado
```

Gere o build de novo (`npm run android`) só quando mudar dependência nativa ou o `app.json`.

### API

Por padrão o app usa `https://foodtruck-api.fly.dev/api/v1`. Para usar a API local (`../foodtruck`, `npm run dev`), crie um `.env.local`:

```sh
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api/v1   # emulador Android; num aparelho, use o IP do computador
```

### Conta para entrar

O app exige login. As contas são criadas no terminal da API (`../foodtruck`), nunca pelo app:

```sh
npm run users -- create --email dono@exemplo.com --name "Dono"   # local; a senha é pedida sem eco
fly ssh console -C "npm run users -- create --email dono@exemplo.com --name Dono"   # produção
```

## Estrutura

MVVM simples: o **Model** é a API e o estado do cardápio; cada tela e cada painel tem um **ViewModel** (hook `useXxx`) com estado, regras e textos derivados; a **View** (`.tsx`) só desenha o que o ViewModel entrega.

```
src/
  app/            rotas (Expo Router), só reexportam as telas de features/; _layout (barra + toast)
  features/
    menu/         tela Cardápio: MenuScreen + useMenuScreen; CategoryForm/ItemForm + useCategoryForm/useItemForm
    addons/       tela Adicionais: AddonsScreen + useAddonsScreen; AddonForm + useAddonForm
    combos/       tela Combos: CombosScreen + useCombosScreen; ComboForm + useComboForm; ComboRowView
    shared/       peças das telas ligadas ao cardápio: WithMenu, EditorPanel, FieldGroup, useForm
  model/          estado do cardápio (GET /menu), seletores, textos e useEditor (salvar, arquivar, desfazer, erros por `code`)
  api/            cliente HTTP e tipos do contrato
  components/     componentes do design system, sem dados (Button, Chip, TextField, ItemCard, Grid, NavRail, SidePanel…)
  lib/            dinheiro (centavos ↔ R$) e plural
  theme.ts        tokens copiados de ../foodtruck-ds/design-system/tokens.json
```

Tela nova: crie `features/<feature>/` com a View (`<Feature>Screen.tsx`) e o ViewModel (`use<Feature>Screen.ts`) e uma rota em `app/` que só reexporta a tela.

O código (pastas, arquivos, rotas, nomes e comentários) fica em inglês; os textos que aparecem na tela ficam em português.

## Fontes e ícones

Nunito (de `@expo-google-fonts/nunito`) e Material Symbols Rounded vão embutidas no app pelo plugin `expo-font` em `app.json`. As fontes de ícone em `assets/fonts/` têm **só os ícones usados**, para ficarem pequenas. Para adicionar um ícone, baixe de novo as duas (preenchimento 0 e 1) com o nome dele em `icon_names` e acrescente o codepoint em `src/components/Icon.tsx`:

```
https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0,0&icon_names=add,add_circle,archive,check,close,logout,lunch_dining,remove,restaurant_menu,schedule,undo,visibility,visibility_off
```

## Verificar

```sh
npm test
npm run typecheck
npm run lint
npx expo-doctor
```
