# Fluxo de Arquivos e Pastas

Para manter a segurança e organização dentro da **Photo Test Engine**, o ambiente simula um pequeno File System (Sistema de Arquivos) com regras restritas para algumas pastas e liberdade total para outras.

Ao iniciar o ambiente, você verá as seguintes pastas padrão na raiz da sua Workspace:

## 📁 /LEGADO/
Esta é a pasta "Core" (Núcleo) da Engine.
- **Função:** Guarda arquivos críticos de UI, estilo global (`index.css`) ou componentes de base vitais para a renderização limpa do ambiente.
- **Segurança:** O sistema bloqueia a edição destes arquivos e bloqueia cópias ou novas criações dentro desta pasta. Ela serve exclusivamente como base imutável para a inicialização e referência. Se você tentar editá-la, um aviso de "Acesso Negado (Read-only)" será disparado.

## 📁 /AUTORAL/
O "Quarto dos Fundos" do criador da Engine.
- **Função:** Serve para armazenar ideias não prontas, códigos em fase alfa de construção e testes paralelos que não devem ir a público ainda.
- **Segurança:** Quando a Engine for exportada em versão final para implantação em produção (Deploy via Vercel, Firebase, etc), o conteúdo que estiver na pasta AUTORAL é ocultado por questões de segurança (usando restrições de `location.hostname`). Funciona apenas no seu ambiente de `localhost`.

## 📁 /CRIADO/
- **Função:** É o local de trabalho sugerido para começar a experimentar. Contém normalmente o `App.tsx` inicial de entrada (Root) que liga as engrenagens visuais.
- **Segurança:** Você tem total liberdade de criação aqui. Pode copiar, deletar ou modificar os arquivos. Edições feitas nessa pasta são rastreadas pelo Auto-Save do seu navegador. O único detalhe é que se você apagar o `App.tsx` e der F5 (recarregar), o arquivo base volta (para garantir que a raiz da Engine nunca pare de funcionar).

## 📁 /MODIFICADO/
O local de pouso de arquivos externos!
- **Função:** Semelhante à pasta `/CRIADO/`, você tem total liberdade aqui.
- **Regra de Injeção Automática:** Toda vez que você duplica um arquivo do Legado, essa cópia vai direto para `/MODIFICADO/`. 
- **Importação Individual:** Se você for no botão de "Importar..." e subir 10 componentes em TSX separados do seu computador local, o sistema injeta magicamente todos eles aqui dentro, mantendo os outros arquivos intactos. 

---

### Entendendo a Raiz (index.tsx e index.html)
A Engine utiliza de forma invisível arquivos estruturais de inicialização.
O `index.html` não pode ser editado pelo usuário no ambiente Canvas por limitações do Sandpack em relação à montagem dinâmica de módulos. O `index.tsx` é estático e roteia dinamicamente o arquivo que você seleciona na árvore da esquerda para injetá-lo na tela à direita, permitindo uma transição fluida sem *reload* de estado em toda troca de aba!
