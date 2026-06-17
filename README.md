# PHOTO TEST ENGINE 🚀

Bem-vindo ao repositório público do **Photo Test Engine**! 
Este é o espaço oficial para documentação, templates e discussões da comunidade sobre a nossa IDE de *Canvas Apps* baseada no Gemini e Sandpack.

> 🌟 **Experimente a versão completa e funcional:** [photo-test-engine.vercel.app](https://photo-test-engine.vercel.app/)

---

## 📖 O que é a Photo Test Engine?

A **Photo Test Engine** é um ambiente de desenvolvimento (IDE) ultrarrápido que roda direto no seu navegador. Ela permite testar, visualizar e desenvolver componentes e aplicações **React (TSX/JSX)** de maneira instantânea e isolada, simulando o ambiente do Gemini Canvas.

Seu principal objetivo é facilitar a criação de interfaces modernas sem a necessidade de instalar `node_modules`, configurar Webpack, Vite ou subir servidores locais. Tudo acontece em tempo real usando o poder do **Sandpack**.

## ✨ Principais Funcionalidades

* ⚡ **Preview Instantâneo**: Escreva o código e veja a mágica acontecer em milissegundos.
* 💾 **Auto-Save Inteligente**: Todo código digitado nas pastas `/CRIADO/` e `/MODIFICADO/` é salvo automaticamente no `localStorage` do seu navegador. Se der F5, você não perde nada!
* 📦 **Importação Flexível**:
  * Importe arquivos de projeto completos (`.json`).
  * Faça upload direto de arquivos de código soltos (`.tsx`, `.jsx`, `.txt`). O sistema vai injetar o arquivo nativamente na pasta `/MODIFICADO/` da sua sessão.
* 📤 **Exportação Cirúrgica**:
  * Baixe o projeto completo em formato JSON.
  * Baixe **apenas o componente** que você está visualizando nos formatos `TSX`, `JSX`, `TXT` ou `MD`. Perfeito para mandar para um amigo!
* 🛡️ **Estrutura de Pastas de Segurança**:
  * `/LEGADO/`: Arquivos base que formam o "Core" do ambiente. Apenas leitura.
  * `/AUTORAL/`: Espaço isolado (LocalHost) focado para o criador testar ideias ocultas no momento de deploy.
  * `/CRIADO/` e `/MODIFICADO/`: Seu playground livre. Toda a experimentação vai aqui.

---

## 🛠️ Como usar os arquivos de Projeto (.json)?

Se você recebeu um arquivo `.json` exportado da Engine, saiba que ele contém **todo o ecossistema** de um aplicativo React encapsulado.

Para usar:
1. Abra a Photo Test Engine.
2. Clique no botão **MANUAL** no cabeçalho ou vá direto ao botão **Importar...** (canto inferior esquerdo).
3. Selecione a aba de **Importar Projeto Completo** e faça o upload do arquivo `.json`.
4. O ambiente inteiro (com componentes, estilos e configuração) será restaurado no seu navegador!

### Dica para Desenvolvedores
Se você só quer extrair um componente de um projeto para usar no seu próprio VSCode, não precisa abrir o projeto todo: peça para quem criou exportar apenas o Arquivo Ativo como `TSX`.

---

## 💻 Interface Open Source (Para Desenvolvedores)

Neste repositório público, nós disponibilizamos o **código-fonte da Interface Visual (UI)** da Engine!
Na pasta `/src/VisualizadorArquivosUI.tsx`, você encontrará toda a base de apoio visual (modais, sistema de pastas, botões e layout do Sandpack) completamente **desacoplada do motor principal de execução (backend)**.

Isso significa que a comunidade pode utilizar este repositório como um _template estático_ para:
1. Aprender como o design, os modais e a acessibilidade da ferramenta foram estruturados.
2. Usar a nossa interface limpa e profissional para **criar o seu próprio motor de execução**! Sinta-se livre para clonar este projeto, injetar sua própria lógica de `localStorage`, nuvem ou roteamento (no lugar dos avisos estáticos), e construir a sua própria IDE em cima da nossa fundação visual.

---

## ☕ Como Apoiar

A Engine é construída com muito carinho e esforço pela equipe. Se ela está acelerando seu trabalho e quer nos dar uma força com os servidores e atualizações:

[Clique aqui para Acessar nosso Sistema de Suporte e Doação](https://33xl-support-system.vercel.app/)

Também não deixe de conferir o repositório principal no [GitHub @Cauan33XL](https://github.com/Cauan33XL) e nosso [Portfólio de Projetos](https://33xl-system-website.vercel.app/).

---

### Licença
Este projeto de documentação e seus templates são públicos para ajudar a comunidade. A Engine central segue as políticas autorais da equipe. Divirta-se criando Canvas Apps incríveis! 🎨
