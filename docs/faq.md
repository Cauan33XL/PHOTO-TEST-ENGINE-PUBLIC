# Perguntas Frequentes (FAQ) & Dúvidas Comuns

Bem-vindo ao FAQ oficial da **Photo Test Engine**. Aqui cobrimos as principais dúvidas que os desenvolvedores e a comunidade têm ao usar o ambiente.

## 1. Por que a tela de "Preview" fica branca ou dá erro?
Isso ocorre geralmente por dois motivos:
- O arquivo que você selecionou no painel lateral não é um componente válido (`.tsx` ou `.jsx`) que pode ser renderizado como raiz.
- O código do componente possui erros de sintaxe graves. Verifique o console interno do Sandpack.
*Solução:* Tente voltar para o arquivo `App.tsx` e veja se o Preview volta a funcionar.

## 2. A Engine apaga meus arquivos quando recarrego a página (F5)?
**Não mais!** O ambiente conta com um sistema inteligente de *Auto-Save* em `localStorage`.
- Arquivos nas pastas `/CRIADO/` e `/MODIFICADO/` são salvos automaticamente (com um limite de segurança de 50 arquivos por pasta para não sobrecarregar a memória do seu navegador).
- **Atenção:** Arquivos da pasta `/LEGADO/` são imutáveis.

## 3. O que acontece se eu apagar o `App.tsx` que vem de fábrica?
Se você excluir um arquivo que faz parte do *template base* e recarregar a página, a Engine trará ele de volta para garantir que o projeto sempre consiga ser executado. O template básico atua como uma "rede de segurança".

## 4. Onde vejo o console de erros?
Os erros de compilação ou de sintaxe aparecerão diretamente na sobreposição de erro (Error Overlay) na tela do Preview. Caso você insira APIs restritas, os logs estarão visíveis no painel de Terminal do próprio desenvolvedor no Chrome (teclando F12).

## 5. Como eu incluo bibliotecas como Tailwind ou Framer Motion?
A Photo Test Engine já injeta bibliotecas úteis de forma nativa! O Tailwind CSS já é injetado via CDN (`https://cdn.tailwindcss.com`) em todas as instâncias do Preview, e o Framer Motion e Lucide Icons estão declarados como dependências internas. Se precisar de outras bibliotecas externas, você pode modificar o array de `dependencies` na exportação e importação.

## 6. Por que não consigo exportar a foto da tela do Preview em PNG?
Como o Preview é encapsulado de forma ultrassegura em um `iframe` *sandboxed* cruzado (CORS), navegadores modernos bloqueiam scripts que tentam "tirar print" do conteúdo de iframes externos para proteger os usuários contra captura de dados maliciosos. A melhor forma de tirar foto do resultado é usando o atalho de Captura de Tela do seu Sistema Operacional.

## 7. Como insiro minha Chave de API (Gemini)?
No cabeçalho da Engine, há um botão chamado **API KEY**. Clique nele e insira sua chave. A Engine vai salvar sua chave no seu próprio navegador e injetá-la de maneira segura no contexto dos seus testes. Não se preocupe, a chave nunca é enviada para os nossos servidores, pois a Engine roda 100% no cliente.
