# Guia de Acessibilidade (A11y)

Acreditamos que boas ferramentas de desenvolvimento devem ser inclusivas. A interface da **Photo Test Engine** foi construída visando princípios sólidos de UX e UI que facilitam a vida de quem está operando o ambiente.

Este documento explica os esforços e recursos de acessibilidade embutidos na nossa ferramenta.

## 1. Cores e Contraste
A Photo Test Engine usa como base um tema escuro profissional (`#0a0a0a` para o fundo). 
- Textos utilizam tons de cinza claro (`#cccccc` e `#888888`) que atendem ou excedem os padrões de contraste recomendados para redução de fadiga ocular.
- Botões de ações primárias possuem destaque (como o ciano `#0ea5e9` no **Run Preview** e o coral `#f48771` em **Apoiar**), permitindo que olhos focados identifiquem instintivamente ações críticas sem esforço cognitivo excessivo.

## 2. Tipografia Limpa
O ambiente utiliza fontes `sans-serif` escaláveis. Além disso, o cabeçalho usa uma fonte distintiva (`Xirod`) de maneira ponderada, apenas no título, preservando a interface de uso prático com fontes nativas de leitura do sistema. 

## 3. Navegação Contextual Modais (Focus Management)
A estrutura moderna da Engine faz amplo uso de **Modais Interativos** (Exportar, Importar, Apoiar, Manual, API Key).
- Estes modais possuem `backdrop-blur` (desfoque de fundo) para tirar completamente a atenção do cenário de fundo. A sobrecarga de informação cai para zero e o usuário precisa focar apenas no painel ativo no centro da tela.
- **Micro-interações:** Toda ação nos botões tem retorno instantâneo (hover, mudança de cor), facilitando para quem tem deficiências motoras e precisa ter certeza de onde está focado.

## 4. Estrutura Preditiva (Hierarquia do Layout)
- **Cabeçalho Fixo (Topo):** Ações estáticas e configurações globais (API, Suporte, Configurações de Manual).
- **Rodapé Fixo (Abaixo da Esquerda):** Botões universais de Importação e Exportação do código.
- **Painel Central Esquerdo:** A árvore de diretórios (File Explorer), seguindo um padrão mental idêntico aos de editores de código consagrados (VSCode), para que a transição seja intuitiva sem curva de aprendizado.
- **Painel Central Direito:** Editor de Código.

## 5. Limitação de Sobrecarga Cognitiva (Auto-Save Silencioso)
Para quem sofre de estresse de produtividade (como esquecer de salvar o projeto e perder progresso), o sistema atua como uma barreira psicológica de conforto: não existe um botão massante de "Salvar Arquivo". O sistema salva a cada alteração em `localStorage` automaticamente.

## 6. Atalhos Visuais (Iconografia)
Todas as ações complexas (Importar, Exportar, Apoiar, Executar, Abrir API) são acompanhadas de **Ícones Vetoriais SVG (Lucide-like)**. Estes ícones facilitam pessoas que possuem facilidade com linguagem universal, complementando os rótulos de texto de cada ação.

## Relate Problemas de Acessibilidade
Sempre podemos melhorar! Se você encontrou dificuldades na navegação, uso de teclado ou leitores de tela em nossa IDE, abra uma *Issue* neste repositório. Queremos saber e queremos melhorar.
